# Chat Application

Ứng dụng chat đơn giản được xây dựng với NestJS (backend) và Vue.js (frontend).

## Tính năng

-   🔐 Đăng ký và đăng nhập người dùng
-   💬 Nhắn tin real-time với WebSocket
-   🎨 Giao diện hiện đại, responsive
-   💾 Lưu trữ tin nhắn trong database
-   🔒 Xác thực JWT

## Công nghệ sử dụng

### Backend (NestJS)

-   NestJS Framework
-   TypeScript
-   TypeORM + SQLite
-   JWT Authentication
-   WebSocket (Socket.io)
-   bcryptjs for password hashing

### Frontend (Vue.js)

-   Vue 3 + TypeScript
-   Vue Router
-   Pinia (State Management)
-   Socket.io Client
-   Axios for HTTP requests

## Cài đặt và chạy

### Yêu cầu

-   Node.js 18+
-   npm

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend sẽ chạy tại: http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## Cách sử dụng

1. Mở trình duyệt và truy cập http://localhost:5173
2. Đăng ký tài khoản mới hoặc đăng nhập
3. Bắt đầu chat với người dùng khác

## API Endpoints

-   `POST /auth/register` - Đăng ký
-   `POST /auth/login` - Đăng nhập
-   WebSocket events:
    -   `sendMessage` - Gửi tin nhắn
    -   `getMessages` - Lấy tất cả tin nhắn
    -   `newMessage` - Nhận tin nhắn mới

## Database Schema

### User

-   id (Primary Key)
-   username (Unique)
-   email (Unique)
-   password (Hashed)
-   createdAt

### Message

-   id (Primary Key)
-   content
-   senderId (Foreign Key to User)
-   createdAt

## Development

Dự án sử dụng TypeScript cho cả frontend và backend để đảm bảo type safety và developer experience tốt hơn.
