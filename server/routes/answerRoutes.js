const express = require('express');
const router = express.Router();



// import controllers
const { postAnswer } = require("../controllers/postAnswer");
const { getAnswers } = require("../controllers/getAnswers");




// Get all answers
router.get('/', getAnswers);

// Post a new answer
router.post('/', postAnswer);


module.exports = router;