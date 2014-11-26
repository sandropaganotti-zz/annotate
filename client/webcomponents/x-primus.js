/* global Primus:false */

Polymer('x-primus', {
  ready: function() {
    this.url = this.url || this._defaultURL();
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
  _defaultURL: function() {
    return [
      (window.location.protocol === 'http:') ? 'ws:/' : 'wss:/',
      window.location.host,
      'primus'
    ].join('/');
  }
});
