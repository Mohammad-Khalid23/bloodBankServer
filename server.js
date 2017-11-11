const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
var BloodBank = require('./modules/bloodBank')
var Donors = require('./modules/donor')

//creating server
const app = express();

//server listen on
app.listen(8000, function () {
    console.log("------------------------")
    console.log("---Server is Running----");
    console.log("Listen on locahost :8000")
    console.log("-------------------------")
});

app.use(bodyParser.json(), function (err, req, res, next) {
    if (err) {
        return res.status(500).json({ error: err })
    }
    next();

});
app.use(bodyParser.urlencoded({ extended: true }))

//user scheme
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://patient-tracker2:patient123@ds139984.mlab.com:39984/khalid-projects', { useMongoClient: true });



/**** blood bank get and post request**/
app.get('/bloodBanks', function (req, res) {
    BloodBank.getBloodBank()
    res.send("abc");
});
// app.delete('/deleteBloodBanks/:_id', function (req, res) {
//     console.log(req.params._id,"id")
//     BloodBank.deleteBloodBank(req.params._id)
//     res.send("deleted");
// });

app.post('/addBloodBank', function (req, res) {
    console.log(req.body, "body")
    var bloodBank = {
        name: req.body.name,
        branch: req.body.branch,
        manager: req.body.manager
    }
    BloodBank.addBloodBank(bloodBank, function (err, data) {
        if (err) {
            console.log(err)
        }
        res.json(bloodBank)
    })
    res.send("succesefully data has been save in Database");
});


/**** user get and post request**/
app.get('/allUsers', function (req, res) {
    Donors.getUser()
    res.send("abc");
});

app.post('/addUser', function (req, res) {
    console.log(req.body, "body")
    var users = {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        weight: req.body.weight,
        donationDate: req.body.donationDate,
        bloodGroup: req.body.bloodGroup,
        contactNumber: req.body.contactNumber,
        city: req.body.city
    }
    Donors.addUser(users, function (err, data) {
        if (err) {
            console.log(err)
        }
        res.json(users)
    })
    res.send("succesefully user has been added in Database");
});







// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});