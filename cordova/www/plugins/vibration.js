
export let vibrationMuted;

export function muteVibrationUpdateCookie() {
    console.log("1: " + document.cookie);
    vibrationMuted = isVibrationMuted();
    vibrationMuted = !vibrationMuted;
    document.cookie = "vibrationMuted=" + vibrationMuted + ";path=/";
    console.log("2: " + document.cookie);
    return vibrationMuted;
}

export function isVibrationMuted(){
    let vibrationMutedFromCookie;
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].trim().startsWith("vibrationMuted=")) {
            vibrationMutedFromCookie = cookies[i].trim().substring("vibrationMuted=".length, cookies[i].trim().length);
            break;
        }
    }
    return vibrationMutedFromCookie === "true";
}

export function notificationVibration() {
    if(!vibrationMuted) navigator.vibrate(100);
}

export function errorVibration() {
    if(!vibrationMuted) navigator.vibrate([100, 100]);
}

export function timerVibration() {
    if(!vibrationMuted) navigator.vibrate(50);
}

export function popupVibration() {
    if(!vibrationMuted) navigator.vibrate(50);
}

export function winVibration() {
    if(!vibrationMuted) navigator.vibrate([50, 50, 50]);
}

export function loseVibration() {
    if(!vibrationMuted) navigator.vibrate([500]);
}

export function onlineGameFoundVibration() {
    if(!vibrationMuted) navigator.vibrate([250]);
}

export function registerVibration() {
    if(!vibrationMuted) navigator.vibrate([50, 50, 50]);
}
