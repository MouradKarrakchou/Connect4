function getLegalMoves(board) {
    /**
     * Returns an array of legal moves on the board.
     */
    let legalMoves = [];
    for (let col = 0; col < 7; col++) {
        if (board[0][col] === 0) {
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
        if (isWin(board, currPlayer)) {
            return currPlayer;
        }
        if (isTie(board)) {
            return 0;
        }
        currPlayer = currPlayer === 1 ? 2 : 1;
    }
}

function monteCarlo(board, player, numSimulations) {
    /**
     * Runs the Monte Carlo algorithm on the board for the given player and number of simulations.
     * Returns the best move based on the simulation results.
     */
    const legalMoves = getLegalMoves(board);
    let moveWins = Array(7).fill(0);
    for (let i = 0; i < numSimulations; i++) {
        const moveScores = Array(7).fill(0);
        for (const move of legalMoves) {
            const newBoard = makeMove(board, player, move);
            const result = simulateGame(newBoard, player);
            moveScores[move] += result === player ? 1 : result === 0 ? 0.5 : 0;
        }
        moveWins[moveScores.indexOf(Math.max(...moveScores))] += 1;
    }
    return moveWins.indexOf(Math.max(...moveWins));
}

// Example usage
const board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];
const player = 1;
const numSimulations = 1000;
const bestMove = monteCarlo(board, player, numSimulations);
console.log(`Best move: ${bestMove}`);
