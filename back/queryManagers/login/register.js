const {MongoClient} = require("mongodb");
const crypto = require('crypto');

function generate_token(length){
    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

function manageRequest(request, response) {
    const MongoClient = require('mongodb').MongoClient;

    const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    if (request.method==='POST'){
        let body='';
        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            const values = JSON.parse(body);

            async function createDatabaseAndUser() {
                try {
                    await client.connect();
                    console.log('Connected to MongoDB');
                    const db = client.db("connect4");
                    //await db.addUser("admin", "admin", {roles: [{role: "readWrite", db: "connect4"}]});
                    const usersCollection = db.collection("log");
                    const result = await usersCollection.insertOne({
                        username:values.username,
                        password:crypto.createHash('sha256').update(values.password).digest('hex'),
                        email:values.email,
                        token:generate_token(32),
                    });
                    console.log('Document inserted', result.insertedId);
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({ status: 'success' }));
                } catch (err) {
                    console.error('Failed to create database or user', err);
                    response.writeHead(400, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({ status: 'failure' }));
                } finally {
                    await client.close();
                }
            }
            createDatabaseAndUser();
        });
    }
    else{
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
}

exports.manage = manageRequest;
