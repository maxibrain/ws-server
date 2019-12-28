const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

const clients = new Map();

wss.on('connection', function connection(ws, req) {
  const ip = req.connection.remoteAddress;
  const channel = (req.url || '').replace(/^\/+/, '');
  const channelClients = clients.get(channel) || new Set();
  channelClients.add(ws);
  clients.set(channel, channelClients);
  console.log(`${ip} connected at ${channel}`);
  ws.on('message', function incoming(data) {
    channelClients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
  ws.on('close', function onClose() {
    console.log(`${ip} disconnected`);
    channelClients.delete(ws);
  });
});
