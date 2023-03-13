const mongoDBConnection = require('../mongoDBConnection');
const hashFunction = require('./register')

function manageRequest(request, response) {
        if (request.method==='POST') {
            let body = '';
            request.on('data', function (data) {
                body += data;
            });

            request.on('end', function () {
                let currentUser=JSON.parse(body);
                let userInfo={
                    username: currentUser.username,
                    password: hashFunction.hash(currentUser.password),
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
