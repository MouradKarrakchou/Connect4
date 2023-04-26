
export let vibrationMuted = false;

export function muteVibrationUpdateCookie() {
    console.log("before clicking vibration: " + vibrationMuted);
    vibrationMuted = !vibrationMuted;
    console.log("after clicking vibration: " + vibrationMuted);
    let cookie = document.cookie;
    let cookieArray = cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookieName = cookieArray[i].split('=')[0];
        if (cookieName === 'vibrationMuted') {
            cookieArray[i] = 'vibrationMuted=' + vibrationMuted;
            break;
        }
    }
    document.cookie = cookieArray.join(';');
    console.log("cookie after clicking vibration: " + document.cookie);
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
