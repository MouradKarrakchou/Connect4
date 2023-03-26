
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function findInDataBase(response,currentUser,collectionName) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db("connect4");
        const collection = db.collection(collectionName);
        console.log(currentUser);
        const item = await collection.findOne(currentUser);
        console.log(item);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(item));

    } catch (err) {
        console.error('Failed to create database or user', err);
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'failure' }));
    } finally {
        await client.close();
    }
}

async function createInDataBase(response,valueToFind,collectionName,verifValue) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db("connect4");
        const collection = db.collection(collectionName);
        const item = await collection.findOne(verifValue);
        if (item!=null) {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({status: 'failure'}));
        }
        else{
            const result = await collection.insertOne(valueToFind);
            console.log('Document inserted', result.insertedId);
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({ status: 'success' }));
        }
    } catch (err) {
        console.error('Failed to create database or user', err);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'failure' }));
    } finally {
        await client.close();
    }
}

async function findEverythingInDataBase(response,valueToFind,collectionName){
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db("connect4");
        //await db.addUser("admin", "admin", {roles: [{role: "readWrite", db: "connect4"}]});
        const collection = db.collection(collectionName);
        const items = await collection.find(valueToFind).toArray();
        console.log(items);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(items));
    } catch (err) {
        console.error('Failed to create database or user', err);
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'failure' }));
    } finally {
        await client.close();
    }
}

async function  friendRequest(response, requestFrom, valueToInsert) {
    const collectionName = "log";
    try {
        // database connection
        await client.connect();
        const db = client.db("connect4");
        const collection = db.collection(collectionName);

        // finding the friend to add
        const friendItem = await collection.findOne({username: valueToInsert});
        if (friendItem === null) {
            //TODO send a message to the user to tell him that the friend does not exist
        }

        // finding the user who does the request
        const user = await collection.findOne({token: requestFrom});
        let userRequest = user.requestSent;

        // security to avoid spam request
        if (userRequest.contains(valueToInsert)) {
            return;
        }

        // adding the friend request in the user database
        userRequest.push(valueToInsert);
        await collection.updateOne({token: requestFrom}, {$set: {requestSent: userRequest}});

        // send the friend request to the friend
        let friendRequestReceived = friendItem.request;
        friendRequestReceived.push(user.username);
        await collection.updateOne({username: friendItem.username}, {$set: {request: friendRequestReceived}});

    } catch (err) {
        console.error('Token not found', err);
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({status: 'failure'}));
    } finally {
        await client.close();
    }
}

async function retrieveFriendList(response, requestFrom) {
    const collectionName = "log";
    try {
        // database connection
        await client.connect();
        const db = client.db("connect4");
        const collection = db.collection(collectionName);

        // finding the user who does the request
        const user = await collection.findOne({token: requestFrom});
        let userFriends = user.friends;

        // answer the data
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(userFriends));

    } catch (err) {
        console.error('Token not found', err);
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({status: 'failure'}));
    } finally {
        await client.close();
    }
}

exports.findInDataBase = findInDataBase;
exports.createInDataBase = createInDataBase;
exports.findEverythingInDataBase = findEverythingInDataBase;
exports.friendRequest = friendRequest;
exports.retrieveFriendList = retrieveFriendList;
