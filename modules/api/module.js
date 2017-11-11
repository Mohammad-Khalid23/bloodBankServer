var express = require('express');
var router = express.Router();
var auth = require("./authentication/auth")
var bloodBank = require('./bloodbanks/bloodBank')
var donors = require('./donors/donor')


// var checkConnection = {
//     title: "check Connection",
//     statusCode: constants.HTTP.CODES.SUCCESS
//   }

router.get('/', auth.home);
/**blood bank request handlers**/
router.get('/bloodBanks', bloodBank.allBloodBanks);
router.post('/addBloodBank', bloodBank.addBloodBanks);
router.delete('/deleteBloodBank/:_bId', bloodBank.deleteBloodBank);
/**blood donor request handlers**/
router.get('/donors', donors.getDonor);
router.post('/addDonor', donors.addDonor);
router.delete('/deleteDonor/:_bId', donors.deleteDonor);
/**signup login request handlers**/
router.post('/signup', auth.signup);
router.post('/login', auth.login);



module.exports = router;
