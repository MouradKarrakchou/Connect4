
function manageRequest(request, response) {
    console.log("before post")
    if (request.method==='POST'){
        let body='';
        request.on('data', function (data) {
            body += data;
        });
        console.log("le body -- ")

        request.on('end', function () {
            const successMessage = "Game saved!";
            const errorMessage = "Error. Please try again.";
            if (true || (body.gameBoard != null)) {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({ status: successMessage }));
                console.log(body)
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
