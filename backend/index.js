const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// WebSocket-сервер
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// WebSocket логика
io.on('connection', (socket) => {
  console.log('🟢 Пользователь подключился:', socket.id);

  socket.on('join_room', ({ roomId, userId, name }) => {
    socket.join(roomId);
    socket.data.userId = userId;
    socket.data.name = name;
    console.log(`📥 ${name} вошёл в комнату ${roomId}`);
  });

  socket.on('send_message', async ({ roomId, message, senderId, senderName }) => {
    // 1. Сохраняем в базу
    const newMessage = new Message({
      roomId,
      senderId,
      senderName,
      content: message,
    });
    await newMessage.save();

    console.log(`📤 ${senderName} отправил сообщение в ${roomId}: ${message}`);

    // 2. Отправляем другим пользователям
    socket.to(roomId).emit('receive_message', {
      _id: newMessage._id,
      roomId,
      senderId,
      senderName,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
    });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Пользователь отключился:', socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/leases', require('./routes/leases'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/messages', require('./routes/messages'));

// Тест
app.get('/', (req, res) => {
  res.send('RentFlow backend работает 🚀');
});

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Подключено к MongoDB');
    server.listen(PORT, () => console.log(`✅ Сервер работает: http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Ошибка подключения к MongoDB:', err.message);
  });
