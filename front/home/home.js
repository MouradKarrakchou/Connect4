import {findToken, token, address} from "../games/dataManager.js";
import {toTab, findTokenReturned, findUsername} from "../games/gameManagement.js";

var socket = io();

socket.on('matchFound', (matchID) => {
    document.cookie = "matchID="+matchID+";path=/";
    window.location.href = '../games/multiplayer/multiplayer.html';
});
socket.on('inQueue', (roomName) => {
    console.log("inQueue");
    document.getElementById("search").style.display = "block";
    document.getElementById("hidingEverything").style.display = "block";
});
socket.on('cancel', () => {
    document.getElementById("search").style.display = "none";
    document.getElementById("hidingEverything").style.display = "none";
}) ;
let gameSaved=document.getElementById("gameSaved");


document.addEventListener('DOMContentLoaded', function () {
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


// ----------------------------- Challenge -----------------------------
// When you get challenged
function challenged(data) {
    console.log("challenged start");
    let dropdown = document.querySelector('.dropdownChallengeRequest');
    let newChallenge = document.createElement('div');
    let challengerName = data.name

    newChallenge.innerHTML = `
                            <div class="friendIsChallenging" >
                                <h4>${challengerName} is challenging you!</h4>
                                <button class="buttonAcceptChallenge" id="acceptTheChallenge">Accept</button>
                                <button class="buttonDeclineChallenge" id="declineTheChallenge">Decline</button>
                            </div>`;

    dropdown.appendChild(newChallenge);

    document.getElementById("acceptTheChallenge").addEventListener('click', function () {
        findToken();
        socket.emit('IAcceptTheChallenge', {
            challengerToken: data.challengerToken,
            challengedToken: token,
            username: findUsername(),
            friendWhoChallenged: challengerName,
        });

        dropdown.removeChild(newChallenge)
    });
    document.getElementById("declineTheChallenge").addEventListener('click', function () {
        socket.emit('IDeclineTheChallenge', {
            username: findUsername(),
            friendWhoChallenged: challengerName
        });

        dropdown.removeChild(newChallenge)
        window.location.reload();
    });
    console.log("challenged end");
}

// -------- Sockets for the challenges --------

// Used to save the username in the socket data to find the socket by the user in server side
socket.emit('socketByUsername', { username: findUsername()});

socket.on('friendIsChallenging', (request) => {
    let data = JSON.parse(request);
    challenged(data);
    console.log("YOU GOT CHALLENGED BRO");
});

socket.on('notConnectedMessage', (notConnectedFriend) => {
    let waitingMessage = document.getElementById("waitingForChallengeAnswer");
    waitingMessage.innerText = "Oh no! " + notConnectedFriend + " is not connected!"
})

socket.on('challengeAccepted', (matchID) => {
    document.cookie = "matchID=" + matchID + ";path=/";
    window.location.href = '../games/multiplayer/multiplayer.html';
});

socket.on('challengeDeclined', (friendWhoDeclined) => {
    let waitingMessage = document.getElementById("waitingForChallengeAnswer");
    waitingMessage.innerText = "Oh no! " + friendWhoDeclined + " has declined your challenge!"
})
