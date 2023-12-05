const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate({
        path: 'answers',
        populate: { path: 'ans_by', select: 'username' }
      })
      .populate('tags')
      .populate({ 
        path: 'asked_by', 
        select: 'username reputation' 
      })
      .select('title text tags asked_by views score createdAt updatedAt'); 

    res.json(questions);
  } catch (error) {
    res.status(500).send(error);
  }
};
