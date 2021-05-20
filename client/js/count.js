'use strict'

const el = {};

async function getVenueId(){
    const response = await fetch(`util/getVenueId`, {
        method: 'GET',
    })
    .catch(() => {
        return {ok: false}
    });
    return response.json();
}

async function getAppCount(){

    const venueID = await getVenueId();

    const response = await fetch(`https://orange-puzzle-jet.glitch.me/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'gKVDCeos6l9ZzgYMjb0F9R1IGXcOoyM66R2aMn79',
        },
        body: JSON.stringify({query: `
            query getCount($venue: ID!){
              currentVenueCount(venueId: $venue){
                count
              }
            }
            `,
            variables: {
                "venue": venueID,
            }
        }),
    }).catch(() => {
        return {ok: false}
    });

    let appCount = null;

    if (response.ok){
        const resJSON = await response.json();
        appCount = resJSON.data.currentVenueCount.count
    }
    return appCount
}

async function addManual(){
    const newCount = parseInt(sessionStorage.getItem('manualCount')) + 1
    sessionStorage.setItem('manualCount', newCount.toString())
    await updateTotal();
}

async function subtractManual(){
    const oldCount = parseInt(sessionStorage.getItem('manualCount'))
    if (oldCount > 0){
        const newCount = oldCount - 1
        sessionStorage.setItem('manualCount', newCount.toString())
        await updateTotal();
    }
}

async function updateTotal(){
    const appCount = await getAppCount(); // fetch total
    const manualCount = sessionStorage.getItem('manualCount');
    const total = appCount + parseInt(manualCount);

    el.liveCount.innerHTML = total;
    if (appCount === null){
        el.appCheckIns.innerHTML = "Server Offline - Try again Later";
        el.appCheckIns.classList.add("danger")
    }else {
        el.appCheckIns.innerHTML = appCount + " In-App Check Ins";
    }
    el.manualCheckIns.innerHTML = manualCount + " Manual Check Ins";
}

async function initPage(){
    sessionStorage.setItem('manualCount', '0');
    el.appCheckIns.innerHTML = 0 + " In-App Check Ins";
    el.manualCheckIns.innerHTML = 0 + " Manual Check Ins";

    await updateTotal();
}

function authLogin(){
    const expire = localStorage.getItem('expire');
    const currentTime = new Date()

    if (currentTime > expire || expire == null){
        location.href ='/';
    }
}

function prepareHandles(){ // Adds element to JSON object
    el.liveCount = document.querySelector('.live-count');
    el.appCheckIns = document.querySelector('.app-check-ins');
    el.manualCheckIns = document.querySelector('.manual-check-ins');
    el.add = document.querySelector('.add');
    el.subtract = document.querySelector('.subtract');
}

function addEventListeners(){
    el.add.addEventListener('click', addManual);
    el.subtract.addEventListener('click', subtractManual);
}

async function pageLoaded() { // Runs on page load
    authLogin();
    prepareHandles();
    addEventListeners();
    await initPage();
}

window.addEventListener('load', pageLoaded);
