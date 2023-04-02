import {findToken, token, address} from "../games/dataManager.js";
import {findUsername, notLoggedRedirection} from "../games/gameManagement.js";
let socket = io();
// If not logged in, redirected to the login page
notLoggedRedirection();

let pendingChallenge = false;
let pendingChallengedName = null;

let currentFriendDiscussion;
let chatMessages;
let chatContainer;
let friendList;

document.addEventListener('DOMContentLoaded', init);

async function init() {

    await getFriendList();
    getFriendRequest();
    chatMessages = document.getElementById("chat-messages");
    chatContainer = document.getElementById("chat-container");

    document.getElementById("searchBar").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addFriend();
        }
    });
    document.getElementById("cancelChallengeMini").addEventListener('click', cancelChallengeMini);
    findToken();
    socket.emit('findAllMessagePending', {token: token});

    let theChallengerList = JSON.parse(localStorage.getItem("theChallengerList"));
    setTimeout(() => {
        theChallengerList.forEach(function(challengerName) {
            challengedMini(challengerName);
        })
    }, 200);
}

function addFriend() {

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
                notification.style.display="flex";
                notifText.innerText="User not found! Check spelling, otherwise it does not exist";
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
            friendList=data;
            showMiniFriendList(data);
        })
        .catch(error => {
            console.error(error);
        });
}

function setupChatContainer(friend){
    let newItem = document.createElement('div');
    newItem.innerHTML = `<i class="fa-solid fa-chevron-left" style="margin-left: 0px;"></i>
                     <div style="margin: auto;">${friend}</div>`;
    document.getElementById("chat-header").innerHTML = '';
    newItem.style.display = 'flex';
    newItem.style.alignItems = 'center';
    newItem.style.justifyContent = 'center';
    newItem.style.width = '95%';
    document.getElementById("chat-header").appendChild(newItem);
    miniFriendContainer.style.display="none";
    chatContainer.style.display = "flex";
    chatMessages.innerHTML='';
    socket.emit('loadFriendChat', { friendUsername: friend,
        token: token});
}


async function removeFriend(friendToRemove) {
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
        .then(data => {
        })
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
            document.getElementById("iconNotifFriendRequest1").style.display='none';
            document.getElementById("iconNotifFriendRequest2").style.display='none';
            if (data.length>0) {
                document.getElementById("iconNotifFriendRequest1").style.display='block';
                document.getElementById("iconNotifFriendRequest2").style.display='block';
            }
            showFriendRequestMini(data);
        })
        .catch(error => {
            console.error(error);
        });
}

async function acceptFriendRequest(friendToAccept) {
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
        .then(async data => {
            await getFriendList();
            getFriendRequest();
        })
        .catch(error => console.error(error));
}

async function declineFriendRequest(friendToDecline) {
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
        .then(data => {
        })
        .catch(error => console.error(error));
}

// Challenge a friend
function challengeMini(friendName) {

    if (pendingChallenge) {
        notification.style.display="flex";
        notifText.innerText="Waiting for " + pendingChallengedName +
            "! You cannot challenge two friends at the same time! Cancel your pending challenge first";
    } else {
        document.getElementById("cancelChallengeMini").style.display = "block";
        document.getElementById("ok-btn").style.display = "none";

        findToken();
        socket.emit('challengeFriend', {
            challengerToken: token,
            challengedName: friendName
        });

        console.log("Challenge sent!");
        notification.style.display="flex";
        notifText.innerText="Waiting for " + friendName + "!";
        pendingChallenge = true;
        pendingChallengedName = friendName;
    }
}


function cancelChallengeMini() {
    findToken()
    socket.emit('theChallengeIsCanceled', {
        challengerToken: token,
        challengedName: pendingChallengedName
    })
    document.getElementById("cancelChallengeMini").style.display = "block";
    document.getElementById("ok-btn").style.display = "none";
    notification.style.display = 'none';
    pendingChallenge = false;

}

const chatBar = document.getElementById('chatBar');

chatBar.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        socket.emit('friendChat', { friendUsername: currentFriendDiscussion,
            chat: chatBar.value,
            token: token});
        console.log("ITS ME WHO IS WRITING");
        appendMessage("Me: "+chatBar.value);
        chatBar.value='';
    }
});

