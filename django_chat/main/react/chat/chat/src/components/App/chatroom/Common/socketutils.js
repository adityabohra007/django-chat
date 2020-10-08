export const socketUtils = {
  initiatlize: () => {
    console.log('Enter');
  },
  url: room_id => {
    let ws_or_wss = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    let websocket_url =
      ws_or_wss +
      window.location.host +
      '/ws/django_chatter/chatrooms/' +
      room_id +
      '/';
    return websocket_url;
  },

  chat_url: room_id => {
    let ws_or_wss = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    let websocket_url =
      ws_or_wss +
      window.location.host +
      '/ws/django_chatter/chatrooms/chat/' +
      room_id +
      '/';
    console.log(websocket_url);
    return websocket_url;
  },
  member_url: () => {
    let ws_or_wss = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    let websocket_url;
    websocket_url =
      ws_or_wss + window.location.host + '/ws/django_chatter/chatrooms/user/';
    console.log(websocket_url);
    return websocket_url;
  },
  alert_url: room_id => {
    let ws_or_wss = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    let websocket_url =
      ws_or_wss +
      window.location.host +
      '/ws/django_chatter/chatrooms/user' +
      room_id +
      '/';
    return websocket_url;
  },
};
