function WebSocketClient() {
  this.number = 0; // Message number
  this.autoReconnectInterval = 5 * 1000; // ms
}
WebSocketClient.prototype.open = function(url) {
  this.url = url;
  this.instance = new WebSocket(this.url);
  console.log('In WebSocket' + this.url);
  this.instance.addEventListener('open', () => {
    this.onopen();
  });
  this.instance.addEventListener('message', (data, flags) => {
    this.number++;
    this.onmessage(data, flags, this.number);
  });
  this.instance.addEventListener('close', e => {
    switch (e.code) {
      case 1000: // CLOSE_NORMAL
        console.log('WebSocket: closed');
        break;
      default:
        // Abnormal closure
        this.reconnect(e);
        break;
    }
    this.onclose(e);
  });
  this.instance.addEventListener('error', e => {
    switch (e.code) {
      case 'ECONNREFUSED':
        this.reconnect(e);
        break;
      default:
        this.onerror(e);
        break;
    }
  });
};
WebSocketClient.prototype.send = function(data) {
  try {
    this.instance.send(data);
  } catch (e) {
    //    this.instance.emit('error', e);
    console.log('emit error');
  }
};
WebSocketClient.prototype.reconnect = function(e) {
  console.log(`WebSocketClient: retry in ` + this.autoReconnectInterval, e);
  this.instance.removeEventListener('open', function() {});
  this.instance.removeEventListener('error', function() {});
  this.instance.removeEventListener('message', function() {});
  this.instance.removeEventListener('close', function() {});

  var that = this;
  setTimeout(function() {
    console.log('WebSocketClient: reconnecting...');
    that.open(that.url);
  }, this.autoReconnectInterval);
};
WebSocketClient.prototype.onopen = function(e) {
  console.log('WebSocketClient: open', arguments);
};
WebSocketClient.prototype.onmessage = function(data, flags, number) {
  console.log('WebSocketClient: message', arguments);
};
WebSocketClient.prototype.onerror = function(e) {
  console.log('WebSocketClient: error', arguments);
};
WebSocketClient.prototype.onclose = function(e) {
  console.log('WebSocketClient: closed', arguments);
};

export default WebSocketClient;
