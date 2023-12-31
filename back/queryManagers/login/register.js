const mongoDBConnection = require('../mongoDBConnection');
const crypto = require("crypto");

/**
 * this function generates a random token
 * @param length
 * @returns {string}
 */
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

/**
 * This function manages the request to the register API
 * @param request
 * @param response
 */
function manageRequest(request, response) {
    if (request.method==='POST'){
        let body='';
        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            const values = JSON.parse(body);
            const valueToInsert={username:values.username,
                password:hash(values.password),
                email:values.email,
                token:generate_token(32),
                friends: [],
                requestSent: [],
                requestReceived: [],
                elo: 1000,
                wins: 0,
                losses: 0,
                draws: 0,
            }
            const valueToCheck={username:values.username,
                password:hash(values.password),
                }
            mongoDBConnection.createInDataBase(response,valueToInsert,"log",valueToCheck);
        });
    }
    else{
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
}

/**
 * This function hashes the password using sha256
 * @param data password to hash
 * @returns {string}
 */
function hash(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex')
}

exports.manage = manageRequest;
exports.hash = hash;
