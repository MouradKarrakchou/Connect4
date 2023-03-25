
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
    console.log("Friend request sent to " + friendQuery + "!");
    document.getElementById("searchBar").value = "";
}


