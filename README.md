# Vodafone Telsim VAS Platformu

Bu proje; Oracle Database, Spring Boot ve Next.js kullanılarak geliştirilmiş full-stack bir telekomünikasyon Katma Değerli Servisler (VAS) yönetim platformudur.

Proje; abone girişi, servis satın alma, abonelik iptali, bakiye yönetimi, aktif abonelik görüntüleme, transaction loglama ve raporlama işlemlerini içermektedir.

---

## İçindekiler

* Projenin Amacı
* Özellikler
* Kullanılan Teknolojiler ve Versiyonlar
* Proje Yapısı
* Veritabanı Kurulumu
* Oracle Kullanıcı Oluşturma
* SQL Dosyalarının Çalıştırılması
* Backend Kurulumu
* Frontend Kurulumu
* Docker ile Çalıştırma
* Test Kullanıcıları
* API Endpointleri
* Olası Hatalar ve Çözümleri
* GitHub’a Yükleme

---

# Projenin Amacı

Bu projenin amacı, telekom sektöründe kullanılan VAS servis yönetimi mantığını örnek bir full-stack uygulama üzerinde göstermektir.

Sistem aşağıdaki temel akışı destekler:

1. Abone MSISDN ve şifre ile giriş yapar.
2. Abone kendi bilgilerini ve bakiyesini görür.
3. Mevcut VAS servislerini listeler.
4. Abonelik tipi servis satın alabilir.
5. Tek seferlik servis satın alabilir.
6. Aktif aboneliklerini görüntüleyebilir.
7. Aktif aboneliklerini iptal edebilir.
8. Satın alma ve iptal işlemleri loglanır.
9. Raporlama ekranlarından satış ve ciro analizleri görüntülenir.

---

# Özellikler

## Abone İşlemleri

* MSISDN ve şifre ile abone girişi
* Abone bilgilerini görüntüleme
* Güncel bakiye görüntüleme
* Aktif abonelikleri listeleme
* Kullanıcı bazlı toplam harcama görüntüleme

## Servis Yönetimi

* Abonelik servisi satın alma
* Tek seferlik servis satın alma
* Abonelik iptali
* Servis fiyatlarını görüntüleme
* Servis tiplerini ayırma
* Gerçek zamanlı bakiye güncelleme

Servis tipleri:

```text
SUBSCRIPTION
ONE_TIME
```

## İş Kuralları

Sistem içinde aşağıdaki iş kuralları uygulanmaktadır:

* Abone var mı kontrolü
* Abone aktif mi kontrolü
* Servis var mı kontrolü
* Servis aktif mi kontrolü
* Bakiye yeterli mi kontrolü
* Duplicate subscription kontrolü
* One-time servislerin tekrar satın alınabilmesi
* Cancel edilen subscription servislerin aktif abonelik listesinde görünmemesi

## Raporlama

* En çok satılan servisler
* Kullanıcı harcama analizi
* Son 24 saatlik toplam ciro
* Son 7 günlük toplam ciro
* Son 30 günlük toplam ciro
* Belirtilen tarih aralığında mesai günlerine göre satış performansı
* Transaction log görüntüleme

## Loglama

Aşağıdaki işlemler transaction log tablosuna kaydedilir:

* Servis satın alma
* Abonelik iptali
* Satın alma geçmişi
* İptal geçmişi

---

# Kullanılan Teknolojiler ve Versiyonlar

## Backend

```text
Java: 21
Spring Boot: 3.x / 4.x uyumlu yapı
Maven: 3.x
JDBC: Spring JDBC
REST API: Spring Web
```

## Frontend

```text
Next.js: 16.x
React: 19.x
JavaScript
Tailwind CSS
Node.js: 20.x veya üzeri önerilir
npm: 10.x veya üzeri önerilir
```

## Veritabanı

```text
Oracle Database: 21c XE önerilir
Oracle SQL
PL/SQL Procedure
Oracle Sequence
```

## Geliştirme Araçları

```text
Visual Studio Code
Oracle SQL Developer
Postman
Git
GitHub
Docker Desktop
Docker Compose
```

