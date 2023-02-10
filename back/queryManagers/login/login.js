
function manageRequest(request, response) {
        if (request.method==='POST'){
            let body='';
            request.on('data', function (data) {
            body += data;
            });

            request.on('end', function () {
                const values = {
                    username: "user"
                };
                if (true || (username === "admin" && password === "admin")) {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(values));
                } else {
                    response.writeHead(400, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({ status: 'failure' }));
                }
            });
        }
        else{
            response.statusCode = 400;
            response.end(`Something in your request (${request.url}) is strange...`);
        }
}


exports.manage = manageRequest;
