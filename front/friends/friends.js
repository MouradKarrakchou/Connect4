import {findToken, token, address} from "../games/dataManager.js";
import {findUsername} from "../games/gameManagement.js";
let socket = io();

let pendingChallenge = false;
let pendingChallenged;

let currentFriendDiscussion;
const chatMessages = document.querySelector('#chat-messages');
const chatContainer = document.getElementById("chat-container");
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

        let idChallenge = "challenge" + friendList[i];
        let idRemove = "remove" + friendList[i];
        let idMessage = "message" + friendList[i];

        newItem.innerHTML = `
                            <div class="friend" >
                                <h4 >${friendList[i]}</h4>
                                <button class="challenge" id=${idChallenge}>Challenge</button>
                                <button class="buttonFriends" id=${idRemove}>Remove</button>
                                <button class="buttonFriends" id=${idMessage}>Message</button>
                            </div>`;

        dropdown.appendChild(newItem);

        document.getElementById(idChallenge).addEventListener('click', function () {
            challenge(this);
        });
        document.getElementById(idRemove).addEventListener('click', function () {
            removeFriend(friendList[i]);
        });
        document.getElementById(idMessage).addEventListener('click', function () {
            setupChatContainer(friendList[i]);
        });
    }
}

function setupChatContainer(friend){
    currentFriendDiscussion = friend;
    chatContainer.style.display = "flex";
    chatMessages.innerHTML='';
    socket.emit('loadFriendChat', { friendUsername: currentFriendDiscussion,
        token: token});
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
    window.location.reload();
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

        let acceptId = "accept" + friendRequest[i];
        let declineId = "decline" + friendRequest[i];

        newItem.innerHTML = `
                            <div class="friendReq" >
                                <h4>${friendRequest[i]}</h4>
                                <button class="buttonFriends" id="${acceptId}">Accept</button>
                                <button class="buttonFriends" id="${declineId}">Decline</button>
                            </div>`;

        dropdown.appendChild(newItem);

        document.getElementById(acceptId).addEventListener('click', function () {
            acceptFriendRequest(friendRequest[i]);
        });
        document.getElementById(declineId).addEventListener('click', function () {
            declineFriendRequest(friendRequest[i]);
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
    window.location.reload();
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
    window.location.reload();
}

// Challenge a friend
function challenge(button) {
    let friendName = button.parentNode.querySelector("h4").textContent

    if (pendingChallenge) {
        let messageElement = document.getElementById("waitingForChallengeAnswer");
        messageElement.innerText = "Waiting for " + pendingChallenged +
            "! You cannot challenge two friends at the same time! Cancel your pending challenge first"
    } else {
        findToken();

        socket.emit('challengeFriend', {
            challengerToken: token,
            challengedName: friendName
        });

        console.log("Challenge sent!");

        let waitingMessage = document.getElementById("waitingForChallengeAnswer");
        waitingMessage.innerText = "Waiting for " + friendName + "!";
        waitingMessage.style.display = "block";
        pendingChallenge = true;
        pendingChallenged = friendName;
    }
}

function challenged(data) {
    let dropdown = document.querySelector('.dropdownChallengeRequest');
    let newChallenge = document.createElement('div');
    let challengerName = data.challengerName;

    let friendIsChallengingClassName = "friendIsChallenging" + challengerName;
    let acceptTheChallengeId = "acceptTheChallenge" + challengerName;
    let declineTheChallengeId = "declineTheChallenge" + challengerName;

    newChallenge.innerHTML = `
                            <div class="${friendIsChallengingClassName}" >
                                <h4>${challengerName} is challenging you!</h4>
                                <button class="accept" id="${acceptTheChallengeId}">Accept</button>
                                <button class="decline" id="${declineTheChallengeId}">Decline</button>
                            </div>`;

    dropdown.appendChild(newChallenge);

    document.getElementById(acceptTheChallengeId).addEventListener('click', function () {
        findToken();
        socket.emit('IAcceptTheChallenge', {
            challengerToken: data.challengerToken,
            challengedToken: token,
            username: findUsername(),
            friendWhoChallenged: challengerName,
        });

        dropdown.removeChild(newChallenge)
    });
    document.getElementById(declineTheChallengeId).addEventListener('click', function () {
        socket.emit('IDeclineTheChallenge', {
            challengerToken: data.challengerToken,
            challengedToken: token,
        });

        dropdown.removeChild(newChallenge)
        window.location.reload();
    })
}

function hideUserNotFoundMessage() {
    document.getElementById("userNotFoundMessage").style.display = "none";
}

const chatBar = document.getElementById('chatBar');

chatBar.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        socket.emit('friendChat', { friendUsername: currentFriendDiscussion,
            chat: chatBar.value,
            token: token});
        appendMessage("Me: "+chatBar.value);
        chatBar.value='';
    }
});

// Used to save the username in the socket data to find the socket by the user in server side
socket.emit('socketByUsername', { username: findUsername() });

socket.on('friendIsChallenging', (data) => {
    challenged(data);
});
function appendMessage(message) {
    let newItem = document.createElement('div');
    chatContainer.style.display = "flex";
    newItem.innerHTML = '<div className="user-message">'+message+'</div>';
    chatMessages.appendChild(newItem);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

socket.on('notConnectedMessage', (challengedName) => {
    pendingChallenge = false;
    let waitingMessage = document.getElementById("waitingForChallengeAnswer");
    waitingMessage.innerText = "Oh no! " + challengedName + " is not connected! Or he is already in game..."
})

socket.on('notFriendMessage', (challengedName) => {
    pendingChallenge = false;
    let waitingMessage = document.getElementById("waitingForChallengeAnswer");
    waitingMessage.innerText = "Oh no! " + challengedName + " is not your friend!"
})

socket.on('challengeAccepted', (matchID) => {
    pendingChallenge = false;
    document.cookie = "matchID=" + matchID + ";path=/";
    window.location.href = '../games/multiplayer/multiplayer.html';
});

socket.on('challengeDeclined', (challengedName) => {
    pendingChallenge = false;
    let waitingMessage = document.getElementById("waitingForChallengeAnswer");
    waitingMessage.innerText = "Oh no! " + challengedName + " has declined your challenge!"
})

socket.on('privateMessage', (request) => {
    if (currentFriendDiscussion!==request.username){
        currentFriendDiscussion=request.username;
        setupChatContainer();
    }
    appendMessage(currentFriendDiscussion+": "+request.message);
})
socket.on('allConversationPrivateMessages', (request) => {
    console.log(request);
    request.forEach(msg=>msg.from===currentFriendDiscussion?appendMessage(msg.from+": "+msg.message):appendMessage("me: "+msg.message))
})

//TODO add some security on challenge: cancel challenge, cannot challenge many friends at the same time
