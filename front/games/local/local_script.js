import {
    colorMessage,
    checkWin,
    getCount,
    printIllegalMove,
    removeIllegalMove,
    loadGame,
    saveGame,
    isMoveIllegal,
    notLoggedRedirection
} from "../gameManagement.js"

let counter = 0;
let gameOver = false;
const mapColor = new Map();
mapColor.set('Yellow','#cee86bcc');
mapColor.set('Red','#c92c2c9c');
document.addEventListener('DOMContentLoaded', init);


window.addEventListener('load', async function () {
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('id') != null) await loadGame();
        counter = getCount();
        console.log(counter);
        colorMessage(counter);

    }
)

function init() {
    // If not logged in, redirected to the login page
    notLoggedRedirection();

    window.addEventListener("load", function (){colorMessage(counter);})
    document.getElementById("grid").addEventListener("click", play);
    document.getElementById("grid").addEventListener("click", function (){if (!gameOver) colorMessage(counter);});

}

function play(event){
    if (gameOver || isMoveIllegal(event)) return
    gameOver = !startPlay(event);
    counter++;
}

/**
 * return false if the game is finished and true is the person still plays
 * @param event
 * @returns {boolean|void}
 */
function startPlay(event) {
    removeIllegalMove();
    console.log(document.cookie.toString())
    let color = 'red';
    if (counter % 2 === 0) color = 'yellow';

    let id = event.target.id;
    let tab = id.split(" ");
    let column = tab[0];
    let line = 5;

    id = column + " " + line;



    while (line >=0 && document.getElementById(id).style.backgroundColor === "") {
        line--;
        id = column + " " + line;
    }

    line++;
    id = column + " " + line;
    console.log(id);
    document.getElementById(id).style.backgroundColor = color;
    if (counter === 41) {
        console.log("Draw!");
        document.getElementById("message").innerText = "Draw!";
        document.getElementById("reset-button").style.display = "block";
        document.getElementById("reset-button").addEventListener("click", resetGame);
        return false;
    }
    if (checkWin() === true) {
        console.log(color + " player wins!");
        document.getElementById("message").innerText = color + " player wins!";
        document.getElementById("reset-button").style.display = "block";
        document.getElementById("reset-button").addEventListener("click", resetGame);
        return false;
    }


    return true;
}

function resetGame() {
    gameOver = false;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            let id = j + " " + i;
            document.getElementById(id).style.backgroundColor = "";
        }
    }
    counter = 0;
    document.getElementById("message").innerText = "";
    document.getElementById("reset-button").style.display = "none";
}
