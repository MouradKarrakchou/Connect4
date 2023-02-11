import {colorMessage,checkWin,printIllegalMove} from "../gameManagement.js"

let counter = 0;

let gameOver = false;
document.addEventListener('DOMContentLoaded', init);

function init() {
    window.addEventListener("load", function (){colorMessage(counter);})
    document.getElementById("grid").addEventListener("click", play);
    document.getElementById("grid").addEventListener("click", function (){colorMessage(counter);})
}

function play(event){
    if (gameOver) return
    gameOver=!startPlay(event);
    counter++;
}

/**
 * return false if the game is finished and true is the person still plays
 * @param event
 * @returns {boolean|void}
 */
function startPlay(event) {
    if (counter === 42) {
        console.log("Draw!");
        document.getElementById("message").innerText = "Draw!";
        document.getElementById("reset-button").style.display = "block";
        document.getElementById("reset-button").addEventListener("click", resetGame);
        return false;
    }
    let color = 'red';
    if (counter % 2 === 0) color = 'yellow';

    let id = event.target.id;
    let tab = id.split(" ");
    let column = tab[0];
    let line = 5;

    id = column + " " + line;
    if (document.getElementById(id).style.backgroundColor !== "")
        return printIllegalMove();

    while (line >=0 && document.getElementById(id).style.backgroundColor === "") {
        line--;
        id = column + " " + line;
    }

    line++;
    id = column + " " + line;
    document.getElementById(id).style.backgroundColor = color;
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
