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
    const start = performance.now();
    if (!playFirst)
        board[lastMove[0]][lastMove[1]] = -1;

    playFirst = false;
    let bestMoveFromMC = monteCarlo(board, 1)
    board[bestMoveFromMC[0]][bestMoveFromMC[1]] = 1;
    console.log("vrai temps"+(performance.now() - start));
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
        if (isWin(board, currPlayer, findRaw(board,move)-1, move)) {
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

function monteCarlo(board, player) {
    /**
     * Runs the Monte Carlo algorithm on the board for the given player.
     * Simulates as many games as possible in 100ms and returns the best move based on the simulation results.
     */
    const start = performance.now();
    const legalMoves = getLegalMoves(board);
    let moveWins = Array(7).fill(0);
    let simulations = 0;
    let numberOfIteration=0;
    while (performance.now() - start < 97) {
        numberOfIteration++;
        for (const move of legalMoves) {
            const newBoard = makeMove(board, player, move);
            let result;
            if (isWin(newBoard, 1, findRaw(newBoard, move) - 1, move)) {
                result = 1;
            } else {
                result = simulateGame(newBoard, -1);
            }
            moveWins[move] += result === player ? 1 : result === 0 ? 0.5 : 0;
            simulations++;
            if (performance.now() - start >= 97) break; // stop if time limit reached
        }
    }
    console.log("iteration:", numberOfIteration);
    console.log("Simulations:", simulations);
    console.log("board " + board);
    console.log("moveWins " + moveWins);
    let c = moveWins.indexOf(Math.max(...moveWins));
    let r = findRaw(board, c);
    console.log("r " + r);
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
    if (count >= 4) {
        return true;
    }

    return false;
}

exports.setUp = setUp;
exports.nextMove = nextMove;
