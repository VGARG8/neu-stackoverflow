const Answer = require("../models/answers");

exports.deleteAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).send("Answer not found");
    }

    if (answer.ans_by.toString() !== req.user._id.toString()) {
      return res.status(403).send("Unauthorized");
    }

    await answer.remove();
    res.status(200).send("Answer deleted successfully");
  } catch (error) {
    console.error("Error deleting answer:", error);
    res.status(500).send(error);
  }
};
