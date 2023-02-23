const ROWS = 6;
const COLS = 7;
const EMPTY = null;
const PLAYER1 = "X";
const PLAYER2 = "O";

function dropToken(column, board, player) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[column][row] == EMPTY) {
            board[column][row] = player;
            return row;
        }
    }
    // If the column is full, return -1 to indicate an invalid move
    return -1;
}

function getLegalMoves(board) {
    let moves = [];
    for (let c = 0; c < COLS; c++) {
        if (board[0][c] === EMPTY) {
            moves.push(c);
        }
    }
    return moves;
}
function checkScoreWithBoard(board) {
    return undefined;
}

function minimax(board, depth, alpha, beta, isMaximizingPlayer) {
    // Check if the game is over
    let legalMoves = getLegalMoves(board);
    let gameIsOver = legalMoves.length === 0;
    let player1Wins = false;
    let player2Wins = false;
    //check if we can win in one move
    if (!gameIsOver) {
        for (let c = 0; c < COLS; c++) {
            let lastRow = dropToken(c, board, isMaximizingPlayer ? PLAYER1 : PLAYER2);
            if (lastRow !== -1) {
                if (isMaximizingPlayer) {
                    //player1Wins = checkWin(lastRow, c, PLAYER1, board);
                } else {
                    //player2Wins = checkWin(lastRow, c, PLAYER2, board);
                }
                board[lastRow][c] = EMPTY;
                if (player1Wins || player2Wins) break;
            }
        }
    }

    if (gameIsOver || depth === 0 || player1Wins || player2Wins) {
        if (player1Wins) return Infinity;
        if (player2Wins) return -Infinity;
        return 0;
    }
    let leg = getLegalMoves()
    leg.filter(x-->checkScoreWithBoard(board)>alpha);

    if (depth==5) return leg.max();

    leg.map(x-->minimax(x));
    return(1-leg.max());

}


function getBestMove(board, depth, isMaximizingPlayer) {
    let legalMoves = getLegalMoves(board);
    let bestMove = legalMoves[0];
    let bestScore = -Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    for (let c of legalMoves) {
        let lastRow = dropToken(c, board, isMaximizingPlayer ? PLAYER1 : PLAYER2);
        let score = minimax(board, depth - 1, alpha, beta, !isMaximizingPlayer);
        board[c][lastRow] = EMPTY; // Update the cell at (c, lastRow)
        if (score > bestScore) {
            bestScore = score;
            bestMove = c;
        }
        alpha = Math.max(alpha, bestScore);
    }

    return bestMove;
}

