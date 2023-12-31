/**
 * This class has a lot of function for the game.
 *
 * It is used by the various game modes and help to change everything.
 *
 * @author Weel BEN AISSA
 * @author Mourad KARRAKCHOU
 * @author Ayoub IMAMI
 */

import {address} from "./dataManager.js";

const mapColor = new Map();
mapColor.set('Yellow','#cee86bcc');
mapColor.set('Red','#c92c2c9c');
let littleCount=0;

export function colorMessage(counter) {
    let color = 'Red';
    if (counter % 2 === 0) color = 'Yellow';
    document.getElementById("body").style.backgroundColor = mapColor.get(color);
    document.getElementById("player").innerText = color + " turn to play";
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

export function removeIllegalMove() {
    document.getElementById("message").innerText = "";
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
                    littleCount+=1;
                    console.log(littleCount);
                    break;
                case(0):
                    document.getElementById(id).style.backgroundColor = "";
                    break;
                case(1):
                    document.getElementById(id).style.backgroundColor = "red";
                    littleCount+=1;
                    console.log(littleCount);
                    break;
            }
        }
    }
}
export function getCount(){
    console.log(littleCount);
    return littleCount;
}

export async function loadGame() {
    let token = findTokenReturned();
    var urlParams = new URLSearchParams(window.location.search);

    const values = {
        token: token,
        id: urlParams.get('id'),
    };
    console.log(values);

    await fetch(address + '/api/game/retrieveGameWithId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            retrieveGameState(data.tab);
        })
        .catch(error => {
            console.error(error);
        });
}

function find(element){
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].trim().startsWith(element)) {
            return cookies[i].trim().substring(element.length, cookies[i].trim().length);
        }
    }
}

export async function notLoggedRedirection() {

    let token = findTokenReturned();
    let response = await fetch(address + '/api/game/verifToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token
        })
    });

    let data = await response.json();
    console.log(data);

    if (token === undefined || token === "undefined"||!data.userReel) window.location.href = "/";
}

export function findTokenReturned() {
    return find("token=");
}

export function findUsername() {
    return find("username=");
}
export function saveGame(info) {
    console.log("in saveGame")
    let token = findTokenReturned();
    console.log(token);
    const tab = {
        startInversered: info.startInversered,
        gameType: info.gameType,
        tab: toTab(),
        userToken:token,
        name:info.name
    };
    console.log(tab)
    fetch(address + '/api/game', {
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
    if (document.getElementById("keepPlaying")!=null)
    {
        document.getElementById("keepPlaying").addEventListener('click', function () {document.getElementById("savedGameMessage").style.display = "none"});
        document.getElementById("backToHome").addEventListener('click', function () {window.location.href = "/home/home.html"});
    }
}

export function isMoveIllegal(event){
    let id = event.target.id;
    let tab = id.split(" ");
    let column = tab[0];
    let line = 5;

    id = column + " " + line;
    if (document.getElementById(id).style.backgroundColor !== "") {
        printIllegalMove();
        return true;
    }
    return false;
}

