Polymer('nn-annotable', {
  created: function(){
    this.domain = window.location.hostname
  },

  attached: function(){
    if(!this.nid){
      throw 'Attribute missing: nid';
    }
    this.$.get_comments.go();
  },

  populateComments: function(evt){
    this.comments = evt.detail.response;
  }
});
