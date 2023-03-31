const mongoDBConnection = require("../mongoDBConnection");

function manageRequest(request, response) {
    let filePath = request.url.split("/").filter(function(elem) {
        return elem !== "..";
    });

    if (request.method === 'POST'){
        let body='';
        request.on('data', function (data) {
            body += data;
        });

        if (filePath[3] === "friendRequest") {
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.friendRequest(response, values.from, values.friend);
            });
        }

        else if (filePath[3] === "retrieveFriendList") {
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.retrieveFriendList(response, values.token);
            });
        }

        else if (filePath[3] === "removeFriend") {
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.removeFriend(response, values.token, values.friendToRemove);
            });
        }

        else if (filePath[3] === "retrieveFriendRequest") {
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.retrieveFriendRequest(response, values.token);
            });
        }

        else if (filePath[3] === "acceptFriendRequest") {
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.acceptFriendRequest(response, values.token, values.friendToAccept);
            });
        }

        else if (filePath[3] === "declineFriendRequest") {
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.declineFriendRequest(response, values.token, values.friendToDecline);
            });
        }
        else if(filePath[3] === "retrieveNumberOfFriends"){
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.retrieveNumberOfFriends(response, values.token);
            });
        }


    }
    else{
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
}

exports.manage = manageRequest;
