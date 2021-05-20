'use strict'
const { asyncWrap } = require("./util");
const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');

function editLogin (req, res){
    const newPwd = req.body.newPwd;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newPwd, salt).then(function (hash) {
            try {
                const data = fs.readFileSync('settings.json', 'utf8')

                let newData = JSON.parse(data);
                newData.beaconPwd = hash;

                fs.writeFileSync('settings.json', JSON.stringify(newData));

                res.sendStatus(200);
            } catch (err) {
                console.error(err)
                res.sendStatus(500)
            }
        });
    });
}

async function login(req, res) {

    const beaconPwd = req.body.beaconPwd;

    let realPwd;
    let valid = false;

    try {
        const data = fs.readFileSync('settings.json', 'utf8')
        realPwd = JSON.parse(data).beaconPwd;

        valid = bcrypt.compare(beaconPwd, realPwd).then(function (result) {
            return result
        });
    } catch (err) {
        console.error(err)
    }

    if (await valid) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
}

const router = express.Router();
router.post('/', express.json(), asyncWrap(login));
router.post('/edit', express.json(), asyncWrap(editLogin));

module.exports = router;
