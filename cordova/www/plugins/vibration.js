
export function notificationVibration() {
    navigator.vibrate(100);
}

export function errorVibration() {
    navigator.vibrate([100, 100]);
}

export function timerVibration() {
    navigator.vibrate(50);
}

export function popupVibration() {
    navigator.vibrate(50);
}

export function winVibration() {
    navigator.vibrate([50, 50, 50]);
}

export function loseVibration() {
    navigator.vibrate([500]);
}

export function onlineGameFoundVibration() {
    navigator.vibrate([250]);
}

export function registerVibration() {
    navigator.vibrate([50, 50, 50]);
}
