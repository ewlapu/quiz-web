# Quiz/Exam System Backend

Backend API cho hệ thống thi trắc nghiệm với Node.js + Express + MongoDB

## Cài đặt

```bash
npm install
```

## Cấu hình

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin MongoDB của bạn.

## Chạy ứng dụng

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Seed dữ liệu mẫu
```bash
npm run seed
```

## API Documentation

Swagger UI: http://localhost:2409/api/docs

## Demo Accounts

- **Admin**: admin@demo.com / Admin@123
- **Teacher**: teacher@demo.com / Teacher@123
- **User**: user@demo.com / User@123

## Công nghệ sử dụng

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt
- Zod Validation
- Swagger (OpenAPI 3.0)
- ExcelJS
