let playFirst = false;
let turn = 0;
let board = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
];
let start;
let legalMovesToFind;
let legalMovesToGet;
let currPlayerSim;
let moveSim;
let rowToFind;
let legalMovesInMC;
let moveWinsInMC;
let simulationsInMC;
let newBoardAfterMove;
let lastMoveValue;

function setUp(AIplays) {
    board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];
    turn = AIplays
    if (turn === 1)
        playFirst = true;
    return true;
}

function nextMove(lastMove) {
    console.log(board[0]);
    console.log(board[1]);
    console.log(board[2]);
    console.log(board[3]);
    console.log(board[4]);
    console.log(board[5]);
    console.log(board[6]);
    moveWinsInMC = Array(7).fill(0);
    start = performance.now();
    if (!playFirst)
        board[lastMove[0]][lastMove[1]] = -1;
    else
        playFirst = false;
    let firstValue=monteCarlo(board, 1, start,75);
    let promise1=new Promise((resolve, reject) => {
        setTimeout(resolve, 98-(performance.now()-start), firstValue);
    });
    return Promise.race([monteCarlo(board, 1, start,96),promise1]);
}

async function TestNextMove(lastMove) {
    const promise1 = new Promise((resolve, reject) => {
        setTimeout(resolve, 100, 'TOO SLOW');
    });
    let value = await Promise.race([promise1, nextMove(lastMove)]);
    console.log("Move Played "+value);
    return value;
}

function getLegalMoves(board) {
    /**
     * Returns an array of legal moves on the board.
     */
    legalMovesToFind = [];
    for (let col = 0; col < 7; col++) {
        if (board[col][5] === 0) {
            legalMovesToFind.push(col);
        }
    }
    return legalMovesToFind;
}

function getRandomMove(board) {
    /**
     * Returns a random legal move on the board.
     */
    legalMovesToGet = getLegalMoves(board);
    return legalMovesToGet[Math.floor(Math.random() * legalMovesToGet.length)];
}

function simulateGame(board, player) {
    /**
     * Simulates a game on the board starting with the given player.
     */
    currPlayerSim = player;
    while (true) {
        moveSim = getRandomMove(board);
        board = makeMove(board, currPlayerSim, moveSim);
        if (isWin(board, currPlayerSim, findRaw(board,moveSim)-1, moveSim)) {
            return currPlayerSim;
        }
        if (isTie(board)) {
            return 0;
        }
        currPlayerSim = currPlayerSim === 1 ? -1 : 1;
    }
}

function findRaw(board, column) {
    rowToFind = 5;
    while(board[column][rowToFind] === 0 && rowToFind > 0) {
        rowToFind--;
    }
    if(rowToFind === 0 && board[column][rowToFind] === 0){
        return rowToFind;
    }
    return rowToFind + 1;

}

function monteCarlo(board, player, start,time) {
    return new Promise(function(resolve, reject) {
        /**
         * Runs the Monte Carlo algorithm on the board for the given player.
         * Simulates as many games as possible in 100ms and returns the best move based on the simulation results.
         */
        legalMovesInMC = getLegalMoves(board);
        console.log(moveWinsInMC);
        console.log(legalMovesInMC);
        simulationsInMC = 0;
        let finalMove;
        let notFinished=true;
        let compt=0;
        let iteration=0;
        while (notFinished) {
            for (const move of legalMovesInMC) {
                iteration++;
                const newBoard = makeMove(board, player, move);
                let result;
                if (isWin(newBoard, 1, findRaw(newBoard, move) - 1, move)) {
                    result = 1;
                    compt++;
                }
                else if (isTie(newBoard)) {
                    result = 0.5;
                }
                else {
                    result = simulateGame(newBoard, -1);
                }
                moveWinsInMC[move] += result === player ? 1 : result === 0 ? 0.5 : 0;
                simulationsInMC++;
                if (performance.now() - start >= time) {
                    let c = moveWinsInMC.indexOf(Math.max(...moveWinsInMC));
                    if(Math.max(...moveWinsInMC) === 0){
                        c = legalMovesInMC[0];
                    }
                    let r = findRaw(board,c);
                    if (time===96)
                    {board[c][r] = 1;
                    console.log("Move After Time to think "+[c, r])}
                    finalMove=[c, r];
                    notFinished=false;
                    break;
                } // stop if time limit reached
            }
        }
        console.log("compt fond: "+compt);
        console.log("iteration: "+iteration);
        if (time===75) console.log("Move After 75ms "+finalMove);
        setTimeout(resolve,0,finalMove);
    });
}

function makeMove(board, player, column) {
    /**
     * Returns a new board with the player's move made in the specified column.
     */
    newBoardAfterMove = board.map(col => col.slice()); // Copy the board
    for (let row = 0; row < 6; row++) {
        if (newBoardAfterMove[column][row] === 0) {
            newBoardAfterMove[column][row] = player;
            return newBoardAfterMove;
        }
    }
    return null; // Column is full
}

function isTie(board) {
    /**
     * Returns true if the board is full and there is no winner, false otherwise.
     */
    for (let col = 0; col < 7; col++) {
        if (board[col][5] === 0) {
            return false;
        }
    }
    return true;
}

function isWin(board, a, line,column) {
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
    if (count >= 4) {
        return true;
    }

    // Check horizontal
    count = 1;
    let i = column;
    while (i > 0 && board[i - 1][line] === player) {
        i--;
        count++;
    }
    i = column;
    while (i < board.length - 1 && board[i + 1][line] === player) {
        i++;
        count++;
    }
    if (count >= 4) {
        return true;
    }

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
    if (count >= 4) {
        return true;
    }

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

    return count >= 4;
}

exports.setUp = setUp;
exports.nextMove = nextMove;
exports.TestNextMove = TestNextMove;
