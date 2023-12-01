const express = require('express');
const router = express.Router();

// import controllers
const { getQuestions } = require("../controllers/getQuestions");
const { postQuestion } = require("../controllers/postQuestion");
const { getSingleQuestion } = require("../controllers/getSingleQuestion");
const { postIncrementViews } = require('../controllers/postIncrementViews');


// routes
const INCREMENT_QUESTION_VIEW_ROUTE = '/:id/increment-views'
const QUESTION_BY_ID_ROUTE = '/:id'



// Get questions
router.get('/', getQuestions);

// Post a new question
router.post('/', postQuestion);


// Get a single question by ID
router.get(QUESTION_BY_ID_ROUTE, getSingleQuestion);



// Increment the view count of a question
router.patch(INCREMENT_QUESTION_VIEW_ROUTE, postIncrementViews);





module.exports = router;