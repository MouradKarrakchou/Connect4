import {findToken, token, address} from "../games/dataManager.js";
import {toTab, findTokenReturned} from "../games/gameManagement.js";
//TODO bind the header in bot diffculty

var socket = io();
var popupWindow;
socket.on('matchFound', (matchID) => {
    window.location.href = '../games/multiplayer/multiplayer.html';
    document.cookie = "matchID="+matchID+";path=/";
    popupWindow.close();

});
socket.on('inQueue', (roomName) => {
    console.log("inQueue");
    document.getElementById("search").style.display = "block";
    document.getElementById("hidingEverything").style.display = "block";
});
socket.on('cancel', () => {
    document.getElementById("search").style.display = "none";
    document.getElementById("hidingEverything").style.display = "none";
});
let gameSaved=document.getElementById("gameSaved");


window.addEventListener('load', function () {
    getAllGames();
    document.getElementById("b").addEventListener('click', findGame);
    document.getElementById("cancel").addEventListener('click', cancelGame);
    }
)
function cancelGame() {
    socket.emit('cancelQueue',JSON.stringify({token:token}));
}

document.getElementById("logout").addEventListener('click', logout);

function getAllGames(){
    findToken()
    console.log(token)
    const values = {
        token: token,
    };

    fetch(address + `/api/game/retrieveGames`, {
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
    fetch(address + `/api/game/deleteGame`, {
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
    for (let i = 0; i <tabOfGames.length ; i++) {
        var dropdown = document.querySelector('.dropdown');
        var newItem = document.createElement('div');
        let typeOfGame='/games/local/local_game.html';
        if (tabOfGames[i].gameType==='easy') typeOfGame='/games/bot/easy/bot_game.html';
        let address = '..'+typeOfGame+'?id=' + tabOfGames[i]._id;
        newItem.innerHTML = `
                            <div class="item" onclick="window.location.href='${address}'">
                                <h4>${tabOfGames[i].gameType}</h4>
                            </div>`;
        dropdown.appendChild(newItem);
        document.getElementById("trash").addEventListener('click', function () {
            deleteSavedGame(tabOfGames[i]._id);
            window.location.reload();
        });

    }
}

function initialise(){
    token=findTokenReturned()
    const tab = {
        gameType: "local",
        tab: toTab()
    };
    console.log(tab)
    fetch(address + '/api/game', {
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

function findGame(){
    findToken();
    let roomName=  token+Math.floor(Math.random() * 100000000000000000);
    socket.emit('searchMultiGame',JSON.stringify({
        room:roomName,token:token}));
}

function retrieveGame(gameTypeAndTab) {
    let path = "";
    if(gameTypeAndTab.gameType === "local") path = "../games/local/local_game.html";
    else if(gameTypeAndTab.gameType === "easy") path = "../games/easy/bot_game.html";

    const values = {
        token: 12,
    };

    fetch(address + '/api/game', {
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
