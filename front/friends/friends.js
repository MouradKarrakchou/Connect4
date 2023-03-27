import {findToken, token, address} from "../games/dataManager.js";
import {findUsername} from "../games/gameManagement.js";
let socket = io();

document.addEventListener('DOMContentLoaded', init);
async function init() {
    document.getElementById('addFriendButton').addEventListener('click', addFriend);
    document.getElementById("searchBar").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addFriend();
        }
    });

    await getFriendList();
    getFriendRequest();
}

function addFriend() {
    hideUserNotFoundMessage();

    const friendQuery = document.getElementById("searchBar").value;
    if(friendQuery === "") return;
    findToken();

    const values = {
        from: token,
        friend: friendQuery
    }
    console.log(values.friend);
    fetch(address + '/api/friends/friendRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status ==='User not found' ) {
                document.getElementById("userNotFoundMessage").style.display = "block";
            }
        })
        .catch(error => {
            console.error(error);
        });

    console.log("Friend request sent to " + friendQuery + "!");
    document.getElementById("searchBar").value = "";
}

async function getFriendList() {
    findToken()
    const values = {
        token: token,
    };

    await fetch(address + `/api/friends/retrieveFriendList`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            showFriendList(data);
        })
        .catch(error => {
            console.error(error);
        });
}

function showFriendList(friendList) {
    for (let i = 0; i < friendList.length; i++) {
        let dropdown = document.querySelector('.dropdown');
        let newItem = document.createElement('div');

        newItem.innerHTML = `
                            <div class="friend">
                                <h4>${friendList[i]}</h4>
                                <button class="challenge" id="challenge">Challenge</button>
                                <button class="remove" id="remove">Remove</button>
                            </div>`;

        dropdown.appendChild(newItem);
        document.getElementById("challenge").addEventListener('click', challenge)
        document.getElementById("remove").addEventListener('click', function () {
            removeFriend(friendList[i]);
            window.location.reload();
        });
    }
}

function removeFriend(friendToRemove) {
    findToken();
    fetch(address + `/api/friends/removeFriend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            friendToRemove: friendToRemove
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

function getFriendRequest(){
    findToken()
    const values = {
        token: token,
    };

    fetch(address + `/api/friends/retrieveFriendRequest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            showFriendRequest(data);
        })
        .catch(error => {
            console.error(error);
        });
}

function showFriendRequest(friendRequest) {
    for (let i = 0; i < friendRequest.length; i++) {
        let dropdown = document.querySelector('.dropdownFriendRequest');
        let newItem = document.createElement('div');

        newItem.innerHTML = `
                            <div class="friendRequest" >
                                <h4>${friendRequest[i]}</h4>
                                <button class="accept" id="accept">Accept</button>
                                <button class="decline" id="decline">Decline</button>
                            </div>`;

        dropdown.appendChild(newItem);

        document.getElementById("accept").addEventListener('click', function () {
            acceptFriendRequest(friendRequest[i]);
            window.location.reload();
        });
        document.getElementById("decline").addEventListener('click', function () {
            declineFriendRequest(friendRequest[i]);
            window.location.reload();
        });
    }
}

function acceptFriendRequest(friendToAccept) {
    findToken();
    fetch(address + `/api/friends/acceptFriendRequest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            friendToAccept: friendToAccept
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

function declineFriendRequest(friendToDecline) {
    findToken();
    fetch(address + `/api/friends/declineFriendRequest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            friendToDecline: friendToDecline
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

function challenge(button) {
    let friendName = button.parentNode.querySelector("h4").textContent

    console.log("NOM DE L AMI A CHALLENGE : " + friendName);

    findToken();
    let roomName = token + Math.floor(Math.random() * 100000000000000000);
    socket.emit('challengeFriend', JSON.stringify({
        room: roomName,
        name: findUsername(),
        friendToChallenge: friendName
    }));
}

function hideUserNotFoundMessage() {
    document.getElementById("userNotFoundMessage").style.display = "none";
}


socket.on('friendIsChallenging', (response) => {
    let challengeMessage = document.querySelector('.challengeMessage');
    let newChallenge = document.createElement('div');

    newChallenge.innerHTML = `
                            <div class="friendRequest" >
                                <h4>${friendRequest[i]}</h4>
                                <button class="accept" id="accept">Accept</button>
                                <button class="decline" id="decline">Decline</button>
                            </div>`;

    dropdown.appendChild(newItem);

    document.getElementById("accept").addEventListener('click', function () {
        acceptFriendRequest(friendRequest[i]);
        window.location.reload();
    });
    document.getElementById("decline").addEventListener('click', function () {
        declineFriendRequest(friendRequest[i]);
        window.location.reload();
    });
});

socket.on('challengeAccepted', (matchID) => {
    window.location.href = '../games/multiplayer/multiplayer.html';
    document.cookie = "matchID=" + matchID + ";path=/";
});
