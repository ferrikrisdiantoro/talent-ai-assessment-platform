# AI-Based Recruitment Assessment Platform (Next.js + Supabase)

## TUJUAN DOKUMEN
Dokumen ini digunakan sebagai spesifikasi teknis utama untuk membangun sistem platform assessment rekrutmen berbasis AI menggunakan Next.js dan Supabase.
Sistem bersifat decision support, bukan penentu keputusan akhir, dan tidak menggunakan training machine learning prediktif.

Dokumen ini dimaksudkan untuk dijadikan prompt implementasi di Cursor agar sistem dapat dibangun secara bertahap dan terstruktur.

## GAMBARAN UMUM SISTEM
Sistem ini memungkinkan kandidat mengerjakan tes rekrutmen secara online (psikotes, IQ, dan skill dasar). Setelah tes disubmit, sistem:
1. Menghitung skor secara otomatis (rule-based)
2. Memetakan skor ke dimensi penilaian
3. Menormalisasi dan mengkategorikan skor
4. Menghasilkan analisis naratif berbasis AI (LLM)
5. Membuat laporan hasil dalam format PDF
6. Menyediakan dashboard admin/HR untuk monitoring dan unduh laporan

## BATASAN PENTING
- Tidak melakukan training machine learning atau deep learning
- Tidak ada klaim akurasi atau prediksi performa kerja
- Tidak ada webcam atau proctoring
- AI hanya digunakan untuk interpretasi hasil
- Sistem adalah MVP / Lite Version

## TEKNOLOGI
- Frontend: Next.js (App Router)
- Backend: Next.js Server Actions / API Routes
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth
- Storage: Supabase Storage (PDF)
- AI Analysis: LLM API (contoh: GPT-4o mini)
- PDF Generator: HTML to PDF

## MODUL TES
COG-01 – Penalaran & Problem Solving Kerja  
ATT-01 – Ketelitian & Konsistensi Kerja  
PER-01 – Profil Gaya Kerja Profesional (Big Five)  
PER-02 – Profil Gaya Interaksi & Komunikasi (DISC)  
WAI-01 – Sikap & Tanggung Jawab Kerja  
INT-01 – Minat & Kecocokan Peran Kerja (RIASEC)  
RES-01 – Ketahanan & Daya Juang Kerja (AQ)

## STRUKTUR DATABASE
Lihat definisi tabel pada dokumentasi Supabase (profiles, assessments, questions, responses, scores, reports).

## SCORING
- Rule-based
- Likert dan MCQ
- Normalisasi skor ke 0–100
- Kategori: Low, Medium, High

## AI ANALYSIS
AI menerima skor dan kategori, lalu menghasilkan:
- Ringkasan profil kandidat
- Kekuatan utama
- Area yang perlu dikonfirmasi
- Rekomendasi pertanyaan interview

## LAPORAN PDF
Berisi identitas kandidat, ringkasan hasil, skor per modul dan dimensi, analisis AI, rekomendasi interview, dan disclaimer.

## DEPLOYMENT
Menggunakan Next.js dan Supabase, diimplementasikan ke domain milik klien.

## CATATAN
Sistem ini dirancang agar cepat dikembangkan, sesuai ekspektasi klien, dan dapat dikembangkan ke versi Pro di masa depan.
