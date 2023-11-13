const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import your model schemas
const Question = require('./models/questions');
const Answer = require('./models/answers');
const Tag = require('./models/tags');

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/fake_so', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// API Routes

// Get questions
app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find({}).populate('answers').populate('tags');
        res.json(questions);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Post a new question
app.post('/questions', async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Post a new answer
app.post('/answers', async (req, res) => {
    try {
        const { answer, questionId } = req.body;
        const newAnswer = new Answer(answer);
        await newAnswer.save();

        await Question.findByIdAndUpdate(questionId, { $push: { answers: newAnswer._id } });

        res.status(201).json(newAnswer);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get tags
app.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.find({});
        res.json(tags);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Server listening
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
