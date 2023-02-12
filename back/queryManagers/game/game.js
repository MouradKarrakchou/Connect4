const {MongoClient, ObjectId} = require("mongodb");
const mongoDBConnection = require("../mongoDBConnection");

function manageRequest(request, response) {
    console.log("in manageRequest in game.js")

    const MongoClient = require('mongodb').MongoClient;

    const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    let filePath = request.url.split("/").filter(function(elem) {
        return elem !== "..";
    });
    if (request.method==='POST') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        if (filePath[3]==null){
            request.on('end', function () {
                mongoDBConnection.createInDataBase(response,JSON.parse(body),"games");
            });
            }
        else if(filePath[3]==="retrieveGames"){
            request.on('end', function () {
                let currentUser=JSON.parse(body);
                let userInfo={
                    userToken: currentUser.token,
                }
                mongoDBConnection.findEverythingInDataBase(response,userInfo,"games");
            });
        }

        else if(filePath[3]==="retrieveGameWithId"){
            request.on('end', function () {
                async function retriveGames() {
                    try {
                        console.log("retrieveGameWithId")
                        await client.connect();
                        let bodyParsed=JSON.parse(body);
                        console.log(bodyParsed);
                        console.log('Connected to MongoDB');
                        const db = client.db("connect4");
                        //await db.addUser("admin", "admin", {roles: [{role: "readWrite", db: "connect4"}]});
                        const gameCollection = db.collection("games");

                        let games = (await gameCollection.find({
                            userToken: {$regex: new RegExp(bodyParsed.token, 'i')},
                        }).toArray())
                        games=games.filter(game => game._id.toString() === bodyParsed.id);
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify(games[0]));
                    } catch (err) {
                        console.error('Failed to create database or user', err);
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({ status: 'failure' }));
                    } finally {
                        await client.close();
                    }
                }
                retriveGames();
            });

        }
        else if(filePath[3]==="deleteGame"){
            request.on('end', function () {
                async function deleteOneGame() {
                    try {
                        console.log("deleteOneGame")
                        await client.connect();
                        let bodyParsed=JSON.parse(body);
                        console.log(bodyParsed);
                        console.log('Connected to MongoDB');
                        const db = client.db("connect4");
                        const gameCollection = db.collection("games");
                            const result = await gameCollection.deleteMany({token: bodyParsed.token});
                            console.log("Document deleted", result.deletedCount);
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.end(JSON.stringify({ status: 'success' }));
                    } catch (err) {
                        console.error('Failed to delete the game', err);
                        response.writeHead(400, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({ status: 'failure' }));
                    } finally {
                        await client.close();
                    }
                }
                deleteOneGame();
            });
        }
    }
    else{
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }

}

exports.manage = manageRequest;
