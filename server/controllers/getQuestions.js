const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");
const Comment = require("../models/comments");

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
      .populate({
        path: 'comments', 
        populate: { path: 'commented_by', select: 'username' }
      })
      .select('title text tags asked_by views score createdAt updatedAt'); 

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error); // Added this line
    res.status(500).send(error);
  }
};
