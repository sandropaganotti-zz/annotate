/* jshint camelcase:false */

Polymer('nn-annotable', {
  created: function(){
    this.baseapi = this.baseapi || window.location.origin;
    this.domain = window.location.hostname;
    this.comments = [];
  },

  attached: function(){
    if(!this.nid){
      throw 'Attribute missing: nid';
    }
    this.$.websocket.addEventListener('message', this.updateComments.bind(this));
    this.$.get_comments.go();
  },

  populateComments: function(evt){
    this.comments = evt.detail.response;
  },

  updateComments: function(evt){
    this.comments.push(evt.detail);
  },

  newComment: function(evt){
    this.message = '';
    evt.preventDefault();
    if(!this.author || !this.text){
      this.message = 'completa tutti i campi';
      return;
    }
    this.$.new_comment.go();
  },

  resetForm: function(){
    this.$.new_comment_form.reset();
  }
});
