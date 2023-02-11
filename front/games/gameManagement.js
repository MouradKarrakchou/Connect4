
/**
 * change color after each player play
 */
export function colorMessage() {
    let color = 'Red';
    if (counter % 2 === 0) color = 'Yellow';
    document.getElementById("body").style.backgroundColor = color;
    document.getElementById("player").innerText = color + " turn to play"
}
