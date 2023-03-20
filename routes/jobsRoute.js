const express = require('express');
const router = express.Router();
const {postJob} = require("../controller/jobs")


router.post('/createJobs', postJob)


module.exports = router