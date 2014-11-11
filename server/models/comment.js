var mongoose = require('mongoose');

module.exports = mongoose.model(
  'Comment',
  (function(Comment) {

    Comment.add({
      domain: {type: String, required: true},
      reference: {type: String, required: true},
      email: {type: String, required: true},
      text: {type: String, required: true},
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
