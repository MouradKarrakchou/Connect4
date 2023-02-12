
/**
 * change color after each player play
 */
export function colorMessage(counter) {
    let color = 'Red';
    if (counter % 2 === 0) color = 'Yellow';
    document.getElementById("body").style.backgroundColor = color;
    document.getElementById("player").innerText = color + " turn to play"
}

export function checkWin() {
    let winner = false;
    for (let j = 0; j < 6; j++) {
        for (let i = 0; i < 7; i++) {
            let color = document.getElementById(i + " " + j).style.backgroundColor;
            if (color !== "") {
                if (checkVertical(i, j, color) || checkHorizontal(i, j, color) || checkDiagonal(i, j, color)) {
                    winner = true;
                    break;
                }
            }
        }
        if (winner) {
            break;
        }
    }
    return winner;}

/**
 * return false if the game is finished and true is the person still plays
 * @param event
 * @returns {boolean|void}
 */
export function startPlay(event,counter) {
    if (counter === 42) {
        console.log("Draw!");
        document.getElementById("message").innerText = "Draw!";
        document.getElementById("reset-button").style.display = "block";
        document.getElementById("reset-button").addEventListener("click", resetGame);
        return false;
    }
    let color = 'red';
    if (counter % 2 === 0) color = 'yellow';

    let id = event.target.id;
    let tab = id.split(" ");
    let column = tab[0];
    let line = 5;

    id = column + " " + line;
    if (document.getElementById(id).style.backgroundColor !== "")
        return printIllegalMove();

    while (line >=0 && document.getElementById(id).style.backgroundColor === "") {
        line--;
        id = column + " " + line;
    }

    line++;
    id = column + " " + line;
    document.getElementById(id).style.backgroundColor = color;
    if (checkWin() === true) {
        console.log(color + " player wins!");
        document.getElementById("message").innerText = color + " player wins!";
        document.getElementById("reset-button").style.display = "block";
        document.getElementById("reset-button").addEventListener("click", resetGame);
        return false;
    }
    return true;
}

export function checkDraw(counter){
    if (counter === 42) {
        console.log("Draw!");
        document.getElementById("message").innerText = "Draw!";
        document.getElementById("reset-button").style.display = "block";
        document.getElementById("reset-button").addEventListener("click", resetGame);
        return(true);
    }
    return false;
}
export function printIllegalMove() {
    document.getElementById("message").innerText = "Illegal move!";
}

function checkVertical(i, j) {
    let color = document.getElementById(i + " " + j).style.backgroundColor;
    let count = 0;
    for (let k = 0; k < 4; k++) {
        let id = (i + k) + " " + j;
        if (document.getElementById(id) && document.getElementById(id).style.backgroundColor === color) {
            count++;
        } else break;
    }
    return count === 4;
}

function checkHorizontal(i, j) {
    let color = document.getElementById(i + " " + j).style.backgroundColor;
    let count = 0;
    for (let k = 0; k < 4; k++) {
        let id = i + " " + (j + k);
        if (document.getElementById(id) && document.getElementById(id).style.backgroundColor === color) {
            count++;
        } else break;
    }
    return count === 4;
}

function checkDiagonal(i, j) {
    let color = document.getElementById(i + " " + j).style.backgroundColor;
    let count = 0;
    for (let k = 0; k < 4; k++) {
        let id = (i + k) + " " + (j + k);
        if (document.getElementById(id) && document.getElementById(id).style.backgroundColor === color) {
            count++;
        } else break;
    }
    if (count === 4) return true;

    count = 0;
    for (let k = 0; k < 4; k++) {
        let id = (i - k) + " " + (j + k);
        if (document.getElementById(id) && document.getElementById(id).style.backgroundColor === color) {
            count++;
        } else break;
    }
    if (count === 4) return true;
    return false;
}

//red are 1 yellow are -1
export function toTab(){
    let l = [];
    for (let j = 0; j < 7; j++) {
        l[j]=[];
        for (let i = 0; i < 6; i++) {
            let id = j + " " + i;
            switch (document.getElementById(id).style.backgroundColor){
                case(""):
                    l[j][i]=0;
                    break;
                case("red"):
                    l[j][i]=1;
                    break;
                case("yellow"):
                    l[j][i]=-1;
                    break;
            }
        }
    }
    return l;
}

export function retrieveGameState(gameTab) {
    for (let j = 0; j < 7; j++) {
        for (let i = 0; i < 6; i++) {
            let id = j + " " + i;
            switch (gameTab[j][i]){
                case(-1):
                    document.getElementById(id).style.backgroundColor = "yellow";
                    break;
                case(0):
                    document.getElementById(id).style.backgroundColor = "";
                    break;
                case(1):
                    document.getElementById(id).style.backgroundColor = "red";
                    break;
            }
        }
    }
}

export function loadGame(){
    let token= findToken();
    var urlParams = new URLSearchParams(window.location.search);

    const values = {
        token: token,
        id:urlParams.get('id'),
    };
    console.log(values);

    fetch('http://localhost:8000/api/game/retrieveGameWithId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            //document.cookie = "token="+data.token+";path=/";
            console.log(data);
            retrieveGameState(data.tab);
            //window.location.href = '/games/local/local_game.html';
        })
        .catch(error => {
            console.error(error);
        });
}

export function findToken(){
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].trim().startsWith("token=")) {
            return cookies[i].trim().substring("token=".length, cookies[i].trim().length);
        }
    }
}

export function saveGame(gameType) {
    console.log("in saveGame")
    let token=findToken();
    console.log(token);
    const tab = {
        gameType: gameType,
        tab: toTab(),
        userToken:token
    };
    console.log(tab)
    fetch('http://localhost:8000/api/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tab)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
}

