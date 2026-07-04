# Belek Akademik Sistemi (BAS)

Antalya Belek Üniversitesi için geliştirilmiş akademik veri yönetim sistemi. Akademisyenlerin yayın, proje, tez, patent, ödül, etkinlik, ders ve üyelik gibi akademik çıktılarını tek platformda yönetmelerini sağlar.

## Özellikler

- Akademisyen profili ve herkese açık profil sayfası
- Yayın, proje, tez, patent, ödül, etkinlik, ders, üyelik yönetimi
- Tek tuşla PDF CV indirme
- Araştırma grupları ve ortak çalışma tespiti
- JWT tabanlı kimlik doğrulama ve rol sistemi (superadmin / academic)
- Dinamik anasayfa, istatistik grafikleri ve slider
- Türkçe / İngilizce dil desteği

## Teknolojiler

**Backend:** Django 4.2, Django REST Framework, PostgreSQL (Neon DB), Celery, Redis

**Frontend:** React 18, Vite, Ant Design, Recharts, React Router DOM

**Altyapı:** Docker, Docker Compose, Nginx


### Gereksinimler
- Docker ve Docker Compose
- Node.js 18+
- Python 3.11+

## Proje Yapısı

belek-academic-system/
├── backend/          # Django uygulaması
│   ├── apps/         # Modüller (publications, projects, theses...)
│   ├── config/       # Ayarlar ve URL yapılandırması
│   └── requirements/ # Python bağımlılıkları
├── frontend/         # React uygulaması
│   ├── src/
│   │   ├── pages/    # Sayfa bileşenleri
│   │   └── components/ # Ortak bileşenler
│   └── package.json
├── docker-compose.yml
├── .env.example
└── requirements.txt

## Kullanıcı Rolleri

| Rol | Yetki |
|-----|-------|
| superadmin | Admin paneli, tüm veri yönetimi |
| academic | Dashboard, kendi akademik çıktıları |

## Geliştirici

Ahsen Bükre Oktay