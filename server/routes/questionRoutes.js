const express = require("express");
const router = express.Router();

// security middleware
const authenticateJWT = require("../middlewares/auth");

// import controllers
const { getQuestions } = require("../controllers/getQuestions");
const { postQuestion } = require("../controllers/postQuestion");
const { getSingleQuestion } = require("../controllers/getSingleQuestion");
const { postIncrementViews } = require("../controllers/postIncrementViews");
const {
  postUpvoteQuestion,
  postDownvoteQuestion,
} = require("../controllers/questionVote");
const { deleteQuestion } = require("../controllers/deleteQuestion");
const { postAcceptAnswer } = require("../controllers/acceptAnswer");

// routes
const UPVOTE_QUESTION_ROUTE = "/:id/upvote";
const DOWNVOTE_QUESTION_ROUTE = "/:id/downvote";
const INCREMENT_QUESTION_VIEW_ROUTE = "/:id/increment-views";
const QUESTION_BY_ID_ROUTE = "/:id";
const ACCEPTED_ANSWER_ROUTE = "/:id/accept-answer";

// Get questions
router.get("/", getQuestions);

// Post a new question
router.post("/", authenticateJWT, postQuestion);

// Get a single question by ID
router.get(QUESTION_BY_ID_ROUTE, getSingleQuestion);

// Increment the view count of a question
router.patch(INCREMENT_QUESTION_VIEW_ROUTE, postIncrementViews);

// select accepted answer
router.patch(ACCEPTED_ANSWER_ROUTE, authenticateJWT, postAcceptAnswer);

// Delete a question by ID
router.delete("/:id", authenticateJWT, deleteQuestion);

router.post(UPVOTE_QUESTION_ROUTE, authenticateJWT, postUpvoteQuestion);
router.post(DOWNVOTE_QUESTION_ROUTE, authenticateJWT, postDownvoteQuestion);

module.exports = router;
