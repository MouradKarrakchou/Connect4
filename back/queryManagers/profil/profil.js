const mongoDBConnection = require("../mongoDBConnection");
function manageRequest(request, response) {
    let filePath = request.url.split("/").filter(function (elem) {
        return elem !== "..";
    });
    if (request.method === 'POST') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        if (filePath[3] === "retrieveElo") {
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.retrieveElo(response, values.token);

            });
        } else if (filePath[3] === "retrieveWins") {
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.retrieveWins(response, values.token);

            });
        } else if (filePath[3] === "retrieveLosses") {
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.retrieveLosses(response, values.token);

            });
        } else if (filePath[3] === "retrieveDraws") {
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.retrieveDraws(response, values.token);

            });
        } else {
            response.statusCode = 400;
            response.end(`Something in your request (${request.url}) is strange...`);
        }
    }
}

exports.manage = manageRequest;