const mongoDBConnection = require("../mongoDBConnection");

function manageRequest(request, response) {
    if (request.method==='POST'){
        let body='';
        request.on('friendRequest', function (data) {
            body += data;
        });

        request.on('waitingFriendAnswer', function () {
            const values = JSON.parse(body);
            const requestFrom = {
                token: values.from
            };
            const valueToInsert = {
                requestState: "waiting",
                friend: values.friend
            }
            mongoDBConnection.friendRequest(response, requestFrom, valueToInsert);
        });
    }
    else{
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
}

exports.manage = manageRequest;
