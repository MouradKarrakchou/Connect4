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
    if (!playFirst)
        board[lastMove[0]][lastMove[1]] = -1;

    playFirst = false;
    let bestMoveFromMC = monteCarlo(board, 1, 1000)
    board[bestMoveFromMC[0]][bestMoveFromMC[1]] = 1;

    return bestMoveFromMC;
}

function getLegalMoves(board) {
    /**
     * Returns an array of legal moves on the board.
     */
    let legalMoves = [];
    for (let col = 0; col < 7; col++) {
        if (board[col][5] === 0) {
            legalMoves.push(col);
        }
    }
    return legalMoves;
}

function getRandomMove(board) {
    /**
     * Returns a random legal move on the board.
     */

    const legalMoves = getLegalMoves(board);
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
}

function simulateGame(board, player) {
    /**
     * Simulates a game on the board starting with the given player.
     */
    let currPlayer = player;
    while (true) {
        const move = getRandomMove(board);
        board = makeMove(board, currPlayer, move);
        if (isWin(board, currPlayer, findRaw(board,move), move)) {
            return currPlayer;
        }
        if (isTie(board)) {
            return 0;
        }
        currPlayer = currPlayer === 1 ? -1 : 1;
    }
}

function findRaw(board, column) {
    let raw = 5;
    while(board[column][raw] === 0 && raw > 0) {
        raw--;
    }
    if(raw === 0 && board[column][raw] === 0){
        return raw;
    }
    return raw + 1;

}

function monteCarlo(board, player, numSimulations) {
    /**
     * Runs the Monte Carlo algorithm on the board for the given player and number of simulations.
     * Returns the best move based on the simulation results.
     */
    const legalMoves = getLegalMoves(board);
    console.log("legalMoves " + legalMoves)
    let moveWins = Array(7).fill(0);
    for (let i = 0; i < numSimulations; i++) {
        const moveScores = Array(7).fill(0);
        for (const move of legalMoves) {
            const newBoard = makeMove(board, player, move);
            const result = simulateGame(newBoard, player);
            moveWins[move] += result === player ? 1 : result === 0 ? 0.5 : 0;
        }
    }
    console.log("board " + board)
    console.log("moveWins " + moveWins);
    let c = moveWins.indexOf(Math.max(...moveWins));
    let r = findRaw(board,c);
console.log("r " + r)
    return [c, r];
}

function makeMove(board, player, column) {
    /**
     * Returns a new board with the player's move made in the specified column.
     */
    const newBoard = board.map(col => col.slice()); // Copy the board
    for (let row = 0; row < 6; row++) {
        if (newBoard[column][row] === 0) {
            newBoard[column][row] = player;
            return newBoard;
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

function isWin(board, player, lastRow, lastCol) {
    /**
     * Returns true if the player has won on the board, false otherwise.
     */
        // Check row
    let count = 0;
    for (let col = Math.max(lastCol - 3, 0); col <= Math.min(lastCol + 3, 6); col++) {
        if (board[col][lastRow] === player) {
            count++;
            if (count === 4) return true;
        } else {
            count = 0;
        }
    }

    // Check column
    count = 0;
    for (let row = Math.max(lastRow - 3, 0); row <= Math.min(lastRow + 3, 5); row++) {
        if (board[lastCol][row] === player) {
            count++;
            if (count === 4) return true;
        } else {
            count = 0;
        }
    }

    // Check diagonal (top-left to bottom-right)
    count = 0;
    let row = Math.max(lastRow - 3, 0);
    let col = Math.max(lastCol - 3, 0);
    while (row <= Math.min(lastRow + 3, 5) && col <= Math.min(lastCol + 3, 6)) {
        if (board[col][row] === player) {
            count++;
            if (count === 4) return true;
        } else {
            count = 0;
        }
        row++;
        col++;
    }

    // Check diagonal (top-right to bottom-left)
    count = 0;
    row = Math.max(lastRow - 3, 0);
    col = Math.min(lastCol + 3, 6);
    while (row <= Math.min(lastRow + 3, 5) && col >= Math.max(lastCol - 3, 0)) {
        if (board[col][row] === player) {
            count++;
            if (count === 4) return true;
        } else {
            count = 0;
        }
        row++;
        col--;
    }

    return false;
}

exports.setUp = setUp;
exports.nextMove = nextMove;
