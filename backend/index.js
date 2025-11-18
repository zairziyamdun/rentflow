const express = require('express');
const cors = require('cors');
const http = require('http');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const { config } = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const { initSocket } = require('./sockets/chatSocket');

const app = express();
const server = http.createServer(app);

// WebSocket-сервер
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initSocket(io);

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting для /api/auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/leases', require('./routes/leases'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/messages', require('./routes/messages'));

// Health-check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Тестовый корень
app.get('/', (req, res) => {
  res.send('RentFlow backend работает 🚀');
});

// Централизованный обработчик ошибок
app.use(errorHandler);

connectDB().then(() => {
  server.listen(config.port, () => {
    console.log(`✅ Сервер работает: http://localhost:${config.port}`);
  });
});
