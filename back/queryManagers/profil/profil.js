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
        if (filePath[3] === "retrieveAllStats") {
            request.on('end', function () {
                const values = JSON.parse(body);
                mongoDBConnection.retrieveAllStats(response, values.token, values.friendName);
            });
        }
        else {
            response.statusCode = 400;
            response.end(`Something in your request (${request.url}) is strange...`);
        }
    }
}

exports.manage = manageRequest;