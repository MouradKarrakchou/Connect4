let states = {};
states["UNKNOWN"]  = 'Unknown connection';
states["ETHERNET"] = 'Ethernet connection';
states["WIFI"]     = 'WiFi connection';
states["CELL_2G"]  = 'Cell 2G connection';
states["CELL_3G"]  = 'Cell 3G connection';
states["CELL_4G"]  = 'Cell 4G connection';
states["CELL"]     = 'Cell generic connection';
states["NONE"]     = 'No network connection';

document.addEventListener("offline", onOffline, false);

document.addEventListener("online", onOnline, false);

let overlay;

function onOffline() {
    console.log(navigator.connection.type);
    // Create the overlay
    overlay = document.createElement('div');
    overlay.id = 'overlay';
    document.body.appendChild(overlay);
}

function onOnline() {
    // Remove the overlay
    document.body.removeChild(overlay);
}

function checkConnection() {
    let networkState = navigator.connection.type;
    if (states[networkState])let a;
    //alert('Connection type: ' + states[networkState]);
}
