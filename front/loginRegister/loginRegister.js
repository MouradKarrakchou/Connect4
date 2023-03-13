console.log(document.cookie)
import {findToken, findUsername} from "../games/gameManagement.js"

window.addEventListener("load", function () {
    if(findToken() !== "undefined" && findToken()!==undefined && findUsername() !== "undefined") {
        document.getElementById("usernameToContinueWith").innerHTML = findUsername();
        document.getElementById("retrieveSession").style.display = "block";
        document.getElementById("usernameToContinueWith").addEventListener('click', function () {
            window.location.href = "../home/home.html"
        })
    }
})

let buttonLog=document.getElementById("login")
buttonLog.addEventListener("click",login_page)

let buttonReg=document.getElementById("signIn")
buttonReg.addEventListener("click",signIn_page)

function signIn_page(){
    buttonLog.style.borderBottom="5px solid #333";
    buttonLog.style.borderRight="5px solid #333";
    buttonReg.style.borderBottom="0px";
    buttonReg.style.borderLeft="0px";
    document.getElementById("log").style.display="none";
    document.getElementById("reg").style.display="inline";
}

function login_page(){
    buttonLog.style.borderBottom="0px";
    buttonLog.style.borderRight="0px";
    buttonReg.style.borderBottom="5px solid #333";
    buttonReg.style.borderLeft="5px solid #333";
    document.getElementById("reg").style.display="none";
    document.getElementById("log").style.display="inline";
}

document.getElementById("loginButton").addEventListener('click', login);
async function login() {
    const values = {
        username: document.getElementsByName("log_name")[0].value,
        password: hash(document.getElementsByName("log_pswd")[0].value),
    };

    fetch('http://15.236.190.187:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.token) {
                document.cookie = "token=" + data.token + ";path=/";
                document.cookie = "username=" + data.username + ";path=/";
                console.log(document.cookie);
                window.location.href = '/home/home.html';
            } else {
                window.alert("Wrong username or password");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

document.getElementById("registerButton").addEventListener('click', register);
async function register() {
    const clearPassword = document.getElementsByName("reg_pswd")[0].value;
    const confirmClearPassword = document.getElementsByName("reg_pswd2")[0].value;

    if (confirmPassword(clearPassword, confirmClearPassword)) {
        console.log("passwords are the same");
        const values = {
            username: document.getElementsByName("reg_name")[0].value,
            password: hash(clearPassword),
            email: document.getElementsByName("reg_email")[0].value,
        };

        fetch('http://15.236.190.187:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status==="failure") {
                    window.alert("Username already taken");
                } else {
                    window.alert("Registration successful");
                }
            })
    }

    else

        document.getElementById("errorMessage").style.display = "block";
}

function hash(str) {
    let key = 7;
    let result = "";
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        // If the letter is an upper case
        if (char.match(/[A-Z]/i)) {
            // Getting the ASCII code
            let code = str.charCodeAt(i);
            // Add the key to the ASCII code
            code += key;
            // Coming back to 'A' if we go over 'Z' (upper case)
            if (char === char.toUpperCase() && code > 90) {
                code = 64 + (code - 90);
            }
            // Coming back to 'a' if we go over 'z' (lower case)
            else if (char === char.toLowerCase() && code > 122) {
                code = 96 + (code - 122);
            }
            // Adding to the encrypted string
            result += String.fromCharCode(code);
        } else {
            // If the character is not a letter, we let it as it is
            result += char;
        }
    }
    return result;
}

function confirmPassword(clearPassword, confirmClearPassword) {
    const hashedPassword = hash(clearPassword);
    const confirmedHashedPassword = hash(confirmClearPassword);
    return (hashedPassword === confirmedHashedPassword);
}
