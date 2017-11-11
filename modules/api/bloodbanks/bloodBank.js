const mongoose = require('mongoose');
var constants = require("../../../config/constants");
var requestHelper = require("../../../helpers/request");
var responseHelper = require("../../../helpers/response");

var bloodBank = {
    title: "Blood Banks",
    statusCode: constants.HTTP.CODES.SUCCESS
}


//user scheme
var bloodBankSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    manager: {
        type: String,
        required: true
    }

}, { collection: 'bloodBank' });
var model = mongoose.model("bloodBank", bloodBankSchema);


//user scheme
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://patient-tracker2:patient123@ds139984.mlab.com:39984/khalid-projects', { useMongoClient: true });


/**** blood bank get and post request**/
bloodBank.allBloodBanks =
    function (req, res) {
        getBloodBank()
        res.send("got blood banks");
    }

bloodBank.addBloodBanks = function (req, res) {
    console.log(req.body, "body")
    var bloodBank = {
        name: req.body.name,
        branch: req.body.branch,
        manager: req.body.manager
    }
    addBloodBank(bloodBank, function (err, data) {
        if (err) {
            console.log(err)
        }
        res.json(bloodBank)
    })
    res.send("succesefully data has been save in Database");
}
//delet blood bank
bloodBank.deleteBloodBank =
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


//add bloodBank
function addBloodBank(data, callback) {
    var saveData = new model(data);

    saveData.save((err, value) => {
        if (err) {
            console.error(err, "err")
        }
        else {
            console.log(value, "data")
        }
    });
}


//get bloodBank
function getBloodBank(data, callback) {
    model.find(function (err, data) {
        if (err) {
            console.log(err)
        }
        console.log(data, "data blood")
    })
}
module.exports = bloodBank;