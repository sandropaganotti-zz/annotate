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


    Comment.method('location', function() {
      return ['', this.domain, this.reference, 'comments', this.id].join('/');
    });

    return Comment;

  })(new mongoose.Schema())
);
