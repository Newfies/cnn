/* NPMs */
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const requestIP = require('request-ip');
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const moment = require('moment-timezone');
const randomstring = require("randomstring");
const fetch = require('node-fetch');
const { createCanvas } = require('canvas');
const dotenv = require('dotenv').config()

/* Other Variables */
let timezone = process.env.TIMEZONE || "America/Chicago";
let rawCurrentDateTime = new Date();
let currentDateTime = moment(rawCurrentDateTime).tz(timezone).format('MMMM Do YYYY, h:mm:ss a');
const port = process.env.PORT || 377;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: process.env.SECRET_SESSION, resave: false, saveUninitialized: true }));

/* Post */
app.post('/home', function(req, res) {
    const passcode = req.body.lis;
    if (passcode == process.env.PASSCODE){
        req.session.access = "verified"
        res.redirect("/home")
    } else {
        res.redirect(301, "https://www.cnn.com/error");
    }
});

/* Get */
app.get('/', function(req, res) {
    res.redirect("/home");
});

app.get('/home', function(req, res){
    if (req.session.access){
        if (req.session.access == "verified"){
            res.render('website')
        } else {
            res.render('home');
            return
        }
    } else {
        res.render('home');
    }
});

app.get('*', function(req, res) {
    if (req.session.access){
        if (req.session.access = "verified"){
            res.send(`Invalid Location, Click Button To Go Back, <button onclick="window.history.back()">Go Back</button>`)
            return
        } else {
            res.redirect(301, "https://www.cnn.com/error");
            return;
        }
    } else {
        res.redirect(301, "https://www.cnn.com/error");
        return;
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });