# Vodafone Telsim VAS Platformu

Bu proje; Oracle Database, Spring Boot ve Next.js kullanılarak geliştirilmiş bir VAS (Katma Değerli Servisler) yönetim platformudur.

Sistem üzerinden:

* Kullanıcı girişi yapılabilir
* Servis satın alınabilir
* Abonelik iptal edilebilir
* Bakiye görüntülenebilir
* Aktif abonelikler listelenebilir
* Satış ve işlem logları görüntülenebilir

---

# Kullanılan Teknolojiler

## Backend

```text
Java 21
Spring Boot
Maven
Oracle JDBC
REST API
```

## Frontend

```text
Next.js
React
Tailwind CSS
Node.js
```

## Veritabanı

```text
Oracle Database XE
PL/SQL
Oracle SQL
```

---

# Proje Yapısı

```text
vas-case-study/
├── backend/
├── frontend/
├── database/
│   ├── sequences.sql
│   ├── schema.sql
│   └── procedures.sql
├── docker-compose.yml
└── README.md
```

---

# Veritabanı Kurulumu

Önce Oracle XE kurulmalı ve çalışıyor olmalıdır.

Önerilen sürüm:

```text
Oracle 21c XE
```

---

# Oracle Kullanıcısı Oluşturma

SQL Developer üzerinden `SYSTEM` veya `SYS` kullanıcısıyla giriş yapıp aşağıdaki komutları çalıştırın:

```sql
CREATE USER VAS_PLATFORM IDENTIFIED BY vas123;

GRANT CONNECT, RESOURCE TO VAS_PLATFORM;

ALTER USER VAS_PLATFORM QUOTA UNLIMITED ON USERS;
```

Bağlantı bilgileri:

```text
Username: VAS_PLATFORM
Password: vas123
Host: localhost
Port: 1521
Service Name: XEPDB1
```

Bazı Oracle sürümlerinde service name `XE` olabilir.

---

# SQL Dosyalarını Çalıştırma

`database/` klasörü içindeki dosyaları şu sırayla çalıştırın:

```text
1. sequences.sql
2. schema.sql
3. procedures.sql
```

Bu dosyalar:

* Sequence yapılarını
* Tabloları
* Örnek verileri
* Procedure yapılarını

oluşturur.

---

# Backend Kurulumu

Backend klasörüne girin:

```bash
cd backend
```

Projeyi çalıştırın:

```bash
mvn spring-boot:run
```

Backend adresi:

```text
http://localhost:8080
```

---

# Backend Veritabanı Ayarı

`backend/src/main/resources/application.properties`

dosyasındaki Oracle bağlantısını kontrol edin:

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/XEPDB1
spring.datasource.username=VAS_PLATFORM
spring.datasource.password=vas123
```

Eğer Oracle service name `XE` ise:

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/XE
```

---

# Frontend Kurulumu

Frontend klasörüne girin:

```bash
cd frontend
```

Paketleri yükleyin:

```bash
npm install
```

Projeyi başlatın:

```bash
npm run dev
```

Frontend adresi:

```text
http://localhost:3000
```

---

# Frontend API Ayarı

`frontend/lib/api.js` dosyasındaki backend adresini kontrol edin:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

---

# Çalıştırma Sırası

```text
1. Oracle Database başlat
2. VAS_PLATFORM kullanıcısını oluştur
3. sequences.sql çalıştır
4. schema.sql çalıştır
5. procedures.sql çalıştır
6. Backend’i çalıştır
7. Frontend’i çalıştır
8. http://localhost:3000 adresine gir
```

---

# Test Kullanıcısı

```text
MSISDN: 905428871104
Password: 12345
```

---

# Ana API Endpointleri

## Auth

```text
POST /api/subscriber-login
```

## Services

```text
GET  /api/services
POST /api/buy-service
POST /api/cancel-subscription
```

## Reports

```text
GET /api/reports/top-services
GET /api/reports/logs
GET /api/reports/revenue
```

---

# Olası Hatalar

## ORA-01017

Kullanıcı adı veya şifre yanlış olabilir.

Kontrol edin:

```properties
spring.datasource.username
spring.datasource.password
```

---

## ORA-12505 / ORA-12514

Oracle service name yanlış olabilir.

Şunları deneyin:

```text
XEPDB1
```

veya

```text
XE
```

---

## Frontend Backend’e Bağlanmıyor

`frontend/lib/api.js` içindeki URL’yi kontrol edin:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

---

# Geliştirici

Özgür Doğan Güneş
