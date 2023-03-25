const mongoDBConnection = require("../mongoDBConnection");

function manageRequest(request, response) {
    console.log("FRIEND REQUEST: " + request.method);
    if (request.method==='POST'){
        console.log("AFTER IF IN MANAGE REQUEST");
        let body='';
        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            const values = JSON.parse(body);
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA: " + values.friend);
            const requestFrom = {
                token: values.from
            };
            const valueToInsert = {
                "requestState": "waiting",
                "friend": values.friend
            }
            console.log("REQUEST FROM: " + requestFrom);
            console.log("VALUE TO INSERT: " + valueToInsert);
            mongoDBConnection.friendRequest(response, requestFrom, valueToInsert);
        });
    }
    else{
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
}

exports.manage = manageRequest;
