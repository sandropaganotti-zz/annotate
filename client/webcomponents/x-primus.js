/* global Primus:false */

Polymer('x-primus', {
  ready: function() {
    var host = window.location.host;
    var protocol = window.location.protocol;
    if(this.baseapi){
      var host = this.$.parser.hostname;
      var protocol = this.$.parser.protocol;
    }
    this.url = this._defaultURL(protocol, host);
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
  _defaultURL: function(protocol, host) {
    return [
      (protocol === 'http:') ? 'ws:/' : 'wss:/', host ,'primus'
    ].join('/');
  }
});
