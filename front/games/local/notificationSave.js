import {saveGame} from "../gameManagement.js";

let notification;
let cancelChallengeMiniSave;
let okButton;
let searchBarNotification;




window.addEventListener('load', async function () {
        console.log("TYPE OF GAME: " +window.typeofGame);
        console.log(window);
        notification=document.getElementById("notificationSave");
        searchBarNotification=document.getElementById("searchBarNotification");
        cancelChallengeMiniSave=document.getElementById("cancelChallengeMini-Save");
        okButton=document.getElementById("ok-btn-save");

        okButton.addEventListener("click",()=>{
            notification.style.display="none";
            saveGame({gameType:window.typeofGame,startInversed:false,name:searchBarNotification.value});
        });
        cancelChallengeMiniSave.addEventListener("click",()=>notification.style.display="none");

        document.getElementById("saveButton").addEventListener("click",function(){notification.style.display="block";});

    }
)
