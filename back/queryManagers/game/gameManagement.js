let roomInSearch=null;
const mapGames= new Map();

function setUpSockets(io){
    io.on('connection',socket => {
        socket.on('searchMultiGame', (playerReq) => {

            let player=JSON.parse(playerReq);
            let roomName=player.room;
            socket.join(roomName);
            io.to(roomName).emit('inQueue', null);

            if (roomInSearch==null){
                roomInSearch=player;
            }
            else {
                let matchID=getRandomNumber(0,100000000000)+'';
                const matchInfo = {
                    player1: {
                        room:roomInSearch.room,
                        token:roomInSearch.token,
                        ready:false
                    },
                    player2: {
                        room:player.room,
                        token:player.token,
                        ready:false
                    },
                    board:createBoard()
                };
                mapGames.set(matchID,matchInfo);
                io.to(roomInSearch.room).emit('matchFound',matchID);
                io.to(roomName).emit('matchFound',matchID);
                roomInSearch=null;
            }
            console.log("at the end"+roomInSearch);
        })

        socket.on('initMulti', (playerReq) => {
            let request=JSON.parse(playerReq);
            let gameInfo=mapGames.get(request.matchID);

            if (request.token===gameInfo.player1.token){
                socket.join(gameInfo.player1.room);
                io.to(gameInfo.player1.room).emit('firstPlayerInit',request.token);
            }
            else if(request.token===gameInfo.player2.token){
                socket.join(gameInfo.player2.room);
                io.to(gameInfo.player2.room).emit('secondPlayerInit',request.token);
            }
        })

        socket.on('playMulti', (playerReq) => {
            let request=JSON.parse(playerReq);
            console.log(playerReq);
            let gameInfo=mapGames.get(request.matchID);
            console.log(mapGames);
            let moveToCheck;
            if (request.token===gameInfo.player1.token && !checkIllegalMove(gameInfo.board,request.pos[0],1)){
                gameInfo.board[request.pos[0]][request.pos[1]]=1;
                io.to(gameInfo.player2.room).emit('doMoveMulti',JSON.stringify(request.pos));
                moveToCheck = {
                    board: gameInfo.board,
                    playerTurn: 1,
                    i: request.pos[1],
                    j: request.pos[0],
                }
            }
            else if(request.token===gameInfo.player2.token && !checkIllegalMove(gameInfo.board,request.pos[0],-1)){
                gameInfo.board[request.pos[0]][request.pos[1]]=-1;
                io.to(gameInfo.player1.room).emit('doMoveMulti',JSON.stringify(request.pos));
                moveToCheck = {
                    board: gameInfo.board,
                    playerTurn: -1,
                    i: request.pos[1],
                    j: request.pos[0],
                }
            }
            else{
                return;
            }
            let check=checkMove(moveToCheck);
            if (check.state === "over"){
                if (check.winner ===1){
                    io.to(gameInfo.player1.room).emit('win',null);
                    io.to(gameInfo.player2.room).emit('lose',null);
                }
                else if (check.winner ===0){
                    io.to(gameInfo.player1.room).emit('tie',null);
                    io.to(gameInfo.player2.room).emit('tie',null);
                }
                else{
                    io.to(gameInfo.player1.room).emit('lose',null);
                    io.to(gameInfo.player2.room).emit('win',null);
                }
            }

        })})
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
