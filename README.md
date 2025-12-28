# 🌤️ Aplikasi Ramalan Cuaca Modern (Sidrap Edition)

Aplikasi cuaca canggih yang dirancang khusus untuk **akurasi tinggi di wilayah Indonesia**, dengan optimasi khusus untuk Kabupaten **Sidenreng Rappang (Sidrap)**.

![Mobile Preview](https://via.placeholder.com/800x400.png?text=Preview+Aplikasi+Cuaca+Sidrap)

## ✨ Fitur Unggulan

### 1. 🎯 Akurasi Lokasi Super (High Accuracy GPS)
- Menggunakan mode **GPS Satelit** (bukan hanya internet) untuk mendeteksi lokasi pengguna.
- Dilengkapi fitur **"Reverse Geocoding"**: Otomatis mengoreksi nama lokasi dari server (misal: "Makassar") kembali ke nama desa/kecamatan asli tempat Anda berada (misal: "Watang Pulu").

### 2. 🗺️ Spesial Sidenreng Rappang (Sidrap)
- **11 Kecamatan Terdaftar**: Jaminan 100% deteksi untuk Baranti, Duapitue, Kulo, Maritengngae, Panca Lautang, Panca Rijang, Pitu Riase, Pitu Riawa, Tellu Limpoe, Watang Pulu, dan Watang Sidenreng.
- **Full Coverage Watang Pulu**: Data koordinat lengkap untuk seluruh desa/kelurahan (Arawa, Batu Lappa, Buae, Bangkai, Lawawoi, Uluale, Carawali, Ciro-Ciroe, Lainungan, Mattirotasi).
- **Koreksi Ejaan**: Otomatis memperbaiki "Wattangpulu" menjadi "Watang Pulu", dll.

### 3. 🇮🇩 Dukungan Seluruh Indonesia
- Mendukung pencarian **"Gampong"** (Aceh), **"Desa"**, **"Kelurahan"**, **"Kecamatan"**, hingga **"Kabupaten"**.
- Paham nama internasional (misal: mencari "Aceh Barat" akan otomatis diproses sebagai "West Aceh" oleh sistem agar data tetap muncul).

### 4. � Tampilan Mobile Premium
- **Responsif 100%**: Layout menyesuaikan lebar layar HP apapun.
- **Glassmorphism UI**: Tampilan transparan yang estetis dan modern.
- **Snap Scroll**: Geser ramalan cuaca 5 hari ke depan dengan mulus.
- **Touch Friendly**: Tombol didesain besar agar mudah ditekan jari.

### 5. 🌙 Fitur Standar
- Data Cuaca Real-time (Suhu, Angin, Kelembapan).
- Mode Gelap & Terang (Dark/Light Mode).
- Bahasa Indonesia sepenuhnya.

---

## 🛠️ Teknologi
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+).
- **API**: OpenWeatherMap (Geocoding API + Weather API).
- **Algorithm**: Multi-layer Search Strategy (Local Dictionary -> API Direct -> Fallback Search).

## 📂 Struktur Folder
```
weather-app/
├── assets/
│   ├── css/
│   │   └── style.css  # Styling Mobile & Desktop
│   ├── js/
│   │   ├── app.js     # Logika Utama (GPS, API, UI)
│   │   └── cities.js  # Autocomplete Kota Indonesia
├── index.html         # Halaman Utama
└── README.md          # Dokumentasi Ini
```

## 🚀 Cara Penggunaan
1. Buka `index.html`.
2. Izinkan akses **Lokasi (GPS)** saat diminta browser untuk akurasi terbaik.
3. Ketik nama desa/kecamatan di kolom pencarian, atau tekan tombol **Lokasi**.

---
*Dikembangkan dengan ❤️ untuk kemudahan akses informasi cuaca di Sidrap dan sekitarnya.*
