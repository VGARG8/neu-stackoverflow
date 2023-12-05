const Question = require("../models/questions");

exports.postUpvoteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);
    
    if (!question) return res.status(404).send("Question not found");

    question.score += 1; // Increment score by one for an upvote
    await question.save();

    res.status(200).json(question);
  } catch (error) {
    console.error("Error upvoting question:", error);
    res.status(500).send(error);
  }
};

exports.postDownvoteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);
    
    if (!question) return res.status(404).send("Question not found");

    question.score -= 1; // Decrement score by one for a downvote
    await question.save();

    res.status(200).json(question);
  } catch (error) {
    console.error("Error downvoting question:", error);
    res.status(500).send(error);
  }
};