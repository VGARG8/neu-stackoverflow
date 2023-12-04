const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  asked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  views: { type: Number, default: 0 },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  score: { type: Number, default: 0 },
  accepted_answer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
}, { timestamps: true }); // Enable automatic timestamps

module.exports = mongoose.model("Question", questionSchema);

