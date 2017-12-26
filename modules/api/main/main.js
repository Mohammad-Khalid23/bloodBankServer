var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var constants = require("../../../config/constants");
var requestHelper = require("../../../helpers/request");
var responseHelper = require("../../../helpers/response");
var passwordHash = require('password-hash');
const isOnline = require('is-online');
var main = {
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
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  details: {
    type: Object,
    required: true
  }

}, { collection: "bloodBankUsers" });

var model = mongoose.model('bloodBankUsers', userSchema);

function validateSignup(body) {
  console.log(body, "body")
  var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[0-9])))(?=.{6,})");
  if (body.name != null && body.email != null && body.password != null) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email) && mediumRegex.test(body.password)) {
      return true;
    }
  } else {
    return false;
  }   ///*** Add Email regex here as well */

}


main.home = function (req, res, next) {
  res.send({
    statusCode: 404,
    message: "Welcome to HomePage"
    //HomePage Data
  });

}

main.notFound = function (req, res, next) {
  res.send({
    statusCode: 404,
    message: "Sorry URL Not Found"
  });

}


main.bloodBankUser =
  function (req, res) {
    let id = req.params.id
    console.log(id, "user")
    model.findById(id, function (err, data) {
      if (err) {
        res.send({
          message: "error in getting data",
          status: constants.HTTP.CODES.BAD_REQUEST,
          userData: data

        })
        console.log(err)
      } else {

        res.send({
          message: "got data successfully",
          status: constants.HTTP.CODES.SUCCESS,
          userData: data

        })
      }
    })
  }
main.allBloodBankUsers =
  function (req, res) {
    console.log(req.params.user, 'lovely')
    model.find({ type: req.params.user }, function (err, data) {
      if (err) {
        res.send({
          message: "error in getting data",
          status: constants.HTTP.CODES.BAD_REQUEST,
          userData: data

        })
        console.log(err)
      } else {

        res.send({
          message: "got data successfully",
          status: constants.HTTP.CODES.SUCCESS,
          userData: data

        })
      }
    })
  }
main.editBloodBankUsers =
  function (req, res) {
    console.log(req.params.is, 'type')
    model.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
      if (err) {
        res.send({
          message: "error in getting data",
          status: constants.HTTP.CODES.BAD_REQUEST,
          userData: data

        })
        console.log(err)
      } else {

        res.send({
          message: "got data successfully",
          status: constants.HTTP.CODES.SUCCESS,
          userData: data

        })
      }
    })
  }

//delet blood bank User
main.deleteBloodBankUser =
  function (req, res) {
    console.log(req.params.id, "id from")
    var id = req.params.id;
    model.findByIdAndRemove(id, function (err, data) {
      if (err) {
        res.send({
          message: "error in deleting blood bank user",
          status: constants.HTTP.CODES.BAD_REQUEST,
          userData: data

        })
        console.log(err)
      } else {

        res.send({
          message: "deleted blood bank user successfully",
          status: constants.HTTP.CODES.SUCCESS,
          recieverData: data

        })
      }
    })
  }

main.signup = function (req, res) {

  isOnline().then(online => {
    console.log(online);

    var postBody = requestHelper.parseBody(req.body);
    if (validateSignup(postBody)) {

      var hashedPassword = passwordHash.generate(postBody.password);
      console.log(hashedPassword, "hashed")

      postBody.password = hashedPassword;
      console.log(postBody, "post body after add paseod")
      var saveData = new model(postBody);
      saveData.save((err, value) => {
        if (err) {
          console.error(err, "err")
        }
        else {
          responseBody = {
            message: "successfully signup",
            status: 200,
            data: value
          }
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

main.login = function (req, res) {
  //checking internet Connection before login
  var postBody = requestHelper.parseBody(req.body);
  var check = false;
  var loginUser = null;
  model.findOne({ email: postBody.email }, function (err, data) {
    if (err) {
      res.send({
        message: "Error in Login",
        Err: err
      })
      console.log(err)
    } else {
      if (data === null) {
        res.send({
          message: "User Not Found",
          loginData: data,
          status: 404
        })
      } else {
        password = passwordHash.verify(postBody.password, data.password)
        if (password) {
          res.send({
            message: "User  Found",
            loginData: data,
            status: 200
          })
        } else {
          res.send({
            message: "incorrect password",
            status: 400
          })
        }
      }


    }
  })

}

// // When successfully connected
// mongoose.connection.on('connected', function () {
//   console.log('Mongoose default connection open to ');
// });

// // If the connection throws an error
// mongoose.connection.on('error', function (err) {
//   console.log('Mongoose default connection error: ' + err);
// });

// // When the connection is disconnected
// mongoose.connection.on('disconnected', function () {
//   console.log('Mongoose default connection disconnected');
// });


module.exports = main;
