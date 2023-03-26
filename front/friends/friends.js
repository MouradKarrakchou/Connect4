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
            //TODO deleteFriend(friendList[i]);
            window.location.reload();
        });
    }
}


