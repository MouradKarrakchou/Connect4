import {findUsername} from "../games/gameManagement.js";
import {findToken} from "../games/dataManager.js";
import {findElo} from "../games/gameManagement.js";



var username = findUsername();
var partiesJouees = 0;
var victoires = 0;
var defaites = 0;
var nuls = 0;
var rank = findElo();
console.log("cookie: " + document.cookie);

// Met à jour les éléments HTML avec les statistiques réelles de l'utilisateur
document.getElementById("username").innerHTML = username;
document.getElementById("parties-jouees").innerHTML = partiesJouees;
document.getElementById("victoires").innerHTML = victoires;
document.getElementById("defaites").innerHTML = defaites;
document.getElementById("nuls").innerHTML = nuls;
document.getElementById("rank").innerHTML = rank;