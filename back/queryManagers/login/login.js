const {MongoClient} = require("mongodb");
const mongoDBConnection = require('../mongoDBConnection');


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
                let currentUser=JSON.parse(body);
                let userInfo={
                    username: currentUser.username,
                    password: currentUser.password,
                }
                mongoDBConnection.findInDataBase(response,userInfo,"log");
            });
        }
        else{
            response.statusCode = 400;
            response.end(`Something in your request (${request.url}) is strange...`);
        }
}

exports.manage = manageRequest;
