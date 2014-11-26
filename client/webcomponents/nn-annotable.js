/* jshint camelcase:false */

Polymer('nn-annotable', {
  ready: function(){
    this.baseapi = this.baseapi || window.location.origin;
    this.tokens = this.baseapi.split('://');
    this.wsurl = this.tokens.shift() === 'https' ? 'wss' : 'ws' + '://' + this.tokens.shift();
    this.domain = window.location.hostname;
    this.connect = (this.connect !== undefined) ? this.connect : true;
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
    this.author = this.text = '';
  }
});
