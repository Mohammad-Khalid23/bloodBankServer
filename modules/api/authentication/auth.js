var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var constants = require("../../../config/constants");
var requestHelper = require("../../../helpers/request");
var responseHelper = require("../../../helpers/response");
const isOnline = require('is-online');
var auth = {
  title: "Hello World",
  statusCode: constants.HTTP.CODES.SUCCESS
}
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://patient-tracker2:patient123@ds139984.mlab.com:39984/khalid-projects', { useMongoClient: true });

//user scheme
var userSchema = mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }

}, { collection: "bloodBankUsers" });

var model = mongoose.model('bloodBankUsers', userSchema);

function validateSignup(body) {
  console.log(body, "body")
  if (body.name != null && body.email != null && body.password != null) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email)) {
      return true;
    }
  } else {
    return false;
  }   ///*** Add Email regex here as well */

}


auth.home = function (req, res, next) {
  res.send('AT HOME');

}

auth.signup = function (req, res) {

  isOnline().then(online => {
    console.log(online);

    var postBody = requestHelper.parseBody(req.body);
    if (validateSignup(postBody)) {

      var user = {
        name: postBody.name,
        email: postBody.email,
        password: postBody.password
      }
      var saveData = new model(user);
      saveData.save((err, value) => {
        if (err) {
          console.error(err, "err")
        }
        else {
          responseBody = responseHelper.formatResponse(
            constants.MESSAGES.SIGNUP.SUCCESS,
            value
          )
          res.statusCode = constants.HTTP.CODES.SUCCESS;
          res.send(responseBody);
          console.log(value, "data")
        }
      });
    } else {
      responseBody = responseHelper.formatResponse(
        constants.MESSAGES.GENERAL.FIELDS_REQUIRED,
        {}
      )
      res.statusCode = constants.HTTP.CODES.BAD_REQUEST;
      res.send(responseBody);
    }
  }).catch(offline => {
    responseBody = responseHelper.formatResponse(
      constants.MESSAGES.LOGIN.ERROR,
      {}
    )

    res.statusCode = constants.HTTP.CODES.SERVER_ERROR;
    res.send(responseBody);
  })


}

auth.login = function (req, res) {
  //checking internet Connection before login
  isOnline().then(online => {
    console.log(online);
    var postBody = requestHelper.parseBody(req.body);
    var check = false;
    var loginUser = null;
    model.find(function (err, data) {
      if (err) {
        console.log(err)
      } else {
        //checking data from database
        for (let i = 0; i < data.length; i++) {
          if (data[i].email === postBody.email && data[i].password === postBody.password) {
            check = true;
            loginUser = data[i];
            break;
          }
        }
        if (check) {
          responseBody = responseHelper.formatResponse(
            constants.MESSAGES.LOGIN.SUCCESS,
            loginUser
          )
          res.statusCode = constants.HTTP.CODES.SUCCESS;
          res.send(responseBody);

        } else {
          responseBody = responseHelper.formatResponse(
            constants.MESSAGES.LOGIN.AUTH_FAILED,
            {}
          )

          res.statusCode = constants.HTTP.CODES.BAD_REQUEST;
          res.send(responseBody);
        }

      }
    })
  }).catch(offline => {
    console.log(offline)
    responseBody = responseHelper.formatResponse(
      constants.MESSAGES.LOGIN.ERROR,
      {}
    )

    res.statusCode = constants.HTTP.CODES.SERVER_ERROR;
    res.send(responseBody);
  });


}

module.exports = auth;
