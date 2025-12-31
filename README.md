<div align="center">
  <img src="public/logo.jpg" alt="Humania TalentMap Logo" width="120" height="120" style="border-radius: 20px;">
  
  # 🎯 Humania TalentMap
  
  **Platform Assessment Rekrutmen Berbasis AI**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  
  [Demo](https://talent-ai-assessment-platform.vercel.app) • [Dokumentasi](#-dokumentasi) • [Instalasi](#-instalasi) • [Fitur](#-fitur-utama)
  
</div>

---

## 📋 Deskripsi

**Humania TalentMap** adalah platform assessment rekrutmen berbasis web yang memungkinkan kandidat mengerjakan tes psikometri secara online. Sistem ini dirancang sebagai **decision support tool** untuk membantu HR dalam proses rekrutmen.

### ✨ Highlight
- 🧠 **7 Modul Tes Psikometri** - DISC, Big Five, RIASEC, Kognitif, dan lainnya
- 🤖 **AI-Powered Analysis** - Analisis naratif menggunakan Google Gemini
- 📊 **Interpretasi Otomatis** - Penjelasan hasil per dimensi
- 📧 **Email Otomatis** - Undangan kandidat via Resend
- 📄 **Export PDF** - Laporan hasil assessment profesional

---

## 🚀 Fitur Utama

### 👥 Multi-Role System
| Role | Akses | Kemampuan |
|------|-------|-----------|
| **Admin** | `/admin/*` | Kelola semua kandidat, modul tes, lihat semua laporan |
| **Recruiter** | `/recruiter/*` | Undang kandidat, lihat hasil kandidat yang diundang |
| **Candidate** | `/dashboard/*` | Kerjakan tes, lihat hasil sendiri |

### 📝 Modul Assessment

| Kode | Nama Modul | Dimensi |
|------|------------|---------|
| `COG-01` | Tes Penalaran & Problem Solving | Logic, Pattern, Reasoning |
| `ATT-01` | Tes Ketelitian & Konsistensi | Accuracy, Speed, Consistency |
| `PER-01` | Profil Big Five | Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism |
| `PER-02` | Profil DISC | Dominance, Influence, Steadiness, Compliance |
| `WAI-01` | Tes Sikap & Tanggung Jawab | Integrity, Responsibility |
| `INT-01` | Tes Minat RIASEC | Realistic, Investigative, Artistic, Social, Enterprising, Conventional |
| `RES-01` | Tes Ketahanan AQ | Control, Ownership, Reach, Endurance |

### 🔄 Alur Proses

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Recruiter  │ →  │  Kandidat   │ →  │  Kerjakan   │ →  │    Auto     │ →  │    View     │
│   Invite    │    │   Daftar    │    │    Tes      │    │   Scoring   │    │   Report    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                               ↓
                                                      ┌─────────────┐
                                                      │  AI Gemini  │
                                                      │  Analysis   │
                                                      └─────────────┘
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td>

### Frontend
- ⚡ **Next.js 16** - React Framework
- ⚛️ **React 19** - UI Library
- 🎨 **Tailwind CSS 4** - Styling
- 🎭 **Framer Motion** - Animations
- 🎯 **Lucide React** - Icons

</td>
<td>

### Backend & Database
- 🗄️ **Supabase** - PostgreSQL + Auth
- 🔐 **Row Level Security** - Data Protection
- 📊 **PostgREST** - Auto-generated API

</td>
</tr>
<tr>
<td>

### AI & Services
- 🤖 **Google Gemini 2.5 Flash** - AI Analysis
- 📧 **Resend** - Email Service
- 📄 **jsPDF** - PDF Generation

</td>
<td>

### DevOps
- 🚀 **Vercel** - Deployment
- 📦 **npm** - Package Manager
- 🔄 **TypeScript** - Type Safety

</td>
</tr>
</table>

---

## 📦 Instalasi

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Supabase
- API Key Google Gemini
- API Key Resend (opsional, untuk email)

### Steps

```bash
# 1. Clone repository
git clone https://github.com/your-username/humania-talentmap.git
cd humania-talentmap

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env dengan kredensial Anda

# 4. Run development server
npm run dev

# 5. Buka http://localhost:3000
```

---

## ⚙️ Konfigurasi Environment

Buat file `.env` di root project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...

# AI Configuration (Google Gemini)
GEMINI_API_KEY=AIzaSyxxxxxxxxx

# Email Configuration (Resend)
RESEND_API_KEY=re_xxxxxxxxxx
```

### 🔑 Cara Mendapatkan API Keys

| Service | Link | Gratis? |
|---------|------|---------|
| Supabase | [supabase.com](https://supabase.com) | ✅ Free tier |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com) | ✅ Free tier |
| Resend | [resend.com](https://resend.com) | ✅ 100 email/hari |

---

## 📁 Struktur Project

```
humania-talentmap/
├── 📂 app/                    # Next.js App Router
│   ├── 📂 admin/              # Dashboard Admin
│   │   ├── 📂 assessments/    # Kelola modul tes
│   │   └── 📂 candidates/     # Kelola kandidat
│   ├── 📂 recruiter/          # Dashboard Recruiter
│   │   ├── 📂 invite/         # Undang kandidat
│   │   └── 📂 candidates/     # Lihat hasil kandidat
│   ├── 📂 dashboard/          # Dashboard Kandidat
│   │   └── 📂 results/        # Lihat hasil sendiri
│   ├── 📂 assessment/         # Halaman pengerjaan tes
│   ├── 📂 invite/             # Penerimaan undangan
│   ├── 📂 auth/               # Authentication
│   ├── 📂 api/                # API Routes
│   └── 📂 login/              # Halaman login
├── 📂 lib/                    # Core Libraries
│   ├── 📄 scoring.ts          # Mesin scoring
│   ├── 📄 ai-narrative.ts     # Integrasi Gemini AI
│   ├── 📄 email.ts            # Email service (Resend)
│   ├── 📄 test-interpretations.ts  # Interpretasi per tes
│   └── 📄 dimensions.ts       # Definisi dimensi
├── 📂 components/             # Reusable Components
├── 📂 utils/                  # Utilities
│   └── 📂 supabase/           # Supabase clients
├── 📂 supabase/               # Database Scripts
│   ├── 📄 schema.sql          # Skema database
│   ├── 📄 seed_questions.sql  # Data soal
│   └── 📄 migration_*.sql     # Migrations
├── 📂 public/                 # Static Assets
├── 📄 .env                    # Environment variables
├── 📄 package.json            # Dependencies
└── 📄 README.md               # Dokumentasi ini
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   profiles   │────→│ organizations│     │  assessments │
│              │     │              │     │              │
│ - id (PK,FK) │     │ - id (PK)    │     │ - id (PK)    │
│ - full_name  │     │ - name       │     │ - code       │
│ - role       │     │ - recruiter_id│    │ - title      │
│ - invited_by │     └──────────────┘     │ - type       │
│ - org_id     │                          └──────┬───────┘
└──────────────┘                                 │
       │                                         │
       │         ┌──────────────┐               │
       │         │  invitations │               │
       │         │              │               │
       │         │ - id (PK)    │               │
       │         │ - token      │               │
       │         │ - email      │               │
       │         │ - status     │    ┌──────────────┐
       │         └──────────────┘    │  questions   │
       │                             │              │
       │                             │ - id (PK)    │
       ↓                             │ - text       │
┌──────────────┐                     │ - options    │
│  responses   │←────────────────────│ - category   │
│              │                     └──────────────┘
│ - id (PK)    │
│ - user_id    │     ┌──────────────┐
│ - answer     │     │    scores    │
└──────────────┘     │              │
       │             │ - id (PK)    │
       │             │ - dimension  │
       └────────────→│ - normalized │
                     │ - category   │
                     └──────────────┘
                            │
                            ↓
                     ┌──────────────┐
                     │   reports    │
                     │              │
                     │ - summary    │
                     │ - AI details │
                     └──────────────┘
```

---

## 📊 Scoring System

### Algoritma

1. **Pengumpulan Jawaban** - Jawaban dikelompokkan per dimensi
2. **Perhitungan Raw Score** - Akumulasi nilai per dimensi
3. **Normalisasi** - Konversi ke skala 0-100
4. **Kategorisasi** - Penentuan level (Low/Medium/High)

### Formula Normalisasi

```
normalized = ((raw - min) / (max - min)) × 100
```

### Kategori Threshold

| Skor | Kategori | Warna |
|------|----------|-------|
| 0 - 40 | 🔴 Low | Merah |
| 41 - 70 | 🟡 Medium | Kuning |
| 71 - 100 | 🟢 High | Hijau |

---

## 🤖 AI Integration

### Gemini AI digunakan untuk:

| Fitur | Deskripsi |
|-------|-----------|
| 📝 **Ringkasan Eksekutif** | Deskripsi profil kandidat secara keseluruhan |
| 💪 **Analisis Kekuatan** | Identifikasi area dengan skor tinggi |
| 📈 **Area Pengembangan** | Identifikasi area yang perlu dikembangkan |
| ❓ **Saran Interview** | Pertanyaan wawancara untuk eksplorasi lebih lanjut |

### Interpretasi Statis

Selain AI, sistem juga menyediakan **interpretasi statis** per dimensi berdasarkan standar psikometri:

```
Contoh DISC - Dominance (High):
"Tegas, kompetitif, dan berorientasi pada hasil. 
Suka mengambil tantangan dan memimpin."
```

---

## 🚀 Deployment

### Vercel (Rekomendasi)

1. Push code ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan environment variables
4. Deploy!

### Manual

```bash
# Build production
npm run build

# Start server
npm start
```

---

## 📝 Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm start` | Jalankan production server |
| `npm run lint` | Cek linting |

---

## ⚠️ Disclaimer

> **Penting:** Sistem ini adalah **alat bantu pengambilan keputusan (decision support)** dan **BUKAN** penentu keputusan akhir dalam proses rekrutmen.
> 
> - Tidak ada training machine learning prediktif
> - Tidak ada klaim akurasi atau prediksi performa kerja
> - Tidak ada webcam proctoring
> - Interpretasi hasil harus dilakukan oleh profesional HR yang berkompeten

---

## 📄 License

Copyright © 2025 Humania TalentMap. All rights reserved.

---

<div align="center">
  <p>Made with ❤️ for better recruitment</p>
  
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com)
  [![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)
</div>
