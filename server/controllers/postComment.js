const Question = require("../models/questions");
const Answer = require("../models/answers");
const Comment = require("../models/comments");
const mongoose = require('mongoose')

exports.postComment = async (req, res) => {
  try {
    const { text, userId, parentId, parentType } = req.body; // Extract required fields

    console.log('Request body:', req.body); // Log the request body

    // Ensure userId is correctly cast to an ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Create new comment
    const newComment = new Comment({
      text,
      commented_by: userId, // comment_by should be a valid ObjectId
      parent: {
        id: parentId,
        type: parentType
      }
    });

    console.log('New comment:', newComment); // Log the new comment

    await newComment.save();

    // Associate the comment with the parent (either a question or an answer)
    if (parentType === 'Question') {
      await Question.findByIdAndUpdate(parentId, {
        $push: { comments: newComment._id },
      });
    } else if (parentType === 'Answer') {
      await Answer.findByIdAndUpdate(parentId, {
        $push: { comments: newComment._id },
      });
    } else {
      return res.status(400).json({ message: 'Invalid parent type' });
    }

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error posting new comment:", error);
    res.status(500).send(error);
  }
};