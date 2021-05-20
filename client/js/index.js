'use strict'

const el = {};

async function login(){
    const response = await fetch('/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "beaconPwd": el.passwordInput.value
        })
    }).catch(() => {
            return {status:500}
    });

    if (response.status === 200){

        const currentTime = new Date();
        const expire = currentTime.setHours(currentTime.getHours()+12);

        localStorage.setItem('expire', expire.toString());

        location.href = '/count';
    }else{
        el.passwordInput.classList.add('incorrectBorder');
        el.error.innerHTML = "Incorrect Password. Try again."
    }


}

function prepareHandles(){ // Adds element to JSON object
    el.passwordInput = document.querySelector('#login-input');
    el.loginBtn = document.querySelector('#loginBtn');
    el.error = document.querySelector('#settings-error');
}

function addEventListeners(){
    el.loginBtn.addEventListener('click', login);
}

async function pageLoaded() { // Runs on page load
    prepareHandles();
    addEventListeners();
}

window.addEventListener('load', pageLoaded);
