# UTS Pemrograman Web Framework

### Identitas Pengembang

- **Nama:** Najib Abiyyu Rasyid
- **Program Studi:** Teknik Informatika
- **Semester:** 6

---

### Deskripsi Aplikasi

Website untuk monitoring kabel pada Kota Madiun. Sesuai dengan program pemerintah Kota Madiun untuk menciptakan Kota yang bersih dari kabel udara source: https://www.instagram.com/p/DUAl7y3ErSl/?utm_source=ig_web_button_share_sheet

### Fitur Utama

- [x] Autentikasi User
- [x] Manajemen Data Provider
- [x] Manajemen Laporan (Report) beserta Status Laporan
- [x] Pelaporan Lapangan (User)

### Screenshot Aplikasi

![Halaman Login](frontend/public/dokumentasi/menu%20login.png)
![Dashboard Admin](frontend/public/dokumentasi/dashboard%20admin.png)
![Halaman Laporan](frontend/public/dokumentasi/menu%20laporan.png)
![Halaman Provider](frontend/public/dokumentasi/menu%20provider.png)
![Dashboard User](frontend/public/dokumentasi/menu%20user.png)
![Halaman Laporan User](frontend/public/dokumentasi/menu%20laporan%20user.png)

---

### Kebutuhan Sistem

- PHP >= 8.3
- Composer >= 2.x
- Node.js >= 20.x
- MySQL >= 8.0

---

### Cara Instalasi

1. Jalankan `composer install` & `npm install` untuk sisi backend
2. Jalankan `npm install` untuk sisi frontend
3. Salin file `.env.example` menjadi `.env` konfigurasi koneksi database.
4. Jalankan `php artisan migrate` untuk struktur tabel database.
5. Jalankan `php artisan serve` untuk menyalakan server lokal untuk backend.
6. Jalankan `npm run dev` untuk frontend

---

## 🔌 Dokumentasi API (Backend)

Seluruh daftar rute (_routes_)

### 1. Autentikasi (`AuthController`)

| Method               | Endpoint                | Controller Action                      |
| :------------------- | :---------------------- | :------------------------------------- |
| `POST`[cite: 1]      | `api/register`[cite: 1] | `Api\AuthController@register`[cite: 1] |
| `POST`[cite: 1]      | `api/login`[cite: 1]    | `Api\AuthController@login`[cite: 1]    |
| `POST`[cite: 1]      | `api/logout`[cite: 1]   | `Api\AuthController@logout`[cite: 1]   |
| `GET\|HEAD`[cite: 1] | `api/user`[cite: 1]     | `Api\AuthController@user`[cite: 1]     |

### 2. Manajemen Providers (`ProviderController`)

| Method               | Endpoint                      | Controller Action                         |
| :------------------- | :---------------------------- | :---------------------------------------- |
| `GET\|HEAD`[cite: 1] | `api/providers`[cite: 1]      | `Api\ProviderController@index`[cite: 1]   |
| `POST`[cite: 1]      | `api/providers`[cite: 1]      | `Api\ProviderController@store`[cite: 1]   |
| `PUT`[cite: 1]       | `api/providers/{id}`[cite: 1] | `Api\ProviderController@update`[cite: 1]  |
| `DELETE`[cite: 1]    | `api/providers/{id}`[cite: 1] | `Api\ProviderController@destroy`[cite: 1] |

### 3. Manajemen Reports (`ReportController`)

| Method               | Endpoint                           | Controller Action                            |
| :------------------- | :--------------------------------- | :------------------------------------------- |
| `GET\|HEAD`[cite: 1] | `api/reports`[cite: 1]             | `Api\ReportController@index`[cite: 1]        |
| `POST`[cite: 1]      | `api/reports`[cite: 1]             | `Api\ReportController@store`[cite: 1]        |
| `GET\|HEAD`[cite: 1] | `api/reports/{id}`[cite: 1]        | `Api\ReportController@show`[cite: 1]         |
| `PUT`[cite: 1]       | `api/reports/{id}/status`[cite: 1] | `Api\ReportController@updateStatus`[cite: 1] |
| `DELETE`[cite: 1]    | `api/reports/{id}`[cite: 1]        | `Api\ReportController@destroy`[cite: 1]      |
