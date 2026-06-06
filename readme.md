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

Seluruh daftar rute (_routes_) di bawah ini menggunakan awalan `/api`.

### 1. Autentikasi (`AuthController`)

| Method      | Endpoint       | Controller Action             |
| :---------- | :------------- | :---------------------------- |
| `POST`      | `api/register` | `Api\AuthController@register` |
| `POST`      | `api/login`    | `Api\AuthController@login`    |
| `POST`      | `api/logout`   | `Api\AuthController@logout`   |
| `GET\|HEAD` | `api/user`     | `Api\AuthController@user`     |

### 2. Manajemen Providers (`ProviderController`)

| Method      | Endpoint             | Controller Action                |
| :---------- | :------------------- | :------------------------------- |
| `GET\|HEAD` | `api/providers`      | `Api\ProviderController@index`   |
| `POST`      | `api/providers`      | `Api\ProviderController@store`   |
| `PUT`       | `api/providers/{id}` | `Api\ProviderController@update`  |
| `DELETE`    | `api/providers/{id}` | `Api\ProviderController@destroy` |

### 3. Manajemen Reports (`ReportController`)

| Method      | Endpoint                  | Controller Action                   |
| :---------- | :------------------------ | :---------------------------------- |
| `GET\|HEAD` | `api/reports`             | `Api\ReportController@index`        |
| `POST`      | `api/reports`             | `Api\ReportController@store`        |
| `GET\|HEAD` | `api/reports/{id}`        | `Api\ReportController@show`         |
| `PUT`       | `api/reports/{id}/status` | `Api\ReportController@updateStatus` |
| `DELETE`    | `api/reports/{id}`        | `Api\ReportController@destroy`      |
