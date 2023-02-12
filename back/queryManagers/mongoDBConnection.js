const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function findInDataBase(response,currentUser,collectionName) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db("connect4");
        //await db.addUser("admin", "admin", {roles: [{role: "readWrite", db: "connect4"}]});
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


async function createInDataBase(response,valueToFind,collectionName) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db("connect4");
        //await db.addUser("admin", "admin", {roles: [{role: "readWrite", db: "connect4"}]});
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(valueToFind);
        console.log('Document inserted', result.insertedId);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'success' }));
    } catch (err) {
        console.error('Failed to create database or user', err);
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'failure' }));
    } finally {
        await client.close();
    }
}

exports.findInDataBase = findInDataBase;
exports.createInDataBase= createInDataBase;
