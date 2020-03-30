// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const PORT = process.env.PORT || 3000;

const dev = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

const server = app.prepare().then(() => createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
})).then((s) => s.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${PORT}`);
}));;

const arr = [
  'Если',
  'Вы видите',
  'на фоне',
  'видео',
  'и',
  'это сообщение',
  'то',
  'все работает!',
];

function* messageGenerator() {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
}

const io = require('socket.io')({
  serveClient: false,
});

io.on('connect', (socket) => {
  socket.on('ready', () => {
    const t = messageGenerator();
    const i = setInterval(() => {
      const m = t.next().value;
      if (!m) {
        return clearInterval(i);
      }
      socket.send(m);
    }, 1000);
  });
});

server
  .then((s) => {
    return io.attach(s, {
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
    });
  })
