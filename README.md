# 🎬 New Star Cineplex

Website resmi **New Star Cineplex** - jaringan bioskop terbesar di Indonesia dengan 38 cabang aktif dari Aceh hingga Papua.

![New Star Cineplex](https://img.shields.io/badge/New%20Star-Cineplex-gold?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🌐 Live Demo

- https://agusadhitama.github.io/new-star-cineplex/

---

## 📁 Struktur Project

```
new-star-cineplex/
├── index.html              # Homepage
├── css/
│   ├── global.css          # Design system, komponen global
│   ├── home.css            # Gaya khusus homepage
│   └── pages.css           # Gaya inner pages
├── js/
│   ├── data.js             # Data: film, bioskop, promo, dll.
│   ├── main.js             # Logic homepage
│   └── pages.js            # Logic semua inner pages
└── pages/
    ├── films.html          # Katalog film
    ├── cinemas.html        # Daftar bioskop
    ├── schedule.html       # Jadwal tayang
    ├── promo.html          # Promo & diskon
    ├── about.html          # Tentang kami
    └── booking.html        # Pemesanan tiket (dengan seat map)
```

---

## ✨ Fitur

| Halaman | Fitur |
|---------|-------|
| **Homepage** | Hero animasi, daftar film, statistik counter, info teknologi, promo banner, lokasi cabang |
| **Film** | Grid film, filter by genre, search real-time, Now Showing & Coming Soon |
| **Bioskop** | 38 cabang, filter by pulau, search, info fasilitas per bioskop |
| **Jadwal** | Pilih bioskop, pilih tanggal, slot jam tayang interaktif |
| **Promo** | Kartu promo lengkap, NSC Card showcase |
| **Tentang** | Sejarah, milestone timeline, tim pimpinan, form kontak |
| **Booking** | 4-step booking: film → kursi (seat map interaktif) → pembayaran → konfirmasi |

---

## 🎨 Desain

- **Font**: Bebas Neue (display) + DM Sans (body) + Playfair Display (aksen italic)
- **Warna**: Dark cinema aesthetic dengan aksen emas (`#C9A84C`)
- **Kursor**: Custom gold cursor dengan follower
- **Animasi**: Film strip background, scroll reveal, counter stats, ticker text
- **Responsif**: Dioptimalkan untuk mobile, tablet, dan desktop

---

## 🛠️ Pengembangan Lebih Lanjut

Untuk menambahkan data atau mengubah konten, edit file `js/data.js`.

Untuk menambah film baru:
```javascript
// Di NSC_DATA.nowShowing, tambahkan:
{
  id: 6,
  title: "Judul Film Baru",
  year: 2025,
  genre: ["Drama", "Romansa"],
  duration: 110,
  rating: 8.0,
  ageRating: "13+",
  badge: "BARU",
  emoji: "🎭",
  color: "#1a0a1a",
  director: "Nama Sutradara",
  cast: "Pemain 1, Pemain 2",
  synopsis: "Sinopsis film...",
}
```

---

## 📄 Lisensi

© 2026 New Star Cineplex | Agus Satria Adhitama | Dibuat untuk keperluan portofolio/demo.
