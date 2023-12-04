const Answer = require("../models/answers");

exports.postUpvoteAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    const answer = await Answer.findById(answerId);
    
    if (!answer) return res.status(404).send("Answer not found");

    answer.score += 1; // Increment score by one for an upvote
    await answer.save();

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error upvoting answer:", error);
    res.status(500).send(error);
  }
};

exports.postDownvoteAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    const answer = await Answer.findById(answerId);
    
    if (!answer) return res.status(404).send("Answer not found");

    answer.score -= 1; // Decrement score by one for a downvote
    await answer.save();

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error downvoting answer:", error);
    res.status(500).send(error);
  }
};