Not: Versiyonlar kullanılan geliştirme ortamına göre küçük farklılık gösterebilir. Proje Java 21, Next.js 16 ve Oracle XE ortamında geliştirilmiştir.

---

# Proje Yapısı

Proje aşağıdaki klasör yapısına sahiptir:

```text
vas-case-study/
├── backend/
├── frontend/
├── database/
│   ├── schema.sql
│   ├── procedures.sql
│   └── sequences.sql
├── screenshots/
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Klasör Açıklamaları

```text
backend/
```

Spring Boot backend projesini içerir.

```text
frontend/
```

Next.js frontend projesini içerir.

```text
database/
```

Oracle Database için gerekli SQL scriptlerini içerir.

```text
screenshots/
```

Proje ekran görüntüleri için ayrılmış klasördür.

---

# Veritabanı Kurulumu

Bu proje Oracle Database kullanmaktadır.

Projeyi başka bir bilgisayarda çalıştırmak için önce Oracle Database kurulmuş ve çalışıyor olmalıdır.

Önerilen veritabanı:

```text
Oracle Database 21c XE
```

---

# Oracle Kullanıcı Oluşturma

Backend’in veritabanına bağlanabilmesi için Oracle içinde `VAS_PLATFORM` kullanıcısı oluşturulmalıdır.

SQL Developer veya SQL Plus üzerinden `SYS` ya da `SYSTEM` kullanıcısı ile aşağıdaki komutları çalıştırın:

```sql
CREATE USER VAS_PLATFORM IDENTIFIED BY vas123;

GRANT CONNECT, RESOURCE TO VAS_PLATFORM;

ALTER USER VAS_PLATFORM QUOTA UNLIMITED ON USERS;
```

Bu işlemden sonra SQL Developer’da aşağıdaki bilgilerle bağlantı oluşturabilirsiniz:

```text
Username: VAS_PLATFORM
Password: vas123
Host: localhost
Port: 1521
Service Name: XEPDB1
```

Eğer Oracle kurulumunuzda service name farklıysa `XEPDB1` yerine kendi service name değerinizi kullanın.

Bazı kurulumlarda service name şu olabilir:

```text
XE
```

---

# SQL Dosyalarının Çalıştırılması

`database/` klasörü içinde üç temel SQL dosyası vardır:

```text
sequences.sql
schema.sql
procedures.sql
```

Bu dosyalar aşağıdaki sırayla çalıştırılmalıdır:

```text
1. database/sequences.sql
2. database/schema.sql
3. database/procedures.sql
```

## 1. sequences.sql

Oracle sequence yapılarını oluşturur.

Örnek sequence yapıları:

```text
SUBSCRIPTIONS_SEQ
ONE_TIME_PURCHASES_SEQ
TRANSACTION_LOGS_SEQ
SERVICES_SEQ
SUBSCRIBERS_SEQ
```

## 2. schema.sql

Tabloları ve örnek verileri oluşturur.

Oluşturulan temel tablolar:

```text
SUBSCRIBERS
SERVICES
SUBSCRIPTIONS
ONE_TIME_PURCHASES
TRANSACTION_LOGS
USERS
```

## 3. procedures.sql

PL/SQL procedure yapılarını oluşturur.

Oluşturulan procedure’lar:

```text
BUY_SERVICE
CANCEL_SUBSCRIPTION
ADD_TRANSACTION_LOG
```

---

# Veritabanı Tabloları

## SUBSCRIBERS

Abone bilgilerini tutar.

Örnek alanlar:

```text
SUBSCRIBER_ID
MSISDN
FULL_NAME
BALANCE
STATUS
PASSWORD
CREATED_AT
```

## SERVICES

VAS servislerini tutar.

Örnek alanlar:

```text
SERVICE_ID
SERVICE_NAME
SERVICE_TYPE
PRICE
STATUS
CREATED_AT
```

## SUBSCRIPTIONS

Aktif ve iptal edilmiş abonelik servislerini tutar.

Örnek alanlar:

```text
SUBSCRIPTION_ID
SUBSCRIBER_ID
SERVICE_ID
START_DATE
END_DATE
STATUS
```

## ONE_TIME_PURCHASES

Tek seferlik servis satın alma kayıtlarını tutar.

Örnek alanlar:

```text
PURCHASE_ID
SUBSCRIBER_ID
SERVICE_ID
PURCHASE_DATE
AMOUNT
```

## TRANSACTION_LOGS

Satın alma ve iptal işlemlerinin loglarını tutar.

Örnek alanlar:

```text
LOG_ID
ACTION_TYPE
SUBSCRIBER_ID
SERVICE_ID
DESCRIPTION
CREATED_AT
```

## USERS

Admin veya sistem kullanıcıları için kullanılan tablodur.

---

# Stored Procedure Açıklamaları

## BUY_SERVICE

Servis satın alma işlemini yönetir.

Kontrol ettiği kurallar:

* Abone var mı
* Abone aktif mi
* Servis var mı
* Servis aktif mi
* Bakiye yeterli mi
* Subscription servislerde duplicate aktif abonelik var mı
* One-time servislerde tekrar satın alma yapılabilir mi

İşlem başarılı olursa:

* Subscription ise `SUBSCRIPTIONS` tablosuna kayıt atar.
* One-time ise `ONE_TIME_PURCHASES` tablosuna kayıt atar.
* Abone bakiyesini düşürür.
* Transaction log oluşturur.

## CANCEL_SUBSCRIPTION

Aktif abonelik iptal işlemini yapar.

İşlem başarılı olursa:

* `SUBSCRIPTIONS.STATUS` değeri `CANCELLED` olur.
* `END_DATE` güncellenir.
* Transaction log kaydı oluşur.

## ADD_TRANSACTION_LOG

Satın alma ve iptal işlemleri için `TRANSACTION_LOGS` tablosuna log kaydı oluşturur.

---

# Backend Kurulumu

Backend’i çalıştırmak için:

```bash
cd backend
mvn spring-boot:run
```

Backend varsayılan olarak şu portta çalışır:

```text
http://localhost:8080
```

---

# Backend Veritabanı Ayarları

Backend’in Oracle Database’e bağlanabilmesi için `backend/src/main/resources/application.properties` dosyasındaki bağlantı bilgileri kontrol edilmelidir.

Örnek ayar:

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/XEPDB1
spring.datasource.username=VAS_PLATFORM
spring.datasource.password=vas123
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
```

