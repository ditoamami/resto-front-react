# 🧾 Restaurant Sismedika POS — Frontend

Frontend aplikasi **Point of Sales (POS)** berbasis **React + Material UI (MUI)** yang terintegrasi dengan Laravel API untuk mengelola pesanan, meja, menu, dan pembayaran restoran.

---

## 🚀 Tech Stack

- ⚛️ **React 18+**
- 🧭 **React Router DOM v6+**
- 💅 **Material UI (MUI v5)**
- 🔐 **Axios (Private API Client)**

---

## 📦 Fitur Utama

✅ Login dan autentikasi berbasis role (`pelayan`, `kasir`)  
✅ Dashboard meja restoran dengan status warna dinamis  
✅ Manajemen menu (create, update, delete)  
✅ Manajemen pesanan (buka, tambah item, tutup order)  
✅ Dialog pembayaran dan generate struk PDF  
✅ Role-based access control di sidebar dan tombol  
✅ Responsive UI dengan MUI  

---

## 🧰 Instalasi

### 1️⃣ Clone Repository
```bash
git clone https://github.com/username/restaurant-pos-frontend.git
cd restaurant-pos-frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Konfigurasi Environment
Buat file `.env` di root project, lalu isi dengan konfigurasi API backend Laravel:
```bash
REACT_APP_API_URL=http://127.0.0.1:8000/api
REACT_APP_API_TIMEOUT=5000
```

Jika menggunakan **axiosPrivate.js**, pastikan baseURL diarahkan ke environment ini:
```js
const axiosPrivate = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL,
  withCredentials: true,
});
```

---

## ▶️ Menjalankan Aplikasi

```bash
npm run dev
```

Lalu buka di browser:
```
http://localhost:5173
```

---

## 👤 Role & Login Default

Gunakan akun default yang disediakan oleh API:

| Role     | Email             | Password |
|-----------|------------------|-----------|
| Pelayan  | pelayan1@example.com | pelayan1 |
| Pelayan  | pelayan2@example.com | pelayan2 |
| Kasir    | kasir1@example.com   | kasir1   |
| Kasir    | kasir2@example.com   | kasir2   |

---

## 🧠 Tips Penggunaan

- Pastikan **Laravel API** sudah dijalankan di port yang sama seperti pada `VITE_API_URL`.  
- Jalankan **npm run build** untuk production.  
- Gunakan role `kasir` untuk mengakses tombol **Generate Receipt**.  
- Role `pelayan` hanya bisa membuka dialog order dan mengelola menu.  

---

## 🛠️ Build untuk Production

```bash
npm run build
```

Hasil build akan berada di folder `/dist`.

---

## 💬 Lisensi
Proyek ini dikembangkan untuk keperluan internal Restaurant Sismedika.  
Dibuat dengan ❤️ menggunakan React dan Laravel.
