
window.addEventListener('load', function() {
    // Create the overlay
    var overlay = document.createElement('div');
    overlay.id = 'overlay';
    document.body.appendChild(overlay);

    // Add an event listener to remove the overlay when an event is triggered
    document.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
});

function checkConnection() {
    let networkState = navigator.connection.type;

    let states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
}

function connectionLost() {

}

function connectionRetrieved() {

}
