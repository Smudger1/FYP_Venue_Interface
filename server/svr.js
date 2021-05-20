'use strict';

const express = require('express');
const app = express();

const util_api = require('./utilAPI');
const login_api = require('./loginAPI');

app.use(express.static('../client', { extensions: ['html'] }));

app.use('/util', util_api);
app.use('/login', login_api);

app.listen(8080);

console.log("Server running at: http://localhost:8080" );
