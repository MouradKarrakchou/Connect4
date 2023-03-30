import {findUsername} from "../games/gameManagement.js";
import {findToken, token, address} from "../games/dataManager.js";
document.addEventListener('DOMContentLoaded', init);
let wins = 0
let losses = 0;
let draws = 0;
let elo = 1000;
async function init() {
    await findElo();
    await findLosses();
    await findWins();
    await findDraws();
    document.getElementById("username").innerHTML = username;
    document.getElementById("games-played").innerHTML = wins + losses + draws;
    if(wins + losses + draws === 0){
        document.getElementById("winrate").innerHTML = "0%";
    } else {
        document.getElementById("winrate").innerHTML = Math.round((wins / (wins + losses + draws)) * 100) + "%";    }
    const rankImage = document.querySelector('#rankImage');
    if (elo < 1100 ) {
        rankImage.src = '../img/Bronze1.png';
        document.getElementById("rank").innerHTML = "Bronze 1 (" + elo + " elo)";

    } else if (elo < 1200 && elo > 1100) {
        rankImage.src = '../img/Bronze2.png';
        document.getElementById("rank").innerHTML = "Bronze 2 (" + elo + " elo)" ;
    } else if (elo < 1300 && elo > 1200) {
rankImage.src = '../img/Bronze3.png';
        document.getElementById("rank").innerHTML = "Bronze 3 (" + elo + " elo)";
    } else if (elo < 1400 && elo > 1300) {
        rankImage.src = '../img/Bronze4.png';
        document.getElementById("rank").innerHTML = "Bronze 4 (" + elo + " elo)";
    } else if (elo < 1500 && elo > 1400) {
        rankImage.src = '../img/Silver1.png';
        document.getElementById("rank").innerHTML = "Silver 1 (" + elo + " elo)";
    } else if (elo < 1600 && elo > 1500) {
        rankImage.src = '../img/Silver2.png';
        document.getElementById("rank").innerHTML = "Silver 2 (" + elo + " elo)";
    } else if (elo < 1700 && elo > 1600) {
        rankImage.src = '../img/Silver3.png';
        document.getElementById("rank").innerHTML = "Silver 3 (" + elo + " elo)";
    } else if (elo < 1800 && elo > 1700) {
        rankImage.src = '../img/Silver4.png';
        document.getElementById("rank").innerHTML = "Silver 4 (" + elo + " elo)";
    } else if (elo < 1900 && elo > 1800) {
        rankImage.src = '../img/Gold1.png';
        document.getElementById("rank").innerHTML = "Gold 1 (" + elo + " elo)";
    } else if (elo < 2000 && elo > 1900) {
        rankImage.src = '../img/Gold2.png';
        document.getElementById("rank").innerHTML = "Gold 2 (" + elo + " elo)";
    } else if (elo < 2100 && elo > 2000) {
        rankImage.src = '../img/Gold3.png';
        document.getElementById("rank").innerHTML = "Gold 3 (" + elo + " elo)";
    } else if (elo < 2200 && elo > 2100) {
        rankImage.src = '../img/Gold4.png';
        document.getElementById("rank").innerHTML = "Gold 4 (" + elo + " elo)";
    } else if (elo>2200){
        rankImage.src = '../img/Goat.png';
        document.getElementById("rank").innerHTML = "Goat (" + elo + " elo)";

    }

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
            elo = data;})
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


