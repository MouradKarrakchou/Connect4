import {checkWin, printIllegalMove, removeIllegalMove, toTab, loadGame,saveGame,findTokenReturned, colorMessage} from "../../gameManagement.js"

var roomName;
let gameOver = false;
document.addEventListener('DOMContentLoaded', init);
var socket = io();
let counter = 0;
export let itsMyTurn;

function init() {
    window.addEventListener("load", function (){colorMessage(counter);})
    document.getElementById("grid").addEventListener("click", function(event){play(event)});
    document.getElementById("saveButton").addEventListener("click",function(){saveGame("easy")});
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('id')!=null) {
        roomName=  findTokenReturned()+urlParams.get('id');
        loadGame();
    }
    else{
        roomName=  findTokenReturned()+Math.floor(Math.random() * 100000000000000000);
    }
    socket.on('connect',function(){
        socket.emit('joinRoom', roomName);
    });
    socket.on('updateRoom',function(id){
        console.log(id);
        console.log(roomName);
    });
    socket.on('doMove',function(pos){
            startplay(JSON.parse(pos));
            counter++;
            colorMessage(counter);
    })
    if (Math.round(Math.random())===0)
    {socket.emit('initAdv',JSON.stringify({
        id:roomName,
        player:1}));
    socket.emit('playAdv',JSON.stringify({
        id:roomName,
        pos:undefined}));
    itsMyTurn=false;
        colorMessage(counter);}
    else {
        socket.emit('initAdv',JSON.stringify({
            id:roomName,
            player:2
        }));
        itsMyTurn=true;
        colorMessage(counter);
    }

}

document.getElementById("logout").addEventListener('click', logout);
function logout() {
    document.cookie = "token=" + undefined + ";path=/";
    document.cookie = "username=" + undefined + ";path=/";
    window.location.href = "../../../loginRegister/loginRegister.html";
}

function play(event) {
    let id = event.target.id;
    let tab = id.split(" ");
    if(!isMoveIllegal(tab)) {
        let pos=startplay(tab,false);
        if (!gameOver) {
            if (pos!=null) socket.emit('playAdv', JSON.stringify({
                                id: roomName,
                                pos: pos
                            }));
            counter++;
            colorMessage(counter);
        }
    }
}

function startplay(tab){
    itsMyTurn=!itsMyTurn;
    removeIllegalMove();

    if (gameOver) return;
    let color = 'red';
    if (counter % 2 === 0) color = 'yellow';

    let column = tab[0];
    let line = 5;

    let id = column + " " + line;

    if (document.getElementById(id).style.backgroundColor !== "")
    {printIllegalMove();
        return}

    while (line >=0 && document.getElementById(id).style.backgroundColor === "") {
        line--;
        id = column + " " + line;
    }
    console.log(counter);

    line++;
    id = column + " " + line;
    document.getElementById(id).style.backgroundColor = color;
    if (counter === 41) {
        console.log("Draw!");
        document.getElementById("message").innerText = "Draw!";
        document.getElementById("reset-button").style.display = "block";
        document.getElementById("reset-button").addEventListener("click", resetGame);
        gameOver = true;
    }
    if (checkWin() === true) {
        console.log(color + " player wins!");
        if (!itsMyTurn) document.getElementById("message").innerText = "You won!";
        else document.getElementById("message").innerText = color + " player wins!";
        document.getElementById("reset-button").style.display = "block";
        document.getElementById("reset-button").addEventListener("click", resetGame);
        gameOver = true;
    }
    return ([column,line]);

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
    socket.emit('initAdv',JSON.stringify({
        id:roomName,
        player:2}));

}

function isMoveIllegal(tab){
    let column = tab[0];
    let line = 5;

    let id = column + " " + line;
    if (document.getElementById(id).style.backgroundColor !== ""|| !itsMyTurn) {
        printIllegalMove();
        return true;
    }
    return false;
}
