import {findToken, token, address} from "../games/dataManager.js";

document.addEventListener('DOMContentLoaded', init);

function init() {
    document.getElementById('addFriendButton').addEventListener('click', addFriend);
    document.getElementById("searchBar").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addFriend();
        }
    });

    getFriendList();
    getFriendRequest();
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
        .catch(error => {
            console.error(error);
        });

    console.log("Friend request sent to " + friendQuery + "!");
    document.getElementById("searchBar").value = "";
}

function getFriendList(){
    findToken()
    const values = {
        token: token,
    };

    fetch(address + `/api/friends/retrieveFriendList`, {
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
                            <div class="friend" >
                                <h4>${friendList[i]}</h4>
                            </div>`;

        dropdown.appendChild(newItem);
        document.getElementById("trash").addEventListener('click', function () {
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
        let dropdown = document.querySelector('.dropdown');
        let newItem = document.createElement('div');

        newItem.innerHTML = `
                            <div class="friendRequest" >
                                <h4>${friendRequest[i]}</h4>
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
            friendToRemove: friendToAccept
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
            friendToRemove: friendToDecline
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}
