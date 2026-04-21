# 🔧 TROUBLESHOOTING - Trang Trắng

## ✅ ĐÃ SỬA CÁC VẤN ĐỀ

### 1. **localStorage SSR Issue**
- ✅ Đã thêm check `typeof window !== 'undefined'` trước khi dùng localStorage
- ✅ Sửa trong `authSlice.js` và `uiSlice.js`
- ✅ Sửa trong `main.jsx`

### 2. **Error Boundary**
- ✅ Đã thêm ErrorBoundary component
- ✅ Wrap App trong ErrorBoundary để catch errors

### 3. **Theme Application**
- ✅ Thêm useEffect trong AppLayout để apply theme
- ✅ Apply theme trong main.jsx khi khởi động

---

## 🔍 CÁCH KIỂM TRA

### 1. **Mở Browser Console**
- Nhấn F12 hoặc Cmd+Option+I (Mac)
- Xem tab Console có lỗi gì không

### 2. **Kiểm tra Network Tab**
- Xem có file nào load failed không
- Kiểm tra API calls

### 3. **Kiểm tra React DevTools**
- Cài React DevTools extension
- Xem component tree có render không

---

## 🚀 CÁCH SỬA

### Nếu vẫn thấy trang trắng:

1. **Clear cache và reload:**
```bash
# Hard refresh
Cmd+Shift+R (Mac) hoặc Ctrl+Shift+R (Windows)
```

2. **Kiểm tra terminal:**
```bash
cd frontend
npm run dev
# Xem có lỗi gì không
```

3. **Kiểm tra dependencies:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

4. **Kiểm tra .env:**
```bash
# Đảm bảo có file .env với:
VITE_API_URL=http://localhost:2409/api
```

5. **Kiểm tra backend:**
```bash
# Backend phải chạy trên port 2409
curl http://localhost:2409/api/auth/me
```

---

## 📝 COMMON ERRORS

### Error: "Cannot read property of undefined"
- ✅ Đã fix: Thêm check `typeof window !== 'undefined'`

### Error: "localStorage is not defined"
- ✅ Đã fix: Wrap localStorage calls với window check

### Error: "Module not found"
- Chạy: `npm install` lại

### Error: "Port already in use"
- Chạy: `./stop.sh` hoặc kill process

---

## ✅ SAU KHI SỬA

Refresh lại browser (Cmd+Shift+R) và kiểm tra lại!

Nếu vẫn lỗi, mở Console (F12) và gửi error message cho tôi.
