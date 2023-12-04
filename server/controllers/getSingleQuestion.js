const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");

exports.getSingleQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId)
      .populate({
        path: "answers",
        populate: { path: "ans_by", select: "username" },
      })
      .populate("tags")
      .populate("asked_by", "username reputation")
      .populate("accepted_answer")
      .select('title text tags asked_by views answers score accepted_answer createdAt updatedAt'); 

    if (!question) {
      return res.status(404).send("Question not found");
    }

    res.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).send(error);
  }
};
