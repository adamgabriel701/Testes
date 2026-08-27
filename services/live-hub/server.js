const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Configura o Socket.io para aceitar conexões do seu frontend (ex: porta 8000)
const io = new Server(server, {
  cors: {
    origin: "*", // Em produção, restrinja para o domínio do seu Nexus Gateway
    methods: ["GET", "POST"]
  }
});

// Mapeia quais clientes estão em quais "salas" (ex: sala 'guarana', sala 'readium')
io.on('connection', (socket) => {
  console.log('🟢 Frontend conectado:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} entrou na sala: ${room}`);
  });
});

// ========================================================
// WEBHOOKS PARA OS BACKENDS (PHP e Python)
// ========================================================

// Quando o Python (Readium-AI) terminar de raspar um artigo
app.post('/webhook/readium-ai', (req, res) => {
  const { title, folder } = req.body;
  console.log('📰 Webhook Recebido do Python: Novo artigo -', title);
  
  // Emite para todos os frontends conectados na sala 'readium'
  io.to('readium').emit('new_article', { title, folder });
  res.json({ status: 'Evento emitido para os leitores!' });
});

// Quando o PHP (CMS-Engine) criar/editar um evento
app.post('/webhook/cms-engine', (req, res) => {
  const { type, data } = req.body;
  console.log(`📅 Webhook Recebido do PHP: Novo evento - ${data.nome}`);
  
  // Emite para todos os frontends conectados na sala 'guarana'
  io.to('guarana').emit('content_update', { type, data });
  res.json({ status: 'Evento emitido para o app Guaraná!' });
});

const PORT = 8007;
server.listen(PORT, () => {
  console.log(`🚀 Live-Hub (WebSocket) rodando na porta ${PORT}`);
});