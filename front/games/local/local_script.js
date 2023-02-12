import {colorMessage, checkWin, printIllegalMove, retrieveGameState, toTab} from "../gameManagement.js"

let counter = 0;
let token;
let gameOver = false;
document.addEventListener('DOMContentLoaded', init);

window.addEventListener('load', function () {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('id')!=null) loadGame();}
)

document.getElementById("logout").addEventListener('click', logout);
function logout() {
    document.cookie = "token=" + undefined + ";path=/";
    document.cookie = "username=" + undefined + ";path=/";
    window.location.href = "../../loginRegister/loginRegister.html";
}

function loadGame(){
    findToken()
    var urlParams = new URLSearchParams(window.location.search);

    const values = {
        token: token,
        id:urlParams.get('id'),
    };
    console.log(values);

    fetch('http://localhost:8000/api/game/retrieveGameWithId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            //document.cookie = "token="+data.token+";path=/";
            console.log(data);
            retrieveGameState(data.tab);
            //window.location.href = '/games/local/local_game.html';
        })
        .catch(error => {
            console.error(error);
        });

}

function init() {
    window.addEventListener("load", function (){colorMessage(counter);})
    document.getElementById("grid").addEventListener("click", play);
    document.getElementById("grid").addEventListener("click", function (){colorMessage(counter);});
    document.getElementById("saveButton").addEventListener("click",saveGame);
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
    console.log(document.cookie.toString())
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
function findToken(){
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].trim().startsWith("token=")) {
            token=cookies[i].trim().substring("token=".length, cookies[i].trim().length);
            break;
        }
    }
}
function saveGame() {
    console.log("in saveGame")
    findToken();
    console.log(token);
    const tab = {
        gameType: "local",
        tab: toTab(),
        userToken:token
    };
    console.log(tab)
    fetch('http://localhost:8000/api/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tab)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });

    document.getElementById("savedGameMessage").style.display = "block";
}

document.getElementById("keepPlaying").addEventListener('click', function () {document.getElementById("savedGameMessage").style.display = "none"});
document.getElementById("backToHome").addEventListener('click', function () {window.location.href = "../../home/home.html"});
