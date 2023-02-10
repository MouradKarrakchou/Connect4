function manageRequest(request, response) {
    response.statusCode = 200;
    response.end(`Thanks for calling ${request.url}`);
}
exports.manage = manageRequest;
