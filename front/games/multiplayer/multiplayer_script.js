import {
    checkWin,
    removeIllegalMove,
    loadGame,
    surrender, printIllegalMove
} from "../gameManagement.js"
import {address, findToken, token} from "../dataManager.js";

let counter = 0;
let gameOver = false;
let itsMyTurn;
var socket = io();
let playfirst;

const mapColor = new Map();
mapColor.set('Yellow','#cee86bcc');
mapColor.set('Red','#c92c2c9c');

socket.on('firstPlayerInit', (matchID) => {
    playfirst=true;
    colorMessage(counter);
});
socket.on('secondPlayerInit', (matchID) => {
    playfirst=false;
    colorMessage(counter);
});
socket.on('win', () => {
    console.log("C EST LA GAME");
    document.getElementById("message").innerText =" You won! :)";
    document.getElementById("reset-button").style.display = "block";
    document.getElementById("reset-button").addEventListener("click", resetGame);
    addWins();
    gameOver = true;
});
socket.on('lose', () => {
    console.log("FF");
    document.getElementById("message").innerText = " You lost... :( ";
    document.getElementById("reset-button").style.display = "block";
    document.getElementById("reset-button").addEventListener("click", resetGame);
    gameOver = true;
});
socket.on('tie', () => {
    console.log("Draw!");
    document.getElementById("message").innerText = "Draw!";
    document.getElementById("reset-button").style.display = "block";
    document.getElementById("reset-button").addEventListener("click", resetGame);
    gameOver = true;
});
socket.on('message', (message) => {
    if (!isMuted) {
        writeInChat("Opponent: " + message);
    }
})
document.addEventListener('DOMContentLoaded', init);

window.addEventListener('load', function () {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('id')!=null) loadGame();
    console.log({room:findInCookie("matchID="),token:findInCookie("token=")});
}
)

//document.getElementById("logout").addEventListener('click', logout);
function logout() {
    document.cookie = "token=" + undefined + ";path=/";
    document.cookie = "username=" + undefined + ";path=/";
    window.location.href = "../../loginRegister/loginRegister.html";
}


function init() {
    window.addEventListener("load", function (){colorMessage(counter);})
    socket.emit('initMulti',JSON.stringify({matchID:findInCookie("matchID="),token:findInCookie("token=")}));
    document.getElementById("grid").addEventListener("click", play);
    document.getElementById("grid").addEventListener("click", function (){colorMessage(counter);});
    document.getElementById("surrenderButton").addEventListener("click",function(){surrender()});
    socket.on('doMoveMulti',function(pos){
            startplay(JSON.parse(pos));
            counter++;
            colorMessage(counter);
    })
}
const muteButton = document.getElementById("mute-button");
let isMuted = false;

muteButton.addEventListener("click", () => {
    isMuted = !isMuted;
    if (isMuted) {
        // Mettre la logique pour couper le son de votre chat ici.
        muteButton.innerText = "Unmute";
    } else {
        // Mettre la logique pour réactiver le son de votre chat ici.
        muteButton.innerText = "Mute";
    }
});

function play(event) {
    let id = event.target.id;
    let tab = id.split(" ");
    if(!isMoveIllegal(tab)) {
        let pos=startplay(tab,false);
        colorMessage(counter);
        if (pos!=null)
            socket.emit('playMulti',JSON.stringify(
                {matchID:findInCookie("matchID="),token:findInCookie("token="),pos:pos}
            ));
        counter++;
    }
}

function startplay(tab){
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

    const chatForm = document.querySelector('#chat-form');
    const chatInput = document.querySelector('#chat-input');
    const chatMessages = document.querySelector('#chat-messages');

// Ajouter un événement pour envoyer un message
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message !== '') {
            appendMessage(message, 'me');
            // Envoyer le message au serveur (si nécessaire)
            chatInput.value = '';
        }
    });

// Fonction pour ajouter un message à la bulle de discussion
    function appendMessage(message, className) {
        const newMessage = document.createElement('div');
        newMessage.innerText = message;
        newMessage.classList.add('message', className);
        chatMessages.appendChild(newMessage);
    }



}
//in format : "token="
function findInCookie(str){
    let cookies = document.cookie.split(';');
    console.log(cookies);
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].trim().startsWith(str)) {
            return(cookies[i].trim().substring(str.length, cookies[i].trim().length));
        }
    }
}
function colorMessage(counter) {
    let color = 'Red';
    if (counter % 2 === 0) color = 'Yellow';
    document.getElementById("body").style.backgroundColor = mapColor.get(color);
    if (playfirst === (counter%2===0)) {
        document.getElementById("player").innerText = "Your turn to play";
        itsMyTurn=true;
    }
    else {
        document.getElementById("player").innerText = "Opponent turn to play";
        itsMyTurn=false;
    }
}
// récupère le bouton "salut !" et ajoute un événement "click"
document.getElementById("btn-salut").addEventListener("click", function() {
    writeInChat("Me: Hello !");
    socket.emit('chat',JSON.stringify({matchID:findInCookie("matchID="),token:findInCookie("token="),chat:"Hello !"}));
});
document.getElementById("btn-pret").addEventListener("click", function() {
    writeInChat("Me: I'm ready !");
    socket.emit('chat',JSON.stringify({matchID:findInCookie("matchID="),token:findInCookie("token="),chat:"I'm ready !"}));
});
document.getElementById("btn-wp").addEventListener("click", function() {
    writeInChat("Me: Well Played !");

    socket.emit('chat',JSON.stringify({matchID:findInCookie("matchID="),token:findInCookie("token="),chat:"Well Played !"}));
});
document.getElementById("btn-merci").addEventListener("click", function() {
    writeInChat("Me: Thank You !");
    socket.emit('chat',JSON.stringify({matchID:findInCookie("matchID="),token:findInCookie("token="),chat:"Thank You!"}));
});
function writeInChat(str){
        var chatbox = document.getElementById("chat-messages");
        // crée un nouvel élément div
        var message = document.createElement("div");
        // ajoute la classe "user-message" à l'élément pour le style
        message.classList.add("user-message");
        // ajoute le message "salut !" dans le texte de l'élément
        message.innerText = str;
        // ajoute l'élément à la zone de chat
        chatbox.appendChild(message);
        // scroll vers le bas de la zone de chat
        chatbox.scrollTop = chatbox.scrollHeight;

}

function isMoveIllegal(tab){
    let column = tab[0];
    let line = 5;

    let id = column + " " + line;
    if (document.getElementById(id).style.backgroundColor !== "" || !itsMyTurn) {
        printIllegalMove();
        return true;
    }
    return false;
}
async function addWins(){
    findToken();
    const values = {
        token: token,
    }
    await fetch(address + `/api/profile/addWins`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            wins = data;})
        .catch(error => {
            console.error(error);
        });
}
