
//To switch between local and aws, just change the address variable
const local = "http://localhost:8000";
const aws = "http://4quarts.connect4.academy:8000";
export const address = aws;
export var token;

export function findToken(){
    let cookies = document.cookie.split(';');
    console.log(cookies);
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].trim().startsWith("token=")) {
            token = cookies[i].trim().substring("token=".length, cookies[i].trim().length);
            break;
        }
    }
}