// Used to save the username in the socket data to find the socket by the user in server side
socket.emit('socketByUsername', { username: findUsername() });

socket.on('friendIsChallenging', (challengerName) => {
    addChallengerNameToLocalStorage(challengerName);
    challengedMini(challengerName);
});
socket.on('loadAllMessagePending', (data) => {
    friendList.forEach(friend=>document.getElementById("notificationMini"+friend).style.display='none')
    console.log(data);
    document.getElementById("iconNotif").style.display='none';
    data=data.filter(message=>document.getElementById("notificationMini"+message.from)!==null);
    if(data.length>0)
        document.getElementById("iconNotif").style.display='block';
    data.forEach(message=>document.getElementById("notificationMini"+message.from).style.display='block');
});
function appendMessage(message) {
    let newItem = document.createElement('div');
    chatContainer.style.display = "flex";
    newItem.innerHTML = '<div className="user-message">'+message+'</div>';
    chatMessages.appendChild(newItem);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

socket.on('notConnectedMessage', (challengedName) => {
    document.getElementById("cancelChallengeMini").style.display = "none";
    document.getElementById("ok-btn").style.display = "block";
    pendingChallenge = false;
    notification.style.display="flex";
    notifText.innerText= "Oh no! " + challengedName + " is not connected! Or he is already in game...";

})

socket.on('notFriendMessage', (challengedName) => {
    document.getElementById("cancelChallengeMini").style.display = "none";
    document.getElementById("ok-btn").style.display = "block";
    pendingChallenge = false;
    notification.style.display="flex";
    notifText.innerText= "Oh no! " + challengedName + " is not your friend!";
})

socket.on('challengeAccepted', (matchID) => {
    pendingChallenge = false;
    document.cookie = "matchID=" + matchID + ";path=/";
    window.location.href = '/games/multiplayer/multiplayer.html';
});

socket.on('challengeDeclined', (challengedName) => {
    pendingChallenge = false;
    notification.style.display="flex";
    document.getElementById("cancelChallengeMini").style.display = "none";
    document.getElementById("ok-btn").style.display = "block";
    notifText.innerText= "Oh no! " + challengedName + " has declined your challenge!";
})

socket.on('challengeHasBeenCanceled', (challengerName) => {
    removeChallengerNameFromLocalStorage(challengerName);
    let id= "mini_Challenge"+ challengerName;
    let dropdown = document.querySelector('.miniDropdownNotification');
    let challengeDiv= document.getElementById(id);
    dropdown.removeChild(challengeDiv);
})

socket.on('privateMessage', (request) => {
    console.log(request);
    console.log(currentFriendDiscussion);
    if (currentFriendDiscussion!==request.username){
        socket.emit('findAllMessagePending', {token: token});
        //currentFriendDiscussion=request.username;
        //setupChatContainer(request.username);
    }
    else
    {
        socket.emit('setToRead', {token: token,item:request.item});
        appendMessage(currentFriendDiscussion+": "+request.message);
    }
})

socket.on('allConversationPrivateMessages', (request) => {
    console.log(request);
    console.log(currentFriendDiscussion);
    request.forEach(msg=>msg.from===currentFriendDiscussion?appendMessage(msg.from+": "+msg.message):appendMessage("Me: "+msg.message))
})


///////////////////////////////////////////////////////////////////////////////

let miniFriendContainer=document.getElementById("miniFriendContainer");
document.getElementById("chat-header").addEventListener('click',displayMiniFriends)
document.getElementById("mini-chat-header").addEventListener('click',displayMiniMenu)
let miniContainerContent=document.getElementById("mini-container-content");

function displayMiniMenu(){
    if (miniContainerContent.style.display==="block")
    {
        miniContainerContent.style.display="none";
        document.getElementById("chevron-down").style.display="none";
        document.getElementById("chevron-up").style.display="block";
        miniFriendContainer.style.height="";
    }
    else
    {
        miniContainerContent.style.display="block"
        document.getElementById("chevron-down").style.display="block";
        document.getElementById("chevron-up").style.display="none";
        miniFriendContainer.style.height="50%";
    }
}
function displayMiniFriends(){
    console.log("click");
    currentFriendDiscussion=null;
    miniFriendContainer.style.display = "block";
    document.getElementById("chat-container").style.display = "none";
}


function showMiniFriendList(friendList) {
    let dropdown = document.querySelector('.miniDropdown');
    dropdown.innerHTML='';
    console.log(friendList);
    for (let i = 0; i < friendList.length; i++) {
        let dropdown = document.querySelector('.miniDropdown');
        let newItem = document.createElement('div');

        let idIconMessage="notificationMini" + friendList[i];
        let idDivFriend = "friendMini" + friendList[i];
        let idMiniFriendMenu="friendMiniMenu"+friendList[i];
        let idChallenge = "challengeMini" + friendList[i];
        let idProfil = "profilMini" + friendList[i];
        let idRemove = "removeMini" + friendList[i];
        let idMessage = "messageMini" + friendList[i];

        newItem.innerHTML = ` <div class="miniFriend" style="font-size: 2em;" >
                                <div style="display: flex;">
                                    <iconify-icon icon="mdi:message-notification" id=${idIconMessage} style="display:none;color:darkred;font-size: 0.5em;"></iconify-icon>
                                    <div class="mini-Friend-name" style="margin:auto;width: 100%;" id=${idDivFriend}>${friendList[i]}</div>
                                </div>
                                <div class="miniFriendMenu" id=${idMiniFriendMenu} style="display: none; justify-content: space-between;"">
                                     <div class="icon_mini" id=${idMessage}>
                                        <i class="fa-solid fa-message iconStyle" style="font-size: 1.2em; margin-left: 15%;"></i>
                                     </div>
                                    <div class="icon_mini" id=${idChallenge}>
                                      <iconify-icon class="fight iconStyle" style="font-size: 1.2em; margin:auto;" icon="mdi:sword-cross"></iconify-icon>
                                    </div>
                                    <div class="icon_mini" id="${idProfil}">
                                        <iconify-icon icon="healthicons:ui-user-profile" style="font-size: 1.5em; margin: auto;"></iconify-icon>
                                    </div>
                                    <div class="icon_mini" id="${idRemove}">
                                        <i class="fa-solid fa-xmark iconStyle" style="font-size: 1.5em; margin-right: 15%;"></i>
                                    </div>
                                </div>
                            </div>`;

        dropdown.appendChild(newItem);
        document.getElementById(idProfil).addEventListener('click',function(){
            window.location.href='/profil/profil.html?name='+friendList[i];
        })
        document.getElementById(idDivFriend).addEventListener('click', function () {
            if (document.getElementById(idMiniFriendMenu).style.display === "flex")
                document.getElementById(idMiniFriendMenu).style.display = "none";
            else
                document.getElementById(idMiniFriendMenu).style.display = "flex";
        }
        );

        document.getElementById(idChallenge).addEventListener('click', function () {
            challengeMini(friendList[i]);
        });
        document.getElementById(idRemove).addEventListener('click', function () {
            dropdown.removeChild(newItem);
            removeFriend(friendList[i]);
        });
        document.getElementById(idMessage).addEventListener('click', function () {
            currentFriendDiscussion=friendList[i];
            setupChatContainer(friendList[i]);
        });
    }
}

function addChallengerNameToLocalStorage(challengerName) {
    let theChallengerList = JSON.parse(localStorage.getItem("theChallengerList"));
    theChallengerList.push(challengerName);
    localStorage.setItem("theChallengerList", JSON.stringify(theChallengerList));
}

function removeChallengerNameFromLocalStorage(challengerName) {
    let theChallengerList = JSON.parse(localStorage.getItem("theChallengerList"));
    let index = theChallengerList.indexOf(challengerName);
    if (index !== -1) theChallengerList.splice(index, 1);
    localStorage.setItem("theChallengerList", JSON.stringify(theChallengerList));
}

function challengedMini(challengerName) {
    document.getElementById("iconNotifFight1").style.display='block';
    document.getElementById("iconNotifFight2").style.display='block';

    let dropdown = document.querySelector('.miniDropdownNotification');
    console.log("CHALLENGED MINI dropdown: " + dropdown);

    let newChallenge = document.createElement('div');
    console.log("CHALLENGED MINI newChallenge: " + newChallenge);

    newChallenge.id= "mini_Challenge"+ challengerName;
    console.log("CHALLENGED MINI newChallenge ID: " + newChallenge.id);

    let friendIsChallengingClassName = "mini_friendIsChallenging" + challengerName;
    console.log("CHALLENGED MINI friendischallengingclassname: " + friendIsChallengingClassName);
    let acceptTheChallengeId = "mini_acceptTheChallenge" + challengerName;
    console.log("CHALLENGED MINI accpet the challeneg ID: " + acceptTheChallengeId);
    let declineTheChallengeId = "mini_declineTheChallenge" + challengerName;
    console.log("CHALLENGED MINI decline the challenge ID: " + declineTheChallengeId);

    newChallenge.innerHTML = `
                            <div class="${friendIsChallengingClassName}" style="display: flex; background-color: rgba(231, 225, 195, 0.36); padding:3%;">
                                <div style="margin: auto;">${challengerName} is challenging you!</div>
                                <button class="accept" id="${acceptTheChallengeId}">Accept</button>
                                <button class="decline" id="${declineTheChallengeId}">Decline</button>
                            </div>`;
    console.log("CHALLENGED MINI newChallenge.innerHTML: " + newChallenge.innerHTML);

    dropdown.insertBefore(newChallenge,dropdown.firstChild);
    console.log("CHALLENGED MINI inserted (only listeners left without console.log)");

    document.getElementById(acceptTheChallengeId).addEventListener('click', function () {
        findToken();
        removeChallengerNameFromLocalStorage(challengerName);
        socket.emit('IAcceptTheChallenge', {
            challengedToken: token,
            username: findUsername(),
            challengerName: challengerName,
        });

        dropdown.removeChild(newChallenge);
        console.log("CHALLENGED MINI REMOVED!!!");
    });
    document.getElementById(declineTheChallengeId).addEventListener('click', function () {
        removeChallengerNameFromLocalStorage(challengerName);
        socket.emit('IDeclineTheChallenge', {
            challengerName: challengerName,
            challengedToken: token,
        });

        dropdown.removeChild(newChallenge);
        console.log("CHALLENGED MINI REMOVED!!!");
    })
}
function showFriendRequestMini(friendRequest) {
    let dropdown = document.querySelector('.miniDropdownNotification');
    dropdown.innerHTML='';
    for (let i = 0; i < friendRequest.length; i++) {
        let newItem = document.createElement('div');

        let acceptId = "mini-accept" + friendRequest[i];
        let declineId = "mini-decline" + friendRequest[i];

        newItem.innerHTML = `
                            <div class="friendReq" style="display: flex; background-color: rgba(231, 225, 195, 0.36); padding:3%;">
                                <div style="margin:auto">Friend request from ${friendRequest[i]}</div>
                                <button class="accept" id="${acceptId}">Accept</button>
                                <button class="decline" id="${declineId}">Decline</button>
                            </div>`;
        dropdown.insertBefore(newItem,dropdown.firstChild);
        document.getElementById(acceptId).addEventListener('click', function () {
            acceptFriendRequest(friendRequest[i]);
            dropdown.removeChild(newItem);
        });
        document.getElementById(declineId).addEventListener('click', function () {
            declineFriendRequest(friendRequest[i]);
            dropdown.removeChild(newItem);
        });
    }
}


document.getElementById("miniNotification").addEventListener('click', function () {
        document.getElementById("iconNotifFight1").style.display='none';
        document.getElementById("iconNotifFight2").style.display='none';
        document.getElementById("miniNotification").style.backgroundColor="rgba(0,0,0,0.06)";
        document.getElementById("miniFriendsContacts").style.backgroundColor="";
        document.getElementById("miniFriendList").style.display = "none";
        document.getElementById("miniNotificationList").style.display = "block";
});

document.getElementById("miniFriendsContacts").addEventListener('click', function () {
    document.getElementById("miniFriendsContacts").style.backgroundColor="rgba(0,0,0,0.06)";
    document.getElementById("miniNotification").style.backgroundColor="";
    document.getElementById("miniFriendList").style.display = "block";
    document.getElementById("miniNotificationList").style.display = "none";
});


const notification = document.querySelector('.notification');
const okBtn = document.querySelector('.ok-btn');

okBtn.addEventListener('click', function() {
    notification.style.display = 'none';
});
let notifText=document.getElementById("notificationTextMessage");
