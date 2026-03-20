import { WebSocket } from 'ws';

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => console.log('open'));
ws.on('message', (msg) => {
  console.log('msg', msg.toString().slice(0, 200));
  process.exit(0);
});
ws.on('error', (err) => {
  console.error('err', err);
  process.exit(1);
});

setTimeout(() => {
  console.log('timeout');
  process.exit(0);
}, 8000);
