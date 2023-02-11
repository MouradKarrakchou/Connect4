import {toTab} from "../games/gameManagement";

let gameSaved=document.getElementById("gameSaved");
let token=findToken()


function initialise(){
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
