const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentsSchema = new Schema ({
  userName: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  articleId: {
    type: Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

let Comments = mongoose.model('Comments', commentsSchema);

module.exports = Comments;