Eğer Oracle service name farklıysa aşağıdaki gibi değiştirilebilir:

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/XE
```

---

# Frontend Kurulumu

Frontend’i çalıştırmak için:

```bash
cd frontend
npm install
npm run dev
```

Frontend varsayılan olarak şu portta çalışır:

```text
http://localhost:3000
```

---

# Frontend API Ayarı

Frontend’in backend’e bağlanabilmesi için `frontend/lib/api.js` dosyasındaki API adresi kontrol edilmelidir.

Örnek:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

Backend farklı portta çalışıyorsa bu adres güncellenmelidir.

---

# Docker ile Çalıştırma

Projede Docker desteği bulunmaktadır.

Docker ile çalıştırmak için proje ana dizininde aşağıdaki komut çalıştırılır:

```bash
docker-compose up --build
```

Bu komut frontend ve backend servislerini container olarak başlatır.

Not: Oracle Database bu Docker Compose dosyasına dahil değilse Oracle Database’in ayrıca local makinede çalışıyor olması gerekir.

Yani Docker kullanırken de aşağıdakiler gereklidir:

```text
Oracle Database çalışıyor olmalı
VAS_PLATFORM kullanıcısı oluşturulmuş olmalı
SQL scriptleri çalıştırılmış olmalı
Backend DB connection bilgileri doğru olmalı
```

---

# Test Kullanıcıları

Aşağıdaki kullanıcılar örnek giriş için kullanılabilir.

## Örnek Abone 1

```text
MSISDN: 905428871104
Password: 12345
```

## Örnek Abone 2

```text
MSISDN: 905424445566
Password: 12345
```

## Örnek Abone 3

```text
MSISDN: 905427778899
Password: 12345
```

## Örnek Abone 4

```text
MSISDN: 905420001122
Password: 12345
```

## Örnek Abone 5

```text
MSISDN: 905555555555
Password: 12345
```

Not: Bu kullanıcılar `schema.sql` içindeki örnek verilerden gelmektedir. Eğer veritabanındaki örnek veriler değiştirilirse giriş bilgileri de değişebilir.

---

# Kullanım Akışı

Projeyi çalıştırdıktan sonra:

```text
http://localhost:3000
```

adresine gidin.

Sonra:

1. MSISDN ve şifre ile giriş yapın.
2. Dashboard ekranı açılır.
3. Services sekmesinden servis satın alınabilir.
4. My Subscriptions sekmesinden aktif abonelikler görüntülenebilir.
5. Analytics sekmesinden gelir ve satış raporları görüntülenebilir.
6. Logs sekmesinden işlem logları görüntülenebilir.
7. Top Services sekmesinden en çok satılan servisler görüntülenebilir.

---

# Ana API Endpointleri

## Auth

```text
POST /api/subscriber-login
```

## Subscriber

```text
GET /api/subscriber/{id}
```

## Services

```text
GET /api/services
POST /api/buy-service
POST /api/cancel-subscription
```

## Reports

```text
GET /api/reports/top-services
GET /api/reports/logs
GET /api/reports/revenue
GET /api/reports/revenue-summary
GET /api/reports/business-days-performance
GET /api/reports/subscriber-spending/{id}
GET /api/reports/subscriber-subscriptions/{id}
```

---

# Örnek Postman Body

## Servis Satın Alma

```json
{
  "subscriberId": 1,
  "serviceId": 5
}
```

## Abonelik İptali

```json
{
  "subscriberId": 1,
  "serviceId": 1
}
```

---

# Çalıştırma Sırası

Projeyi manuel çalıştırmak için önerilen sıra:

```text
1. Oracle Database’i başlat
2. VAS_PLATFORM user oluştur
3. sequences.sql çalıştır
4. schema.sql çalıştır
5. procedures.sql çalıştır
6. Backend’i çalıştır
7. Frontend’i çalıştır
8. http://localhost:3000 adresine git
```

---

# Olası Hatalar ve Çözümleri

## ORA-01017: invalid username/password

Oracle kullanıcı adı veya şifre hatalı olabilir.

Kontrol edilmesi gereken dosya:

```text
backend/src/main/resources/application.properties
```

Kontrol edilmesi gereken alanlar:

```properties
spring.datasource.username=VAS_PLATFORM
spring.datasource.password=vas123
```

## ORA-12505 veya ORA-12514

Oracle service name veya SID hatalı olabilir.

Şu değerleri kontrol edin:

```properties
jdbc:oracle:thin:@localhost:1521/XEPDB1
```

Alternatif:

```properties
jdbc:oracle:thin:@localhost:1521/XE
```

## Backend 8080 portunda çalışmıyor

8080 portu başka bir uygulama tarafından kullanılıyor olabilir.

Windows için:

```bash
netstat -ano | findstr :8080
```

## Frontend backend’e bağlanamıyor

`frontend/lib/api.js` içindeki API adresini kontrol edin:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

## CORS hatası

Backend tarafında CORS konfigürasyonu kontrol edilmelidir.

Projede CORS ayarı backend controller/config tarafında yapılmıştır.

## My Subscriptions boş görünüyor

Kullanıcının aktif subscription kaydı olmayabilir.

Kontrol için:

```sql
SELECT *
FROM SUBSCRIPTIONS
WHERE SUBSCRIBER_ID = 1
AND STATUS = 'ACTIVE';
```

## Docker çalışıyor ama backend DB’ye bağlanamıyor

Oracle Database container içinde değilse backend container local Oracle’a erişemeyebilir.

Bu durumda:

* Oracle Database’in çalıştığından emin olun.
* Datasource URL bilgisini kontrol edin.
* Docker network ayarları gerekebilir.
* Gerekirse manuel backend çalıştırma yöntemi kullanılabilir.

---

# Ekran Görüntüleri

Proje ekran görüntüleri `screenshots/` klasörü içinde


# Geliştirici

Özgür Doğan Güneş
