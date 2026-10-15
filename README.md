# Hastane Randevu Yönetim Sistemi (Hospital Appointment Management System)

Kurumsal mimariye uygun, N-Tier katmanlı, JWT tabanlı kimlik doğrulama, JPA Optimistic Locking ile çakışmasız randevu (Double-Booking Prevention) ve dinamik saat slot seçicisine sahip tam yığın (Full-Stack) web uygulaması.

---

## 🛠️ Teknoloji Yığını

### Backend
- **Dil & Çalışma Zamanı:** Java 17+
- **Çatı:** Spring Boot 3.3.4
- **Güvenlik:** Spring Security 6.x (Stateless JWT, Lambda DSL, RBAC)
- **Veri Erişimi:** Spring Data JPA, Hibernate, PostgreSQL
- **Eşzamanlılık Koruması:** JPA Optimistic Locking (`@Version Long version`)
- **Dokümantasyon:** SpringDoc OpenAPI 2.6.0 (Swagger UI)
- **Yardımcılar:** Lombok, MapStruct

### Frontend
- **Kütüphane & İskelet:** React 18, Vite, TypeScript
- **Stil:** Tailwind CSS
- **Durum Yönetimi (State):** Zustand v5 (`persist` middleware ile localStorage senkronizasyonu)
- **HTTP İstemcisi:** Axios (Request/Response interceptors, otomatik Bearer token ekleme ve 401 logout yönetimi)
- **İkonlar:** Lucide React

---

## 🚀 Hızlı Başlangıç

### 1. PostgreSQL Veritabanını Başlatma
Kök dizindeki Docker Compose dosyasını kullanarak PostgreSQL konteynerini çalıştırabilirsiniz:
```bash
docker-compose up -d
```
*Veritabanı bilgileri:* Port `5432`, DB `hospital_db`, Kullanıcı `postgres`, Şifre `postgres`

### 2. Backend Uygulamasını Çalıştırma
```bash
cd backend
mvn spring-boot:run
```
Backend `http://localhost:8080` portunda ayağa kalkacaktır.
- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON:** [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

Uygulama ilk kez çalıştığında `DataInitializer` devreye girerek aşağıdaki test hesaplarını otomatik oluşturur:
- **Yönetici:** `admin@hospital.com` / `Admin123!` (Rol: `ADMIN`)
- **Doktor (Kardiyoloji):** `mehmet.oz@hospital.com` / `Doctor123!` (Rol: `DOCTOR`)
- **Doktor (Nöroloji):** `ayse.kaya@hospital.com` / `Doctor123!` (Rol: `DOCTOR`)
- **Doktor (Çocuk):** `can.demir@hospital.com` / `Doctor123!` (Rol: `DOCTOR`)
- **Hasta:** `ahmet.yilmaz@hospital.com` / `Patient123!` (Rol: `PATIENT`)

### 3. Frontend Uygulamasını Çalıştırma
```bash
cd frontend
npm install
npm run dev
```
Frontend `http://localhost:5173` portunda açılacaktır.

---

## 🛡️ Çift Rezervasyon (Double-Booking) & Optimistic Locking Mimarisi
1. **İş Mantığı Seviyesi:** Randevu oluşturulurken `AppointmentRepository.existsByDoctorIdAndAppointmentDateAndStatusIn` ile doktorun ilgili saatte bekleyen veya onaylı bir randevusu olup olmadığı sorgulanır.
2. **Eşzamanlılık Koruması:** İki hasta aynı doktora ait aynı saat dilimine aynı milisaniyede istek attığında veritabanı ön kontrolü atlatılsa dahi `Appointment` varlığı üzerindeki `@Version` alanı sayesinde JPA `OptimisticLockException` fırlatır.
3. **Merkezi Hata Yakalama:** `GlobalExceptionHandler` bu hatayı yakalayarak `409 Conflict` durum kodu ve standart JSON formatında hata döner.
4. **Canlı UI Güncellemesi:** React tarafındaki `AppointmentBookingPage`, gelen `409 Conflict` yanıtını yakalayarak sayfayı çökertmeden kullanıcıya kırmızı bir uyarı kartı gösterir ve `booked-slots` API'sini arka planda anında tekrar sorgulayarak dolu saati gerçek zamanlı biçimde kilitler (disabled).
