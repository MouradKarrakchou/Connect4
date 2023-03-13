const mongoDBConnection = require('../mongoDBConnection');

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
                token:generate_token(32),}
            const valueToCheck={username:values.username,
                password:values.password,
                }
            mongoDBConnection.createInDataBase(response,valueToInsert,"log",valueToCheck);
        });
    }
    else{
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
}

function hash(data) {
    const encoder = new TextEncoder();
    const message = encoder.encode(data);
    return crypto.subtle.digest('SHA-256', message)
        .then(hash => {
            return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
        })
        .catch(err => {
            console.error(err);
        });
}

exports.manage = manageRequest;
exports.hash = hash;
