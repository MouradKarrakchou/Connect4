const {MongoClient} = require("mongodb");
let roomInSearch=null;
const mapGames= new Map();

function setUpSockets(io){
    const MongoClient = require('mongodb').MongoClient;

    const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    async function retrieveUserFromDataBase(token){
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db("connect4");
        //await db.addUser("admin", "admin", {roles: [{role: "readWrite", db: "connect4"}]});
        const gameCollection = db.collection("games");

        const collection = db.collection("log");
        const item = await collection.findOne({token:token});
        return item;
    }

    let connectedSockets = io.sockets.sockets;

    io.on('connection',socket => {
        socket.on('searchMultiGame', async (playerReq) => {
            let player = JSON.parse(playerReq);
            let roomName = player.room;
            socket.join(roomName);
            let user = await retrieveUserFromDataBase(player.token);

            io.to(roomName).emit('inQueue', null);
            if (roomInSearch == null) {
                roomInSearch = {
                    room: player.room,
                    userID: user._id.toString(),
                    username:user.username,
                    ready: false
                }
            } else if(user._id.toString()!==roomInSearch.userID) {
                let matchID = getRandomNumber(0, 100000000000) + '';
                const matchInfo = {
                    player1: {
                        room: roomInSearch.room,
                        userID: roomInSearch.userID,
                        username:roomInSearch.username,
                        ready: false
                    },
                    player2: {
                        room: player.room,
                        userID: user._id.toString(),
                        username:user.username,
                        ready: false
                    },
                    board: createBoard()
                };
                console.log("LES INFOS ")
                console.log(matchInfo)
                mapGames.set(matchID, matchInfo);
                io.to(roomInSearch.room).emit('matchFound', matchID);
                io.to(roomName).emit('matchFound', matchID);
                roomInSearch = null;
            }
            console.log("at the end" + roomInSearch);
        })
        socket.on('cancelQueue', async (playerReq) => {
            let player = JSON.parse(playerReq);
            let user = await retrieveUserFromDataBase(player.token);

            if (roomInSearch != null && roomInSearch.userID===user._id.toString()) {
                let roomName = roomInSearch.room;
                roomInSearch=null;
                io.to(roomName).emit('cancel');
            }
        })

        socket.on('initMulti', async (playerReq) => {
            let request = JSON.parse(playerReq);
            let gameInfo = mapGames.get(request.matchID);
            let user = await retrieveUserFromDataBase(request.token);

            if (user._id.toString() === gameInfo.player1.userID) {
                console.log("player1"+user.username);
                socket.join(gameInfo.player1.room);
                io.to(gameInfo.player1.room).emit('firstPlayerInit', undefined);
            } else if (user._id.toString() === gameInfo.player2.userID) {
                console.log("player2"+user.username);
                socket.join(gameInfo.player2.room);
                io.to(gameInfo.player2.room).emit('secondPlayerInit', undefined);
            }
        })
        socket.on('chat', async (playerReq) => {
            let request = JSON.parse(playerReq);
            let gameInfo = mapGames.get(request.matchID);
            let user = await retrieveUserFromDataBase(request.token);
            if (user._id.toString() === gameInfo.player1.userID) {
                io.to(gameInfo.player2.room).emit('message', {
                    username:gameInfo.player1.username,
                    message:request.chat
                });
            } else if (user._id.toString() === gameInfo.player2.userID) {
                io.to(gameInfo.player1.room).emit('message', {
                    username:gameInfo.player2.username,
                    message:request.chat
                });
            }
        })

        socket.on('playMulti', async (playerReq) => {
            let request = JSON.parse(playerReq);
            console.log(playerReq);
            let gameInfo = mapGames.get(request.matchID);
            console.log(mapGames);
            let moveToCheck;
            let user = await retrieveUserFromDataBase(request.token);
            if (user._id.toString() === gameInfo.player1.userID && !checkIllegalMove(gameInfo.board, request.pos[0], 1)) {
                gameInfo.board[request.pos[0]][request.pos[1]] = 1;
                io.to(gameInfo.player2.room).emit('doMoveMulti', JSON.stringify(request.pos));
                moveToCheck = {
                    board: gameInfo.board,
                    playerTurn: 1,
                    i: request.pos[1],
                    j: request.pos[0],
                }
            } else if (user._id.toString() === gameInfo.player2.userID && !checkIllegalMove(gameInfo.board, request.pos[0], -1)) {
                gameInfo.board[request.pos[0]][request.pos[1]] = -1;
                io.to(gameInfo.player1.room).emit('doMoveMulti', JSON.stringify(request.pos));
                moveToCheck = {
                    board: gameInfo.board,
                    playerTurn: -1,
                    i: request.pos[1],
                    j: request.pos[0],
                }
            } else {
                return;
            }
            let check = checkMove(moveToCheck);
            if (check.state === "over") {
                if (check.winner === 1) {
                    io.to(gameInfo.player1.room).emit('win', null);
                    io.to(gameInfo.player2.room).emit('lose', null);
                } else if (check.winner === 0) {
                    io.to(gameInfo.player1.room).emit('tie', null);
                    io.to(gameInfo.player2.room).emit('tie', null);
                } else {
                    io.to(gameInfo.player1.room).emit('lose', null);
                    io.to(gameInfo.player2.room).emit('win', null);
                }
            }

        })

        // Store the username linked to this socket
        socket.on('socketByUsername', function(data) {
            socket.username = data.username;
        });

        socket.on('challengeFriend', (playerReq) => {
            let request = JSON.parse(playerReq);
            let name = request.name;
            let friendToChallenge = request.friendToChallenge;

            let friendSocket = findSocketByName(friendToChallenge, connectedSockets);

            if (friendSocket !== null) {
                friendSocket.emit('friendIsChallenging', JSON.stringify({
                    name: name,
                }))
            }
            else {
                let userSocket = findSocketByName(name, connectedSockets);
                if (userSocket !== null) {
                    userSocket.emit('notConnectedMessage', friendToChallenge);
                }
            }
        })

        socket.on('IAcceptTheChallenge', (data) => {
            const friendWhoChallenged = data.friendWhoChallenged;
            const username = data.username;
            const friendSocket = findSocketByName(friendWhoChallenged, connectedSockets);
            const userSocket = findSocketByName(username, connectedSockets);

            let matchID = friendWhoChallenged + username + getRandomNumber(0,100000000000) + '';

            const matchInfo = {
                player1: {
                    name: friendWhoChallenged,
                },
                player2: {
                    name: username,
                },
                board:createBoard()
            };

            mapGames.set(matchID, matchInfo);
            friendSocket.join(matchID);
            userSocket.join(matchID);
            io.to(matchID).emit('challengeAccepted', matchID);
        })

        socket.on('IDeclineTheChallenge', (data) => {
            findSocketByName(data.friendWhoChallenged, connectedSockets).emit('challengeDeclined', data.username);
        })
    })
}

