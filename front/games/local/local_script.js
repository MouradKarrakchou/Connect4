import {colorMessage,checkWin,printIllegalMove,startPlay} from "../gameManagement.js"

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
    gameOver=!startPlay(event,counter);
    counter++;
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
