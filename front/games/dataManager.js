
//To switch between local and aws, just change the address variable
const local = "http://localhost:8000";
const aws = "http://15.236.190.187:8000";
export const address = local;
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
