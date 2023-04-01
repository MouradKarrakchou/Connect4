import {findToken, token, address} from "../games/dataManager.js";
import {findUsername} from "../games/gameManagement.js";
let socket = io();

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

    pendingChallenge = false;

    window.location.reload();

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

socket.on('friendIsChallenging', (data) => {
    document.getElementById("iconNotifFight1").style.display='block';
    document.getElementById("iconNotifFight2").style.display='block';
    challengedMini(data);
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
    window.location.href = '../games/multiplayer/multiplayer.html';
});

socket.on('challengeDeclined', (challengedName) => {
    pendingChallenge = false;
    notification.style.display="flex";
    document.getElementById("cancelChallengeMini").style.display = "none";
    document.getElementById("ok-btn").style.display = "block";
    notifText.innerText= "Oh no! " + challengedName + " has declined your challenge!";
})

socket.on('challengeHasBeenCanceled', () => {
    window.location.reload();
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
    }
    else
    {
        miniContainerContent.style.display="block"
        document.getElementById("chevron-down").style.display="block";
        document.getElementById("chevron-up").style.display="none";
    }
}
function displayMiniFriends(){
    console.log("click");
    currentFriendDiscussion=null;
    miniFriendContainer.style.display = "block";
    document.getElementById("chat-container").style.display = "none";
}


function showMiniFriendList(friendList) {
    console.log(friendList);
    for (let i = 0; i < friendList.length; i++) {
        let dropdown = document.querySelector('.miniDropdown');
        let newItem = document.createElement('div');

        let idIconMessage="notificationMini" + friendList[i];
        let idDivFriend = "friendMini" + friendList[i];
        let idMiniFriendMenu="friendMiniMenu"+friendList[i];
        let idChallenge = "challengeMini" + friendList[i];
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
                                    <div class="icon_mini" id="${idRemove}">
                                        <i class="fa-solid fa-xmark iconStyle" style="font-size: 1.5em; margin-right: 15%;"></i>
                                    </div>
                                </div>
                            </div>`;

        dropdown.appendChild(newItem);
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
            removeFriend(friendList[i]);
        });
        document.getElementById(idMessage).addEventListener('click', function () {
            currentFriendDiscussion=friendList[i];
            setupChatContainer(friendList[i]);
        });
    }
}

function challengedMini(data) {
    let dropdown = document.querySelector('.miniDropdownNotification');
    let newChallenge = document.createElement('div');
    let challengerName = data.challengerName;

    let friendIsChallengingClassName = "mini_friendIsChallenging" + challengerName;
    let acceptTheChallengeId = "mini_acceptTheChallenge" + challengerName;
    let declineTheChallengeId = "mini_declineTheChallenge" + challengerName;

    newChallenge.innerHTML = `
                            <div class="${friendIsChallengingClassName}" style="display: flex; background-color: rgba(231, 225, 195, 0.36); padding:3%;">
                                <div style="margin: auto;">${challengerName} is challenging you!</div>
                                <button class="accept" id="${acceptTheChallengeId}">Accept</button>
                                <button class="decline" id="${declineTheChallengeId}">Decline</button>
                            </div>`;

    dropdown.insertBefore(newChallenge,dropdown.firstChild);

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
function showFriendRequestMini(friendRequest) {
    for (let i = 0; i < friendRequest.length; i++) {
        let dropdown = document.querySelector('.miniDropdownNotification');
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
            window.location.reload();
        });
        document.getElementById(declineId).addEventListener('click', function () {
            declineFriendRequest(friendRequest[i]);
            window.location.reload();
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
