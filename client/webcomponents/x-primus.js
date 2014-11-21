/* global Primus:false */

Polymer('x-primus', {
  created: function() {
    this.url = this.url || ('ws://' + window.location.host + '/primus');
    this.connect = (this.connect === undefined) ? true : false;
  },
  ready: function() {
    this.primus = new Primus();
    this.primus.on('data', this._onwsmessage.bind(this));
  },
  attributeChanged: function(name, old, current) {
    console.log(name, 'changed', old, current);
  },
  _onwsmessage: function(message) {
    this.fire('message', message);
  }
});
