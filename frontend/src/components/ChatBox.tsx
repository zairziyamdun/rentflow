
'use client';

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import api from '@/lib/axios';

const socket = io('http://localhost:5000'); // ⚠️ Заменить при проде

interface Message {
  _id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

interface ChatBoxProps {
  leaseId: string;
  userId: string;
  userName: string;
}

export default function ChatBox({ leaseId, userId, userName }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit('join_room', {
      roomId: leaseId,
      userId,
      name: userName,
    });

    const loadMessages = async () => {
      try {
        const res = await api.get(`/messages/${leaseId}`);
        setMessages(res.data);
      } catch {
        console.error('Ошибка при загрузке сообщений');
      }
    };
    loadMessages();

    socket.on('receive_message', (newMsg: Message) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [leaseId, userId, userName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    socket.emit('send_message', {
      roomId: leaseId,
      senderId: userId,
      senderName: userName,
      message,
    });

    setMessages((prev) => [
      ...prev,
      {
        _id: Math.random().toString(),
        roomId: leaseId,
        senderId: userId,
        senderName: userName,
        content: message,
        createdAt: new Date().toISOString(),
      },
    ]);

    setMessage('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 border rounded shadow max-w-xl mx-auto">
      <div className="text-lg font-semibold mb-2">Чат</div>

      <div className="h-64 overflow-y-auto space-y-3 mb-4 border p-2 rounded bg-gray-50 dark:bg-gray-700">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex flex-col ${msg.senderId === userId ? 'items-end' : 'items-start'}`}
          >
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {msg.senderName}
            </span>
            <div
              className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${
                msg.senderId === userId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex gap-2">
        <textarea
          className="flex-grow p-2 border rounded resize-none"
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
