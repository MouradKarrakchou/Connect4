import {toTab} from "../games/gameManagement.js";
var local = "http://localhost:8000";
var aws = "http://15.236.190.187:8000"
var socket = io();
socket.on('matchFound', (matchID) => {
    window.location.href = '../games/online/searching_game.html';
});
socket.on('inQueue', (roomName) => {
    console.log(roomName);
});
let gameSaved=document.getElementById("gameSaved");

let token;

window.addEventListener('load', function () {
    getAllGames();
    document.getElementById("b").addEventListener('click', findGame);
    }
)

document.getElementById("logout").addEventListener('click', logout);

function getAllGames(){
    findToken()
    console.log(token)
    const values = {
        token: token,
    };

    fetch(local+`/api/game/deleteGame`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            //document.cookie = "token="+data.token+";path=/";
            addGamesSavedHtml(data);
            //window.location.href = '/games/local/local_game.html';
        })
        .catch(error => {
            console.error(error);
        });
}
function deleteSavedGame(){
    findToken();
    fetch(local+`/api/game/deleteGame`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: token})
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

function addGamesSavedHtml(tabOfGames){
    console.log(tabOfGames);
    for (let i = 0; i <tabOfGames.length ; i++) {
        var dropdown = document.querySelector('.dropdown');
        var newItem = document.createElement('div');
        let typeOfGame='local/local_game.html';
        if (tabOfGames[i].gameType==='easy') typeOfGame='easy/bot_game.html';
        let adress = '../games/'+typeOfGame+'?id=' + tabOfGames[i]._id;
        newItem.classList.add('item');
        const trashIcon = document.createElement('i');
        newItem.innerHTML = `<div class="item">
            <h4>${tabOfGames[i].gameType}</h4>
            <button class="resumeButton" onclick="window.location.href = '${adress}'">Resume</button>
        </div>`;
        dropdown.appendChild(newItem);
        document.getElementById("trash").addEventListener('click', function () {
            deleteSavedGame(tabOfGames[i]._id);
            window.location.reload();
        });

    }
}


function initialise(){
    token=findToken()
    const tab = {
        gameType: "local",
        tab: toTab()
    };
    console.log(tab)
    fetch(local+'/api/game', {
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
}

function findToken(){
    let cookies = document.cookie.split(';');
    console.log(cookies);
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].trim().startsWith("token=")) {
            token=cookies[i].trim().substring("token=".length, cookies[i].trim().length);
            break;
        }
    }
}

function findGame(){
    findToken();
    let roomName=  token+Math.floor(Math.random() * 100000000000000000);
    socket.emit('searchMultiGame',JSON.stringify({
        room:roomName,token:token}));
    document.cookie = "room="+roomName+";path=/";
}

function retrieveGame(gameTypeAndTab) {
    let path = "";
    if(gameTypeAndTab.gameType === "local") path = "../games/local/local_game.html";
    else if(gameTypeAndTab.gameType === "easy") path = "../games/easy/bot_game.html";

    const values = {
        token: 12,
    };

    fetch(local+'/api/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            document.cookie = "token="+data.token+";path=/";
            console.log(document.cookie);
            window.location.href = '/games/local/local_game.html';
        })
        .catch(error => {
            console.error(error);
        });
}

function logout() {
    document.cookie = "token=" + undefined + ";path=/";
    document.cookie = "username=" + undefined + ";path=/";
    window.location.href = "../loginRegister/loginRegister.html";
}
