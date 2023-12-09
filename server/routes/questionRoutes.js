const express = require('express');
const router = express.Router();

// import controllers
const { getQuestions } = require("../controllers/getQuestions");
const { postQuestion } = require("../controllers/postQuestion");
const { getSingleQuestion } = require("../controllers/getSingleQuestion");
const { postIncrementViews } = require('../controllers/postIncrementViews');
const { postUpvoteQuestion, postDownvoteQuestion } = require('../controllers/questionVote');
const { deleteQuestion } = require('../controllers/deleteQuestion');


// routes
const UPVOTE_QUESTION_ROUTE = '/:id/upvote';
const DOWNVOTE_QUESTION_ROUTE = '/:id/downvote';
const INCREMENT_QUESTION_VIEW_ROUTE = '/:id/increment-views'
const QUESTION_BY_ID_ROUTE = '/:id'
const DELETE_QUESTION_ROUTE = '/:id';

// Delete a question by ID
router.delete(DELETE_QUESTION_ROUTE, deleteQuestion);


// Get questions
router.get('/', getQuestions);

// Post a new question
router.post('/', postQuestion);


// Get a single question by ID
router.get(QUESTION_BY_ID_ROUTE, getSingleQuestion);



// Increment the view count of a question
router.patch(INCREMENT_QUESTION_VIEW_ROUTE, postIncrementViews);





router.post(UPVOTE_QUESTION_ROUTE, postUpvoteQuestion);
router.post(DOWNVOTE_QUESTION_ROUTE, postDownvoteQuestion);





module.exports = router;