'use strict'

const el = {};

function authLogin(){
    const expire = localStorage.getItem('expire');
    const currentTime = new Date()

    if (currentTime > expire || expire == null){
        location.href ='/';
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
    authLogin();
    prepareHandles();
    addEventListeners();
}

window.addEventListener('load', pageLoaded);
