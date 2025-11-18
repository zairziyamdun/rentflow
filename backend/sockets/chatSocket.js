const { verifyAccessToken } = require('../config/jwt');
const Lease = require('../models/Lease');
const Property = require('../models/Property');
const Message = require('../models/Message');

function initSocket(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers['authorization']?.split(' ')[1];
      if (!token) {
        return next(new Error('Нет токена'));
      }
      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Неверный или просроченный токен'));
    }
  });

  io.on('connection', (socket) => {
    console.log('🟢 Пользователь подключился:', socket.id, socket.user?.userId);

    socket.on('join_room', async ({ roomId }) => {
      try {
        const lease = await Lease.findById(roomId).populate('propertyId', 'ownerId');
        if (!lease) return;

        const isTenant = lease.tenantId.toString() === socket.user.userId;
        const isLandlord = lease.propertyId && lease.propertyId.ownerId.toString() === socket.user.userId;

        if (!isTenant && !isLandlord && socket.user.role !== 'admin') {
          return;
        }

        socket.join(roomId);
        console.log(`📥 ${socket.user.name} вошёл в комнату ${roomId}`);
      } catch (err) {
        console.error('Ошибка join_room:', err);
      }
    });

    socket.on('send_message', async ({ roomId, message }) => {
      try {
        // проверяем, что пользователь действительно участник
        const lease = await Lease.findById(roomId).populate('propertyId', 'ownerId');
        if (!lease) return;

        const isTenant = lease.tenantId.toString() === socket.user.userId;
        const isLandlord = lease.propertyId && lease.propertyId.ownerId.toString() === socket.user.userId;

        if (!isTenant && !isLandlord && socket.user.role !== 'admin') {
          return;
        }

        const newMessage = new Message({
          roomId,
          senderId: socket.user.userId,
          senderName: socket.user.name,
          content: message,
        });
        await newMessage.save();

        console.log(`📤 ${socket.user.name} отправил сообщение в ${roomId}: ${message}`);

        io.to(roomId).emit('receive_message', {
          _id: newMessage._id,
          roomId,
          senderId: socket.user.userId,
          senderName: socket.user.name,
          content: newMessage.content,
          createdAt: newMessage.createdAt,
        });
      } catch (err) {
        console.error('Ошибка send_message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 Пользователь отключился:', socket.id);
    });
  });
}

module.exports = { initSocket };


