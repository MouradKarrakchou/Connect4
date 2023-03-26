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
            response.end(JSON.stringify({ status: 'User not found' }));
            return;
        }

        // finding the user who does the request
        const user = await collection.findOne({token: requestFrom});
        let userRequest = user.requestSent;
        let userFriends = user.friends;
        let userRequestReceived = user.requestReceived;

        // security to avoid spam request or to add a friend the user already has
        if (userRequest.includes(valueToInsert) || userFriends.includes(valueToInsert) || valueToInsert === user.username) {
            return;
        }

        // if both the users ask each other, they automatically accept each other
        if (userRequestReceived.includes(valueToInsert)) {
            await acceptFriendRequest(response, requestFrom, valueToInsert);
        }

        // adding the friend request in the user database
        userRequest.push(valueToInsert);
        await collection.updateOne({token: requestFrom}, {$set: {requestSent: userRequest}});

        // send the friend request to the friend
        let friendRequestReceived = friendItem.requestReceived;
        friendRequestReceived.push(user.username);
        await collection.updateOne({username: friendItem.username}, {$set: {requestReceived: friendRequestReceived}});

        // response
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'success' }));

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

async function removeFriend(response, requestFrom, friendToRemove) {
    const collectionName = "log";
    try {
        // database connection
        await client.connect();
        const db = client.db("connect4");
        const collection = db.collection(collectionName);

        // finding the user who does the request
        const user = await collection.findOne({token: requestFrom});
        const friend = await collection.findOne({username: friendToRemove});
        let userFriends = user.friends;
        let friendFriends = friend.friends;

        // finding and removing the friend to remove
        for (let i = 0; i < userFriends.length; i++) {
            if (userFriends[i] === friendToRemove) {
                userFriends.splice(i, 1);
                break;
            }
        }

        for (let i = 0; i < friendFriends.length; i++) {
            if (friendFriends[i] === user.username) {
                friendFriends.splice(i, 1);
                break;
            }
        }

        // update database
        await collection.updateOne({token: requestFrom}, {$set: {friends: userFriends}});
        await collection.updateOne({username: friendToRemove}, {$set: {friends: friendFriends}});

        // response
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'success' }));

    } catch (err) {
        console.error('Token not found', err);
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({status: 'failure'}));
    } finally {
        await client.close();
    }
}

async function retrieveFriendRequest(response, requestFrom) {
    const collectionName = "log";
    try {
        // database connection
        await client.connect();
        const db = client.db("connect4");
        const collection = db.collection(collectionName);

        // finding the user and its received friends requests
        const user = await collection.findOne({token: requestFrom});
        let userFriendRequests = user.requestReceived;

        // answer the data
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(userFriendRequests));

    } catch (err) {
        console.error('Token not found', err);
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({status: 'failure'}));
    } finally {
        await client.close();
    }
}

async function  acceptFriendRequest(response, requestFrom, friendToAccept) {
    const collectionName = "log";
    try {
        // database connection
        await client.connect();
        const db = client.db("connect4");
        const collection = db.collection(collectionName);

        // finding the user and the friend
        const user = await collection.findOne({token: requestFrom});
        const friend = await collection.findOne({username: friendToAccept});

        // adding each other as friend
        let userFriendList = user.friends;
        let friendFriendList = friend.friends;
        userFriendList.push(friend.username);
        friendFriendList.push(user.username);

        // update database
        await collection.updateOne({token: requestFrom}, {$set: {friends: userFriendList}});
        await collection.updateOne({username: friendToAccept}, {$set: {friends: friendFriendList}});

        // removing the received and sent requests
        let userRequestReceived = user.requestReceived;
        for (let i = 0; i < userRequestReceived.length; i++) {
            if (userRequestReceived[i] === friend.username) {
                userRequestReceived.splice(i, 1);
                break;
            }
        }

        let friendRequestSent = friend.requestSent;
        for (let i = 0; i < friendRequestSent.length; i++) {
            if (friendRequestSent[i] === user.username) {
                friendRequestSent.splice(i, 1);
                break;
            }
        }

        // update database
        await collection.updateOne({token: requestFrom}, {$set: {requestReceived: userRequestReceived}});
        await collection.updateOne({username: friendToAccept}, {$set: {requestSent: friendRequestSent}});

        // response
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'success' }));

    } catch (err) {
        console.error('Token not found', err);
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({status: 'failure'}));
    } finally {
        await client.close();
    }
}

async function  declineFriendRequest(response, requestFrom, friendToDecline) {
    const collectionName = "log";
    try {
        // database connection
        await client.connect();
        const db = client.db("connect4");
        const collection = db.collection(collectionName);

        // finding the user and the friend
        const user = await collection.findOne({token: requestFrom});
        const friend = await collection.findOne({username: friendToDecline});

        // removing the received and sent requests
        let userRequestReceived = user.requestReceived;
        for (let i = 0; i < userRequestReceived.length; i++) {
            if (userRequestReceived[i] === friend.username) {
                userRequestReceived.splice(i, 1);
                break;
            }
        }

        let friendRequestSent = friend.requestSent;
        for (let i = 0; i < friendRequestSent.length; i++) {
            if (friendRequestSent[i] === user.username) {
                friendRequestSent.splice(i, 1);
                break;
            }
        }

        // update database
        await collection.updateOne({token: requestFrom}, {$set: {requestReceived: userRequestReceived}});
        await collection.updateOne({username: friendToDecline}, {$set: {requestSent: friendRequestSent}});

        // response
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'success' }));

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
exports.removeFriend = removeFriend;
exports.retrieveFriendRequest = retrieveFriendRequest;
exports.acceptFriendRequest = acceptFriendRequest;
exports.declineFriendRequest = declineFriendRequest;

