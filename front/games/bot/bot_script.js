import {colorMessage,checkWin,printIllegalMove,checkDraw} from "../gameManagement.js"

var randNum =  Math.floor(Math.random() * 10) + 1;
let gameOver = false;
document.addEventListener('DOMContentLoaded', init);
var socket = io();
let counter = 0;

socket.on('connect',function(){
    socket.emit('joinRoom', randNum);
})
socket.on('updateRoom',function(id){
    console.log(id);
    console.log(randNum);
})
socket.on('doMove',function(pos){
    startplay(JSON.parse(pos),true);
})

function init() {
    window.addEventListener("load", function (){colorMessage(counter);})
    document.getElementById("grid").addEventListener("click", play);
    document.getElementById("grid").addEventListener("click", function (){colorMessage(counter);})
}



function startplay(tab,isBot){
    gameOver=checkDraw();
    if (gameOver) return;
    let color = 'red';
    if (counter % 2 === 0) color = 'yellow';

    let column = tab[0];
    let line = 5;

    let id = column + " " + line;

    if (document.getElementById(id).style.backgroundColor !== "")
        return printIllegalMove();

    while (line >=0 && document.getElementById(id).style.backgroundColor === "") {
        line--;
        id = column + " " + line;
    }

    line++;
    id = column + " " + line;
    document.getElementById(id).style.backgroundColor = color;
    counter++;
    if (checkWin() === true) {
        console.log(color + " player wins!");
        document.getElementById("message").innerText = color + " player wins!";
        document.getElementById("reset-button").style.display = "block";
        document.getElementById("reset-button").addEventListener("click", resetGame);
        gameOver = true;
    }
    else {
        if (!isBot) {
            socket.emit('play',JSON.stringify({
                id:randNum,
            board:toTab()}));
        }
    }

}
function play(event) {
    let id = event.target.id;
    let tab = id.split(" ");
    startplay(tab,false);
}

//red are 1 yellow are -1
function toTab(){
    let l = [];
    for (let j = 0; j < 7; j++) {
        l[j]=[];
        for (let i = 0; i < 6; i++) {
            let id = j + " " + i;
            switch (document.getElementById(id).style.backgroundColor){
                case(""):
                    l[j][i]=0;
                    break;
                case("red"):
                    l[j][i]=1;
                    break;
                case("yellow"):
                    l[j][i]=-1;
                    break;
            }
        }
    }
    return l;
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


