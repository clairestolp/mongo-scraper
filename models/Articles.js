const mongoose = require("mongoose");

//schema constructor
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    default: "Title not available"
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: 'Click the link to learn more'
  },
  source: {
    type: String,
    required: "source was not entred",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comments'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//use mongoose to create model from the above schema
let Articles = mongoose.model('Articles', ArticleSchema);

module.exports = Articles;