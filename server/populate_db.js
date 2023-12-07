// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');

// Your existing Mongoose models
const User = require('./models/users');
const Tag = require('./models/tags');
const Question = require('./models/questions');
const Answer = require('./models/answers');

mongoose.connect('mongodb://127.0.0.1:27017/fake_so', { useNewUrlParser: true, useUnifiedTopology: true });

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


async function createUsers(num) {
  const users = [];
  for (let i = 0; i < num; i++) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const createdAt = randomDate(new Date(2020, 0, 1), new Date());

    users.push(new User({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: hashedPassword,
      dateCreated: createdAt, 
    }));
  }
  return User.insertMany(users);
}


async function createTags(num) {
  const tags = [];
  for (let i = 0; i < num; i++) {
    tags.push(new Tag({
      name: faker.lorem.word(),
    }));
  }
  return Tag.insertMany(tags);
}

async function createQuestions(users, tags, num) {
  const questions = [];
  for (let i = 0; i < num; i++) {
    const createdAt = randomDate(new Date(2020, 0, 1), new Date());

    questions.push(new Question({
      title: faker.lorem.sentence(),
      text: faker.lorem.paragraph(),
      tags: faker.random.arrayElements(tags, 2).map(tag => tag._id),
      asked_by: faker.random.arrayElement(users)._id,
      views: faker.datatype.number(100),
      score: faker.datatype.number(100),
      createdAt, 
      updatedAt: createdAt, 
    }));
  }
  return Question.insertMany(questions);
}


async function createAnswers(users, questions, num) {
  const answers = [];
  for (let i = 0; i < num; i++) {
    const createdAt = randomDate(new Date(2020, 0, 1), new Date());

    // Create an answer
    const answer = new Answer({
      text: faker.lorem.paragraph(),
      ans_by: faker.random.arrayElement(users)._id,
      score: faker.datatype.number(100),
      createdAt, // Set the random creation date
      updatedAt: createdAt, // Set updatedAt to the same as createdAt
    });

    // Add the answer to the answers array
    answers.push(answer);

    // Associate the answer with the question
    const question = faker.random.arrayElement(questions);
    question.answers.push(answer._id);

    // Randomly decide whether to accept this answer
    if (Math.random() < 0.3 && !question.accepted_answer) {
      question.accepted_answer = answer._id;
    }

    // Save the question
    await question.save();
  }

  // Insert all answers at once
  return Answer.insertMany(answers);
}



async function main() {
  try {
    await mongoose.connection.dropDatabase();

    const users = await createUsers(10);
    const tags = await createTags(5);
    const questions = await createQuestions(users, tags, 20);
    const answers = await createAnswers(users, questions, 50);

    console.log('Database populated!');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

main();
