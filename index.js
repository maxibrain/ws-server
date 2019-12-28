const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

wss.on('connection', function connection(ws) {
  console.log('connection', ws.url);
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
  ws.on('close', function onClose(code, reason) {
    console.log('close', { code, reason });
  })
});
