const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type, Authorization, Content-Length, X-Requested-With",
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/fake_so", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Import routes
const answerRoutes = require("./routes/answerRoutes");
const questionRoutes = require("./routes/questionRoutes");
const tagsRoutes = require("./routes/tagsRoutes");
const userRoutes = require("./routes/userRoutes");

// Define routes
app.use('/answers', answerRoutes);
app.use('/questions', questionRoutes);
app.use('/tags', tagsRoutes);
app.use('/users', userRoutes);

// Set more explicit CORS headers for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
