/* global Primus:false */

Polymer('x-primus', {
  created: function() {
    this.url = this.url || 'ws://' + window.location.host + '/primus';
    this.connect = (this.connect !== undefined) ? this.connect : true;
  },
  attached: function() {
    this.primus = new Primus(this.url, {manual: true});
    this.primus.on('data', this._onMessage.bind(this));
    if (this.connect) {
      this._doConnect();
    }
  },
  _doConnect: function() {
    this.primus.open();
  },
  _onMessage: function(message) {
    this.fire('message', message);
  },
});
