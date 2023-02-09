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
    console.log(document.getElementsByName("log_username")[0].value)
    console.log(document.getElementsByName("log_pswd")[0].value)
}

function register(){
    console.log(document.getElementsByName("reg_name")[0].value)
    console.log(document.getElementsByName("reg_email")[0].value)
    console.log(document.getElementsByName("reg_pswd")[0].value)
    console.log(document.getElementsByName("reg_pswd2")[0].value)

}
