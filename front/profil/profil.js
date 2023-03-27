import {findUsername} from "../games/gameManagement.js";
import {findToken, token, address} from "../games/dataManager.js";
document.addEventListener('DOMContentLoaded', init);
var wins = 0
var losses = 0;
var draws = 0;
async function init() {
    await findElo();
    await findWins();
    await findLosses();
    await findDraws();

}
async function findElo(){
    findToken();
    const values = {
        token: token,
    }
     await fetch(address + `/api/profile/retrieveElo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById("rank").innerHTML = data;        })
        .catch(error => {
            console.error(error);
        });
}
var username = findUsername();
async function findWins(){
    findToken();
    const values = {
        token: token,
    }
    await fetch(address + `/api/profile/retrieveWins`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            wins = data;
            document.getElementById("wins").innerHTML = data;        })
        .catch(error => {
            console.error(error);
        });
}

async function findLosses(){
    findToken();
    const values = {
        token: token,
    }
    await fetch(address + `/api/profile/retrieveLosses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            losses = data;
            document.getElementById("losses").innerHTML = data;
        })
        .catch(error => {
            console.error(error);
        });
}
async function findDraws(){
    findToken();
    const values = {
        token: token,
    }
    await fetch(address + `/api/profile/retrieveDraws`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            draws = data;
            document.getElementById("draws").innerHTML = data;        })
        .catch(error => {
            console.error(error);
        });
}




// Met à jour les éléments HTML avec les statistiques réelles de l'utilisateur
document.getElementById("username").innerHTML = username;
document.getElementById("games-played").innerHTML = wins + losses + draws;

