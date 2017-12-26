var express = require('express');
var router = express.Router();
var main = require("./main/main")
var bloodBank = require('./bloodbanks/bloodBank')


router.get('/', main.home);
// router.get('*', main.notFound);

/**blood bank request handlers**/
router.get('/allBloodBankUser/:user', main.allBloodBankUsers);
router.get('/bloodBankUser/:id', main.bloodBankUser);
router.delete('/deleteBloodBankUser/:id', main.deleteBloodBankUser);
router.put('/editBloodBankUser/:id', main.editBloodBankUsers);

/**signup login request handlers**/
router.post('/signup', main.signup);
router.post('/login', main.login);



module.exports = router;
