import {toTab} from "../games/gameManagement.js";

let gameSaved=document.getElementById("gameSaved");
let token


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
