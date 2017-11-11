const mongoose = require('mongoose');
var constants = require("../../../config/constants");
var requestHelper = require("../../../helpers/request");
var responseHelper = require("../../../helpers/response");

var donors = {
    title: "Blood Donor",
    statusCode: constants.HTTP.CODES.SUCCESS
}
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://patient-tracker2:patient123@ds139984.mlab.com:39984/khalid-projects', { useMongoClient: true });


//user scheme
var donorSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    donationDate: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    }

}, { collection: "donors" });

var model = mongoose.model("donors", donorSchema);


donors.addDonor = function (req, res) {
    var postBody = requestHelper.parseBody(req.body);
    res.send(postBody)
    var donor = {
        name: postBody.name,
        email: postBody.email,
        age: postBody.age,
        weight: postBody.weight,
        donationDate: postBody.donationDate,
        bloodGroup: postBody.bloodGroup,
        contactNumber: postBody.contactNumber,
        city: postBody.city
    }
    addDonors(donor, function (err, data) {
        if (err) {
            console.log(err)
        }
        res.json(donor)
    })
    res.send("succesefully user has been added in Database");
}
//get donors
donors.getDonor =function (req, res) {
    getDonors()
    res.send("got all donors");
}



//delet blood bank
donors.deleteDonor =
function (req, res) {
    var postBody = requestHelper.parseBody(req.body);
    res.send(postBody)
    var id = postBody._id.$oid;
    model.findByIdAndRemove(id, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
            console.log(constants.HTTP.CODES.SUCCESS)
        }
    })
}








//add donor funtion
function addDonors(data, callback) {
    var saveData = new model(data);

    saveData.save((err, dat) => {
        if (err) {
            console.error(err, "err")
        }
        else {
            console.log(dat, "data")
        }
    });
}

//get donor funtion
function getDonors(data, callback) {
    model.find(function (err, data) {
        if (err) {
            console.log(err)
        }
        console.log(data, "data user")
    })
}
module.exports = donors;