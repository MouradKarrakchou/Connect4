
function manageRequest(request, response) {
    if (request.method==='POST'){
        let body='';
        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            const successMessage = "Game saved!";
            const errorMessage = "Error. Please try again.";
            if (true || (body.gameBoard != null)) {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({ status: successMessage }));
            } else {
                response.writeHead(400, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({ status: errorMessage }));
            }
        });
    }
    else{
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
}

exports.manage = manageRequest;
