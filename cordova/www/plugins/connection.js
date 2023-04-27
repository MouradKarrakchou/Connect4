
document.addEventListener("offline", onOffline, false);

document.addEventListener("online", onOnline, false);

let overlay;
let connectionLost = false;

function onOffline() {
    console.log("went offline");
    // Create the overlay
    overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.innerText = "Connection lost...";
    overlay.style.color = "red";
    document.body.appendChild(overlay);
    connectionLost = true;
}

function onOnline() {
    // Remove the overlay
    if (connectionLost) {
        overlay.innerText = "Connection retrieved!"
        overlay.style.color = "green";
        setTimeout(function () {
            document.body.removeChild(overlay);
        }, 1000);
    }
}
