const express = require('express');
const router = express.Router();
const {userProfile, getUserProfile} = require("../controller/user")


router.patch('/createProfile', userProfile)
router.get('/createProfile', getUserProfile)




module.exports = router