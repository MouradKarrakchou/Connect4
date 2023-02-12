const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function createDatabaseAndUser(request,response,currentUser,collectionName) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db("connect4");
        //await db.addUser("admin", "admin", {roles: [{role: "readWrite", db: "connect4"}]});
        const usersCollection = db.collection(collectionName);

        const user = await usersCollection.findOne({
            username: { $regex: new RegExp(currentUser.username, 'i') },
            password: { $regex: new RegExp(currentUser.password, 'i') },
        });

        console.log(user);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({
            username:user.username,
            token:user.token,}));

    } catch (err) {
        console.error('Failed to create database or user', err);
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ status: 'failure' }));
    } finally {
        await client.close();
    }
}

exports.createDatabaseAndUser = createDatabaseAndUser;
