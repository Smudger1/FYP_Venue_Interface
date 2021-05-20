'use strict'
const {asyncWrap} = require("./util");
const express = require('express');
const fs = require('fs');

function getVenueId(req, res){
    let ID;

    try {
        const data = fs.readFileSync('settings.json', 'utf8')
        ID = JSON.parse(data).venueId;
    } catch (err) {
        console.error(err)
    }

    res.json(ID)
}

const router = express.Router();
router.get('/getVenueId', asyncWrap(getVenueId));

module.exports = router;