function findSocketByName(name, connectedSockets) {
    let socketFound = null;

    for (const [key, socket] of connectedSockets) {
        if (socket.username === name) {
            socketFound = socket;
            break;
        }
    }
    return socketFound;
}

function createBoard() {
    return [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];
}

/*
const moveToCheck = {
                board: move.board,
                playerTurn: move.playerTurn,
                i: move.i,
                j: move.password,
            }
 */

function checkMove(moveToCheck) {
    let board = moveToCheck.board
    let column = parseInt(moveToCheck.j);
    let line = parseInt(moveToCheck.i);
    console.log("colonne "+ column);
    console.log("line "+ line);

    const player = board[column][line];
    let count = 1;
    let j = line;
    while (j > 0 && board[column][j - 1] === player) {
        j--;
        count++;
    }
    j = line;
    while (j < board[column].length - 1 && board[column][j + 1] === player) {
        j++;
        count++;
    }
    if (count >= 4) return {
        state: "over",
        winner: moveToCheck.playerTurn
    };

    // Check horizontal
    count = 1;
    let i = column;
    while (i > 0 && board[i - 1][line] === player) {
        i--;
        count++;
    }
    i = column;
    console.log(board[0]);
    console.log(board[1]);
    console.log(board[2]);
    console.log(board[3]);
    console.log(board[4]);
    console.log(board[5]);
    console.log(board[6]);
    console.log("LE I "+i);
    console.log("LE board de i "+board[i] );
    console.log("LE I+1 "+(i+1));
    console.log("LE board de i+1 "+board[i+1] );
    console.log("LE BOARD DE 4"+board[4] )
    while (i < board.length - 1 && board[i + 1][line] === player) {
        i++;
        count++;
        console.log("LE I "+i);
        console.log("LE board "+board[i+1] );
    }
    if (count >= 4) return {
        state: "over",
        winner: moveToCheck.playerTurn
    };

    // Check diagonal (top-left to bottom-right)

    count = 1;
    i = column;
    j = line;
    while (i > 0 && j > 0 && board[i - 1][j - 1] === player) {
        i--;
        j--;
        count++;
    }
    i = column;
    j = line;
    while (i < board.length - 1 && j < board[column].length - 1 && board[i + 1][j + 1] === player) {
        i++;
        j++;
        count++;
    }
    if (count >= 4) return {
        state: "over",
        winner: moveToCheck.playerTurn
    };

    // Check diagonal (bottom-left to top-right)
    count = 1;
    i = column;
    j = line;
    while (i > 0 && j < board[column].length - 1 && board[i - 1][j + 1] === player) {
        i--;
        j++;
        count++;
    }
    i = column;
    j = line;
    while (i < board.length - 1 && j > 0 && board[i + 1][j - 1] === player) {
        i++;
        j--;
        count++;
    }

    if (count >= 4) return {
        state: "over",
        winner: moveToCheck.playerTurn
    };

    else if (checkDraw(board)) return {
        state: "over",
        winner: 0
    }

    return {
        state: "continue",
        winner: "None"
    }
}

function checkDraw(board) {
    // Returns true if the board is full and there is no winner, false otherwise.
    for (let col = 0; col < 7; col++) {
        if (board[col][5] === 0) {
            return false;
        }
    }
    return true;
}

function checkIllegalMove(board, column, playerTurn) {
    if (isColumnFull(board, column)) return true;
    else if (hasPlayedTwice(board, playerTurn)) return true;
    return false;
}

function isColumnFull(board, column) {
    console.log("Illegal Move in Backend(full): " + (board[column][5] !== 0));
    return board[column][5] !== 0;
}

//player turn = 1 or -1
function hasPlayedTwice(board, playerTurn) {
    let sum = 0;
    for (let column = 0; column < 7; column++) {
        for (let line = 0; line < 6; line++) {
            sum += board[column][line];
        }
    }

    sum += playerTurn;
    console.log("Illegal Move in Backend(twice): " + (sum !== 0 || sum === 1));
    return !(sum === 0 || sum === 1);
}
function getRandomNumber(min, max) {
    // Calculate a random number between min and max, inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.setUpSockets = setUpSockets;
