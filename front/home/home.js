import {toTab} from "../games/gameManagement.js";

let gameSaved=document.getElementById("gameSaved");
let token

window.addEventListener('load', function () {
    getAllGames();
    }
)

function getAllGames(){
    findToken()
    console.log(token)
    const values = {
        token: token,
    };

    fetch('http://localhost:8000/api/game/retrieveGames', {
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
function deleteSavedGame(gameId){
    fetch(`http://localhost:8000/api/game/deleteGame`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({gameId: gameId})
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
        let adress = '../games/local/local_game.html?id=' + tabOfGames[i]._id;
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


function retrieveGame(gameTypeAndTab) {
    let path = "";
    if(gameTypeAndTab.gameType === "local") path = "../games/local/local_game.html";
    else if(gameTypeAndTab.gameType === "bot") path = "../games/bot/bot_game.html";

    const values = {
        token: 12,
    };

    fetch('http://localhost:8000/api/game', {
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
