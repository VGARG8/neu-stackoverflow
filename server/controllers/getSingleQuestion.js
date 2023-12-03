const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");

exports.getSingleQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId)
      .populate({
        path: "answers",
        populate: { path: "ans_by", select: "username" }, // Populate user details in answers
      })
      .populate("tags")
      .populate("asked_by", "username"); // Simplified population

    if (!question) {
      return res.status(404).send("Question not found");
    }

    // Debugging: Stringify the output to inspect the populated data
    console.log(
      "This is the question from the getSingleQuestion controller on the server: ",
      JSON.stringify(question, null, 2)
    );

    res.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).send(error);
  }
};
