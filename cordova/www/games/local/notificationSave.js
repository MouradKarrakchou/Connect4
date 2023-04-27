import {saveGame} from "../gameManagement.js";
import {popupVibration} from "../../plugins/vibration.js";

/**
 * This class manage the notification to save the game with a personalized name
 * @author Weel BEN AISSA
 * @author Mourad KARRAKCHOU
 * @author Ayoub IMAMI
 */
let notification;
let cancelChallengeMiniSave;
let okButton;
let searchBarNotification;




window.addEventListener('load', async function () {
        popupVibration();
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
        cancelChallengeMiniSave.addEventListener("click",()=>{notification.style.display="none"; popupVibration()});

        document.getElementById("saveButton").addEventListener("click",function(){notification.style.display="block";});

    }
)
