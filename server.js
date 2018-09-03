//server
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

const app = express();

//configure middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true} ));
app.use(express.static("public"));


//routes
require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app); 

//if mongo is deployed, use the deployed database
//else use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";


//set mongoose to use built in JavaScript ES6 Promises
//connect to MongoDB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!!");
});

