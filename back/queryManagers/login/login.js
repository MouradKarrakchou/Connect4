const {MongoClient} = require("mongodb");
import {} from "../index";

function manageRequest(request, response) {
    const MongoClient = require('mongodb').MongoClient;

    const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

        if (request.method==='POST') {
            let body = '';
            request.on('data', function (data) {
                body += data;
            });

            request.on('end', function () {
                async function createDatabaseAndUser() {
                    try {
                        await client.connect();
                        let currentUser=JSON.parse(body);
                        console.log('Connected to MongoDB');
                        const db = client.db("connect4");
                        //await db.addUser("admin", "admin", {roles: [{role: "readWrite", db: "connect4"}]});
                        const usersCollection = db.collection("log");
                        console.log(currentUser);
                        console.log({username:currentUser.username,password:currentUser.password});
                        const user = await usersCollection.findOne({
                            username: { $regex: new RegExp(currentUser.username, 'i') },
                            password: { $regex: new RegExp(currentUser.password, 'i') },
                        });
                        console.log(user);
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({
                            username:user.username,
                            token:user.token,}));
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
