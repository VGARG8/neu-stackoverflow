const Question = require("../models/questions");

exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).send("Question not found");
    }

    if (question.asked_by.toString() !== req.user._id.toString()) {
      return res.status(403).send("Unauthorized");
    }

    await question.remove();
    res.status(200).send("Question deleted successfully");
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).send(error);
  }
};
