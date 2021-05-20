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

async function getVenueDetails(){
    const response = await fetch(`https://orange-puzzle-jet.glitch.me/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'gKVDCeos6l9ZzgYMjb0F9R1IGXcOoyM66R2aMn79',
        },
        body: JSON.stringify({query: `
            query getVenue ($venueId: ID!){
              venue(id: $venueId){
                venueName
                venueAddr1
                venueAddr2
                venuePostcode
                venueOpen
                venueClose
              }
            }
            `,
            variables: {
                "venueId": await getVenueId()
            }


        }),
    }).catch(() => {
        return {ok: false}
    });

    if (response.ok){
        const resJSON = await response.json();

        return resJSON.data.venue;

    }else{
        return null;
    }
}

async function fillInDetails(){
    const details = await getVenueDetails();
    if (details){
        el.venueName.value = details.venueName;
        el.venueAddr1.value = details.venueAddr1;
        el.venueAddr2.value = details.venueAddr2;
        el.venuePostcode.value = details.venuePostcode
        el.openTime.value = details.venueOpen;
        el.closeTime.value = details.venueClose;
    }else{
        el.error.innerHTML = "Server Offline - Try Again Later"
    }
}

async function updateVenue(){
    const response = await fetch(`https://orange-puzzle-jet.glitch.me/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'gKVDCeos6l9ZzgYMjb0F9R1IGXcOoyM66R2aMn79',
        },
        body: JSON.stringify({query: `
            mutation VenueUpdate($venueId: ID!, $venueName:String!, $venueAddr1: String!, $venueAddr2: String, $venuePostcode: String!, $venueOpen: String!, $venueClose: String!){
              updateVenueDetails(id: $venueId, venueName: $venueName, venueAddr1: $venueAddr1, venueAddr2: $venueAddr2, venuePostcode: $venuePostcode, venueOpen: $venueOpen, venueClose: $venueClose){
                success
                message
              }
            }
            `,
            variables: {
                "venueId": await getVenueId(),
                "venueName": el.venueName.value,
                "venueAddr1": el.venueAddr1.value,
                "venueAddr2": el.venueAddr2.value,
                "venuePostcode": el.venuePostcode.value,
                "venueOpen": el.openTime.value,
                "venueClose": el.closeTime.value
            }
        }),
    }).catch(() => {
        return {ok: false}
    });
}

async function updatePassword() {
    const response = await fetch(`login/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "newPwd": el.beaconPwd.value
        })
    })
    .catch(() => {
        return {ok: false}
    });

    return response.ok;
}

function verifyPasswords(){
    const wifiPwd = el.wifiPwd.value;
    const repeatWifiPwd = el.repeatWifiPwd.value;
    const beaconPwd = el.beaconPwd.value;
    const repeatBeaconPwd = el.repeatBeaconPwd.value;

    let valid = true;

    const validPwd = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')

    if (wifiPwd.length > 0){
        if (!validPwd.test(wifiPwd)){
            valid = false;
            el.wifiPwd.classList.add("incorrectBorder");
            el.repeatWifiPwd.classList.add("incorrectBorder");
        }
        if (wifiPwd !== repeatWifiPwd) {
            valid = false;
            el.wifiPwd.classList.add("incorrectBorder");
            el.repeatWifiPwd.classList.add("incorrectBorder");
        }
    }
    if (beaconPwd.length > 0){
        if (!validPwd.test(beaconPwd)){
            valid = false;
            el.beaconPwd.classList.add("incorrectBorder");
            el.repeatBeaconPwd.classList.add("incorrectBorder");
        }
        if (beaconPwd !== repeatBeaconPwd) {
            valid = false;
            el.beaconPwd.classList.add("incorrectBorder");
            el.repeatBeaconPwd.classList.add("incorrectBorder");
        }
    }
    return valid;
}

function verifyDetails(){
    const name = el.venueName.value;
    const addr1 = el.venueAddr1.value;
    const postcode = el.venuePostcode.value;
    const openTime = el.openTime.value;
    const closeTime = el.closeTime.value;

    let valid = true;

    if (name.length < 1){
        valid = false;
        el.venueName.classList.add("incorrectBorder");
    }
    if (addr1.length < 9){
        valid = false;
        el.venueAddr1.classList.add("incorrectBorder");
    }
    if (postcode.length < 6){
        valid = false;
        el.venuePostcode.classList.add("incorrectBorder");
    }
    if (openTime === ""){
        valid = false;
        el.openTime.classList.add("incorrectBorder");
    }
    if (closeTime === ""){
        valid = false;
        el.closeTime.classList.add("incorrectBorder");
    }

    return valid;
}

async function save() {

    const detailsValid = verifyDetails();
    const pwdValid = verifyPasswords();

    if (detailsValid && pwdValid) {
        await updateVenue()
        if (el.beaconPwd.value.length > 0){
            await updatePassword();
        }
        location.reload();
    }

}

function cancel(){
    location.reload();
}

function authLogin(){
    const expire = localStorage.getItem('expire');
    const currentTime = new Date()

    if (currentTime > expire || expire == null){
        location.href ='/';
    }
}

function prepareHandles(){ // Adds element to JSON object
    el.cancelBtn = document.querySelector('#cancel');
    el.saveBtn = document.querySelector('#save');

    el.venueName = document.querySelector('#venue-name');
    el.venueAddr1 = document.querySelector('#venue-addr-line-1');
    el.venueAddr2 = document.querySelector('#venue-addr-line-2');
    el.venuePostcode = document.querySelector('#venue-postcode');

    el.wifiPwd = document.querySelector('#new-wifi-pwd');
    el.repeatWifiPwd = document.querySelector('#repeat-wifi-pwd');
    el.beaconPwd = document.querySelector('#new-beacon-pwd');
    el.repeatBeaconPwd = document.querySelector('#repeat-beacon-pwd');

    el.openTime = document.querySelector('#venue-open-time');
    el.closeTime = document.querySelector('#venue-close-time');

    el.error = document.querySelector('#settings-error');
}

function addEventListeners(){
    el.cancelBtn.addEventListener('click', cancel);
    el.saveBtn.addEventListener('click', save);
}

async function pageLoaded() { // Runs on page load
    authLogin();
    prepareHandles();
    addEventListeners();
    await fillInDetails();
}

window.addEventListener('load', pageLoaded);
