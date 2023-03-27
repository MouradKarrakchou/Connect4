console.log(document.cookie)
import {findTokenReturned, findUsername} from "../games/gameManagement.js"
import {address} from "../games/dataManager.js";

window.addEventListener("load", function () {
    if(findTokenReturned() !== "undefined" && findTokenReturned()!==undefined && findUsername() !== "undefined") {
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
    buttonLog.style.backgroundColor="#fffbe3d1";
    buttonReg.style.backgroundColor="rgba(150,144,133,0.53)";
    document.getElementById("log").style.display="none";
    document.getElementById("reg").style.display="block";
}

function login_page(){
    buttonReg.style.backgroundColor="#fffbe3d1";
    buttonLog.style.backgroundColor="rgba(150,144,133,0.53)";
    document.getElementById("reg").style.display="none";
    document.getElementById("log").style.display="block";
}

document.getElementById("loginButton").addEventListener('click', login);
document.getElementById("usernameLoginInput").addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        await login();
    }
});
document.getElementById("passwordLoginInput").addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        await login();
    }
});
async function login() {

    const user = document.getElementsByName("log_name")[0].value;
    const password = hash(document.getElementsByName("log_pswd")[0].value);

    if (user === "" || password === "") {
        document.getElementById("errorMessageLogin").innerText = "Please complete all fields";
        document.getElementById("errorMessageLogin").style.display = "block";
        return;
    }

    const values = {
        username: user,
        password: password,
    };

    fetch(address +'/api/login', {
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
                document.cookie = "elo=" + data.elo + ";path=/";

                console.log(document.cookie);
                window.location.href = '/home/home.html';
            } else {
                document.getElementById("errorMessageLogin").innerText = "Wrong username or password";
                document.getElementById("errorMessageLogin").style.display = "block";
            }
        })
        .catch(error => {
            console.error(error);
        });
}

document.getElementById("registerButton").addEventListener('click', register);
document.getElementById("usernameRegisterInput").addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        await register();
    }
});
document.getElementById("mailRegisterInput").addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        await register();
    }
});document.getElementById("passwordRegisterInput").addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        await register();
    }
});
document.getElementById("confirmPasswordRegisterInput").addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        await register();
    }
});
async function register() {
    const name = document.getElementsByName("reg_name")[0].value;
    const mail = document.getElementsByName("reg_email")[0].value;
    const clearPassword = document.getElementsByName("reg_pswd")[0].value;
    const confirmClearPassword = document.getElementsByName("reg_pswd2")[0].value;

    if (name === "" || mail === "" || clearPassword === "" || confirmClearPassword === "") {
        document.getElementById("errorMessage").innerText = "Please complete all fields";
        document.getElementById("errorMessage").style.display = "block";
        return;
    }

    if (confirmPassword(clearPassword, confirmClearPassword)) {
        console.log("passwords are the same");
        const values = {
            username: name,
            password: hash(clearPassword),
            email: mail,
        };

        fetch(address + '/api/register', {
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
                    window.location.href = '/home/home.html';
                }
            })
    }

    else {
        document.getElementById("errorMessage").innerText = "Passwords are not the same!";
        document.getElementById("errorMessage").style.display = "block";
    }
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
