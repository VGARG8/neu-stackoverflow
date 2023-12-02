
// init express router
const express = require('express');
const router = express.Router();


// import controller 
const { getTags } = require("../controllers/getTags");

// hardcode route
const TAGS_ROUTE = '/tags'


// Get tags
router.get('/', getTags);





module.exports = router;