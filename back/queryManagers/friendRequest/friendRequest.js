const mongoDBConnection = require("../mongoDBConnection");

function manageRequest(request, response) {
    if (request.method === 'POST'){
        let body='';
        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            const values = JSON.parse(body);
            const valueToInsert = {
                "requestState": "waiting",
                "friend": values.friend
            }
            mongoDBConnection.friendRequest(response, values.from, valueToInsert);
        });
    }
    else{
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
}

exports.manage = manageRequest;
