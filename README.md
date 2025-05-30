# 🏠 RentFlow — Платформа для управления арендой недвижимости

RentFlow — это современное fullstack-приложение для арендаторов и владельцев недвижимости.

Позволяет:
- 📌 Добавлять объекты недвижимости
- 📬 Отправлять заявки на аренду
- 📄 Заключать и контролировать аренду
- 💰 Платить за аренду
- 📢 Оставлять жалобы
- 💬 Общаться через встроенный чат

---

## ⚙️ Технологии

| Слой       | Технологии                                     |
|------------|------------------------------------------------|
| Frontend   | Next.js 15, Tailwind CSS, TypeScript           |
| Backend    | Node.js + Express + MongoDB                    |
| Auth       | JWT Token, роли: user, landlord, admin         |
| Realtime   | Socket.IO для чата                             |
| Upload     | UploadThing для загрузки изображений           |
| Deployment | Docker + docker-compose                        |

---

## 🧑‍💻 Авторизация

- По умолчанию создаётся админ:
  ```
  Email: admin@rentflow.com
  Пароль: admin123
  ```

- Смена ролей доступна только через админку

---

## 🐳 Быстрый запуск через Docker

```bash
git clone https://github.com/zairziyamdun/rentflow.git
cd rentflow
docker-compose up --build
```

---

## 🛠️ Локальный запуск (без Docker)

### Backend:

```bash
cd backend
npm install
npm run dev
```

.env:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rentflow
JWT_SECRET=secret
```

### Frontend:

```bash
cd frontend
npm install
npm run dev
```

---
## 👨‍💻 Автор

**Zair Ziyamdun**  
GitHub: [@zairziyamdun](https://github.com/zairziyamdun)
