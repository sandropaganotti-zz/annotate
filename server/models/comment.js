var mongoose = require('mongoose');

module.exports = mongoose.model(
  'Comment',
  (function(Comment) {

    Comment.add({
      domain: String,
      reference: String,
      email: String,
      text: String,
    });

    Comment.set('toJSON', {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret._id;
        delete ret.__v;
      }
    });

    return Comment;

  })(new mongoose.Schema())
);
