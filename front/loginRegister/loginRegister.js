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

function login(){
    const values = {
        username: document.getElementsByName("log_name")[0].value,
        password: document.getElementsByName("log_pswd")[0].value,
    };

    fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then(data => {
            document.cookie = "token="+data.token+";path=/";
            document.cookie = "username="+data.username+";path=/";
            console.log(document.cookie);
            window.location.href = '/games/local/local_game.html';
        })
        .catch(error => {
            console.error(error);
        });
}

function register(){
    const clearPassword = document.getElementsByName("reg_pswd")[0].value;
    const values = {
        username: document.getElementsByName("reg_name")[0].value,
        password: crypto.createHash('sha256').update(clearPassword).digest('hex'),
        email: document.getElementsByName("reg_email")[0].value,
    };

    fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(data => {
            document.cookie=data;
            console.log(document.cookie);
        })
    console.log(document.getElementsByName("reg_name")[0].value)
    console.log(document.getElementsByName("reg_email")[0].value)
    console.log(document.getElementsByName("reg_pswd")[0].value)
    console.log(document.getElementsByName("reg_pswd2")[0].value)}
