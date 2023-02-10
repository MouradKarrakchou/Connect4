function manageRequest(request, response) {
    if (request.method==='POST'){
        let body='';
        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            const values = JSON.parse(body);
            const username = values.username;
            const password = values.password;
            console.log(username);
            console.log(password);
            if (username === "admin" && password === "admin") {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({ status: 'success' }));
            } else {
                response.writeHead(400, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({ status: 'failure' }));
            }
        });
        response.writeHead(200, { 'message': 'Login successful' });
        response.end(JSON.stringify({ success: true }));
    }
    else{
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
}

exports.manage = manageRequest;
