const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");


exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate("answers")
      .populate("tags");
    res.json(questions);
  } catch (error) {
    res.status(500).send(error);
  }
}; 

