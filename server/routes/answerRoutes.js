const express = require('express');
const router = express.Router();


// import controllers
const { postAnswer } = require("../controllers/postAnswer");
const { getAnswers } = require("../controllers/getAnswers");
const { postUpvoteAnswer, postDownvoteAnswer } = require('../controllers/answerVote');
const { deleteAnswer } = require('../controllers/deleteAnswer');


// routing
const UPVOTE_ANSWER_ROUTE = '/:id/upvote';
const DOWNVOTE_ANSWER_ROUTE = '/:id/downvote';





// Get all answers
router.get('/', getAnswers);

// Post a new answer
router.post('/', postAnswer);


router.post(UPVOTE_ANSWER_ROUTE, postUpvoteAnswer);


router.post(DOWNVOTE_ANSWER_ROUTE, postDownvoteAnswer);



router.delete('/:id', deleteAnswer);


module.exports = router;