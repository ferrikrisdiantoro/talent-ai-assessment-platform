-- SEED QUESTIONS SCRIPT
-- Run this in Supabase SQL Editor to populate questions for each assessment module
-- Based on standard psychometric instruments: BFI, DISC, RIASEC, AQ

-- First, get the assessment IDs (we'll use variables)
-- Note: Run each section separately if needed

-- ============================================
-- PER-01: Big Five Inventory (BFI-44)
-- Dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
-- ============================================

-- Get PER-01 assessment ID
DO $$
DECLARE
    per01_id uuid;
BEGIN
    SELECT id INTO per01_id FROM assessments WHERE code = 'PER-01';
    
    -- Extraversion items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (per01_id, 'Saya adalah orang yang banyak bicara', 'likert', 'Extraversion', null),
    (per01_id, 'Saya cenderung pendiam', 'likert', 'Extraversion', null),
    (per01_id, 'Saya penuh dengan energi', 'likert', 'Extraversion', null),
    (per01_id, 'Saya membangkitkan antusiasme', 'likert', 'Extraversion', null),
    (per01_id, 'Saya cenderung pemalu dan tertutup', 'likert', 'Extraversion', null),
    (per01_id, 'Saya mudah bergaul dan ramah', 'likert', 'Extraversion', null),
    (per01_id, 'Saya kadang malu atau terhambat', 'likert', 'Extraversion', null),
    (per01_id, 'Saya suka bersosialisasi dengan banyak orang', 'likert', 'Extraversion', null);
    
    -- Agreeableness items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (per01_id, 'Saya mudah menemukan kesalahan orang lain', 'likert', 'Agreeableness', null),
    (per01_id, 'Saya suka membantu dan tidak egois terhadap orang lain', 'likert', 'Agreeableness', null),
    (per01_id, 'Saya cenderung memulai pertengkaran dengan orang lain', 'likert', 'Agreeableness', null),
    (per01_id, 'Saya memiliki sifat pemaaf', 'likert', 'Agreeableness', null),
    (per01_id, 'Saya bisa bersikap dingin dan menyendiri', 'likert', 'Agreeableness', null),
    (per01_id, 'Saya perhatian dan baik pada hampir semua orang', 'likert', 'Agreeableness', null),
    (per01_id, 'Saya terkadang kasar pada orang lain', 'likert', 'Agreeableness', null),
    (per01_id, 'Saya suka bekerja sama dengan orang lain', 'likert', 'Agreeableness', null),
    (per01_id, 'Saya dapat dipercaya oleh orang lain', 'likert', 'Agreeableness', null);
    
    -- Conscientiousness items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (per01_id, 'Saya melakukan pekerjaan dengan tuntas', 'likert', 'Conscientiousness', null),
    (per01_id, 'Saya bisa jadi ceroboh', 'likert', 'Conscientiousness', null),
    (per01_id, 'Saya adalah pekerja yang dapat diandalkan', 'likert', 'Conscientiousness', null),
    (per01_id, 'Saya cenderung tidak terorganisir', 'likert', 'Conscientiousness', null),
    (per01_id, 'Saya cenderung malas', 'likert', 'Conscientiousness', null),
    (per01_id, 'Saya tekun sampai tugas selesai', 'likert', 'Conscientiousness', null),
    (per01_id, 'Saya melakukan sesuatu dengan efisien', 'likert', 'Conscientiousness', null),
    (per01_id, 'Saya membuat rencana dan melaksanakannya', 'likert', 'Conscientiousness', null),
    (per01_id, 'Saya mudah terganggu', 'likert', 'Conscientiousness', null);
    
    -- Neuroticism items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (per01_id, 'Saya mudah depresi atau murung', 'likert', 'Neuroticism', null),
    (per01_id, 'Saya rileks dan menangani stres dengan baik', 'likert', 'Neuroticism', null),
    (per01_id, 'Saya bisa menjadi tegang', 'likert', 'Neuroticism', null),
    (per01_id, 'Saya banyak khawatir', 'likert', 'Neuroticism', null),
    (per01_id, 'Saya stabil secara emosional dan tidak mudah marah', 'likert', 'Neuroticism', null),
    (per01_id, 'Saya bisa menjadi murung', 'likert', 'Neuroticism', null),
    (per01_id, 'Saya tetap tenang dalam situasi tegang', 'likert', 'Neuroticism', null),
    (per01_id, 'Saya mudah gugup', 'likert', 'Neuroticism', null);
    
    -- Openness items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (per01_id, 'Saya orisinal dan penuh ide baru', 'likert', 'Openness', null),
    (per01_id, 'Saya penasaran tentang banyak hal', 'likert', 'Openness', null),
    (per01_id, 'Saya pemikir yang cerdik dan mendalam', 'likert', 'Openness', null),
    (per01_id, 'Saya memiliki imajinasi yang aktif', 'likert', 'Openness', null),
    (per01_id, 'Saya inventif dan kreatif', 'likert', 'Openness', null),
    (per01_id, 'Saya menghargai pengalaman seni dan estetika', 'likert', 'Openness', null),
    (per01_id, 'Saya lebih suka pekerjaan rutin', 'likert', 'Openness', null),
    (per01_id, 'Saya suka merefleksikan dan bermain dengan ide-ide', 'likert', 'Openness', null),
    (per01_id, 'Saya memiliki sedikit minat artistik', 'likert', 'Openness', null),
    (per01_id, 'Saya berpikiran luas terhadap nilai dan pengalaman orang lain', 'likert', 'Openness', null);
END $$;

-- ============================================
-- PER-02: DISC Assessment
-- Dimensions: Dominance, Influence, Steadiness, Compliance
-- ============================================

DO $$
DECLARE
    per02_id uuid;
BEGIN
    SELECT id INTO per02_id FROM assessments WHERE code = 'PER-02';
    
    -- Dominance items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (per02_id, 'Saya suka mengambil tanggung jawab dalam kelompok', 'likert', 'Dominance', null),
    (per02_id, 'Saya langsung mengatakan apa yang saya pikirkan', 'likert', 'Dominance', null),
    (per02_id, 'Saya menikmati tantangan dan kompetisi', 'likert', 'Dominance', null),
    (per02_id, 'Saya cepat dalam mengambil keputusan', 'likert', 'Dominance', null),
    (per02_id, 'Saya fokus pada hasil akhir', 'likert', 'Dominance', null),
    (per02_id, 'Saya tidak takut menghadapi konflik jika diperlukan', 'likert', 'Dominance', null);
    
    -- Influence items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (per02_id, 'Saya suka berinteraksi dengan banyak orang', 'likert', 'Influence', null),
    (per02_id, 'Saya mudah antusias dan optimis', 'likert', 'Influence', null),
    (per02_id, 'Saya pandai meyakinkan orang lain', 'likert', 'Influence', null),
    (per02_id, 'Saya menikmati menjadi pusat perhatian', 'likert', 'Influence', null),
    (per02_id, 'Saya memotivasi orang lain dengan semangat saya', 'likert', 'Influence', null),
    (per02_id, 'Saya suka bekerja dalam tim yang dinamis', 'likert', 'Influence', null);
    
    -- Steadiness items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (per02_id, 'Saya sabar dan pendengar yang baik', 'likert', 'Steadiness', null),
    (per02_id, 'Saya menghargai stabilitas dan konsistensi', 'likert', 'Steadiness', null),
    (per02_id, 'Saya setia dan dapat diandalkan', 'likert', 'Steadiness', null),
    (per02_id, 'Saya lebih suka lingkungan kerja yang harmonis', 'likert', 'Steadiness', null),
    (per02_id, 'Saya tidak suka perubahan yang mendadak', 'likert', 'Steadiness', null),
    (per02_id, 'Saya mendukung rekan kerja dengan tulus', 'likert', 'Steadiness', null);
    
    -- Compliance items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (per02_id, 'Saya memperhatikan detail dan akurasi', 'likert', 'Compliance', null),
    (per02_id, 'Saya mengikuti aturan dan prosedur', 'likert', 'Compliance', null),
    (per02_id, 'Saya menganalisis sebelum bertindak', 'likert', 'Compliance', null),
    (per02_id, 'Saya lebih suka bekerja sendiri daripada tim', 'likert', 'Compliance', null),
    (per02_id, 'Saya menjaga kualitas pekerjaan dengan standar tinggi', 'likert', 'Compliance', null),
    (per02_id, 'Saya diplomatis dalam berkomunikasi', 'likert', 'Compliance', null);
END $$;

-- ============================================
-- INT-01: RIASEC Holland
-- Dimensions: Realistic, Investigative, Artistic, Social, Enterprising, Conventional
-- ============================================

DO $$
DECLARE
    int01_id uuid;
BEGIN
    SELECT id INTO int01_id FROM assessments WHERE code = 'INT-01';
    
    -- Realistic items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (int01_id, 'Saya suka bekerja dengan alat atau mesin', 'likert', 'Realistic', null),
    (int01_id, 'Saya menikmati pekerjaan fisik dan outdoor', 'likert', 'Realistic', null),
    (int01_id, 'Saya suka memperbaiki benda yang rusak', 'likert', 'Realistic', null),
    (int01_id, 'Saya lebih suka melakukan daripada membaca tentang sesuatu', 'likert', 'Realistic', null),
    (int01_id, 'Saya praktis dan realistis dalam pendekatan kerja', 'likert', 'Realistic', null);
    
    -- Investigative items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (int01_id, 'Saya suka memecahkan masalah yang kompleks', 'likert', 'Investigative', null),
    (int01_id, 'Saya menikmati melakukan penelitian', 'likert', 'Investigative', null),
    (int01_id, 'Saya penasaran tentang bagaimana sesuatu bekerja', 'likert', 'Investigative', null),
    (int01_id, 'Saya suka menganalisis data dan informasi', 'likert', 'Investigative', null),
    (int01_id, 'Saya menikmati belajar hal-hal baru', 'likert', 'Investigative', null);
    
    -- Artistic items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (int01_id, 'Saya suka mengekspresikan diri secara kreatif', 'likert', 'Artistic', null),
    (int01_id, 'Saya menikmati seni, musik, atau drama', 'likert', 'Artistic', null),
    (int01_id, 'Saya suka mendesain atau menciptakan sesuatu yang baru', 'likert', 'Artistic', null),
    (int01_id, 'Saya lebih suka bekerja tanpa aturan ketat', 'likert', 'Artistic', null),
    (int01_id, 'Saya memiliki imajinasi yang kuat', 'likert', 'Artistic', null);
    
    -- Social items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (int01_id, 'Saya suka membantu orang lain', 'likert', 'Social', null),
    (int01_id, 'Saya menikmati mengajar atau melatih', 'likert', 'Social', null),
    (int01_id, 'Saya peduli dengan kesejahteraan orang lain', 'likert', 'Social', null),
    (int01_id, 'Saya mudah berempati dengan orang lain', 'likert', 'Social', null),
    (int01_id, 'Saya suka bekerja dalam tim untuk kebaikan bersama', 'likert', 'Social', null);
    
    -- Enterprising items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (int01_id, 'Saya suka memimpin dan mempengaruhi orang', 'likert', 'Enterprising', null),
    (int01_id, 'Saya menikmati menjual ide atau produk', 'likert', 'Enterprising', null),
    (int01_id, 'Saya ambisius dan berorientasi pada tujuan', 'likert', 'Enterprising', null),
    (int01_id, 'Saya berani mengambil risiko', 'likert', 'Enterprising', null),
    (int01_id, 'Saya menikmati negosiasi dan persuasi', 'likert', 'Enterprising', null);
    
    -- Conventional items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (int01_id, 'Saya suka bekerja dengan angka dan data', 'likert', 'Conventional', null),
    (int01_id, 'Saya menikmati tugas-tugas yang terstruktur', 'likert', 'Conventional', null),
    (int01_id, 'Saya teliti dalam mengelola detail', 'likert', 'Conventional', null),
    (int01_id, 'Saya suka mengorganisir file dan dokumen', 'likert', 'Conventional', null),
    (int01_id, 'Saya nyaman mengikuti prosedur standar', 'likert', 'Conventional', null);
END $$;

-- ============================================
-- RES-01: Adversity Quotient (AQ)
-- Dimensions: Control, Ownership, Reach, Endurance
-- ============================================

DO $$
DECLARE
    res01_id uuid;
BEGIN
    SELECT id INTO res01_id FROM assessments WHERE code = 'RES-01';
    
    -- Control items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (res01_id, 'Saya merasa bisa mengendalikan situasi sulit yang saya hadapi', 'likert', 'Control', null),
    (res01_id, 'Ketika ada masalah, saya yakin bisa mempengaruhi hasilnya', 'likert', 'Control', null),
    (res01_id, 'Saya tidak merasa tidak berdaya saat menghadapi tantangan', 'likert', 'Control', null),
    (res01_id, 'Saya percaya tindakan saya membuat perbedaan', 'likert', 'Control', null),
    (res01_id, 'Saya fokus pada apa yang bisa saya kontrol', 'likert', 'Control', null);
    
    -- Ownership items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (res01_id, 'Saya mengambil tanggung jawab untuk meningkatkan situasi', 'likert', 'Ownership', null),
    (res01_id, 'Saya tidak menyalahkan orang lain atas masalah saya', 'likert', 'Ownership', null),
    (res01_id, 'Saya proaktif mencari solusi daripada menunggu bantuan', 'likert', 'Ownership', null),
    (res01_id, 'Saya bertanggung jawab atas keputusan dan konsekuensinya', 'likert', 'Ownership', null),
    (res01_id, 'Saya inisiatif dalam mengatasi hambatan', 'likert', 'Ownership', null);
    
    -- Reach items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (res01_id, 'Masalah di satu area tidak mempengaruhi hidup saya secara keseluruhan', 'likert', 'Reach', null),
    (res01_id, 'Saya bisa memisahkan masalah kerja dari kehidupan pribadi', 'likert', 'Reach', null),
    (res01_id, 'Kegagalan kecil tidak membuat saya merasa gagal total', 'likert', 'Reach', null),
    (res01_id, 'Saya melihat masalah sebagai hal yang spesifik, bukan menyeluruh', 'likert', 'Reach', null),
    (res01_id, 'Satu kesulitan tidak merusak hari saya secara keseluruhan', 'likert', 'Reach', null);
    
    -- Endurance items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (res01_id, 'Saya percaya kesulitan bersifat sementara', 'likert', 'Endurance', null),
    (res01_id, 'Saya yakin situasi sulit akan membaik seiring waktu', 'likert', 'Endurance', null),
    (res01_id, 'Saya tidak melihat masalah sebagai sesuatu yang permanen', 'likert', 'Endurance', null),
    (res01_id, 'Saya tetap optimis meski menghadapi hambatan', 'likert', 'Endurance', null),
    (res01_id, 'Saya bertahan karena tahu kesulitan akan berlalu', 'likert', 'Endurance', null);
END $$;

-- ============================================
-- COG-01: Tes Penalaran & Problem Solving Kerja
-- Dimensions: Logic, Pattern, Reasoning
-- Format: Multiple Choice dengan scoring
-- ============================================

DO $$
DECLARE
    cog01_id uuid;
BEGIN
    SELECT id INTO cog01_id FROM assessments WHERE code = 'COG-01';
    
    -- Logic items (Deret Angka)
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (cog01_id, 'Lanjutkan deret berikut: 2, 4, 8, 16, ...', 'multiple_choice', 'Logic', 
     '[{"label": "A", "value": 1, "text": "32"}, {"label": "B", "value": 0, "text": "24"}, {"label": "C", "value": 0, "text": "18"}, {"label": "D", "value": 0, "text": "20"}]'),
    (cog01_id, 'Lanjutkan deret berikut: 1, 1, 2, 3, 5, 8, ...', 'multiple_choice', 'Logic', 
     '[{"label": "A", "value": 0, "text": "11"}, {"label": "B", "value": 1, "text": "13"}, {"label": "C", "value": 0, "text": "10"}, {"label": "D", "value": 0, "text": "12"}]'),
    (cog01_id, 'Lanjutkan deret berikut: 3, 6, 9, 12, ...', 'multiple_choice', 'Logic', 
     '[{"label": "A", "value": 0, "text": "14"}, {"label": "B", "value": 0, "text": "16"}, {"label": "C", "value": 1, "text": "15"}, {"label": "D", "value": 0, "text": "18"}]'),
    (cog01_id, 'Lanjutkan deret berikut: 100, 90, 81, 73, ...', 'multiple_choice', 'Logic', 
     '[{"label": "A", "value": 0, "text": "64"}, {"label": "B", "value": 1, "text": "66"}, {"label": "C", "value": 0, "text": "65"}, {"label": "D", "value": 0, "text": "67"}]'),
    (cog01_id, 'Lanjutkan deret berikut: 2, 6, 18, 54, ...', 'multiple_choice', 'Logic', 
     '[{"label": "A", "value": 0, "text": "108"}, {"label": "B", "value": 0, "text": "126"}, {"label": "C", "value": 1, "text": "162"}, {"label": "D", "value": 0, "text": "216"}]');
    
    -- Pattern items (Analogi)
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (cog01_id, 'PANAS berbanding DINGIN sama seperti TINGGI berbanding ...', 'multiple_choice', 'Pattern', 
     '[{"label": "A", "value": 0, "text": "BESAR"}, {"label": "B", "value": 1, "text": "RENDAH"}, {"label": "C", "value": 0, "text": "KECIL"}, {"label": "D", "value": 0, "text": "PANJANG"}]'),
    (cog01_id, 'DOKTER berbanding RUMAH SAKIT sama seperti GURU berbanding ...', 'multiple_choice', 'Pattern', 
     '[{"label": "A", "value": 0, "text": "BUKU"}, {"label": "B", "value": 0, "text": "MURID"}, {"label": "C", "value": 1, "text": "SEKOLAH"}, {"label": "D", "value": 0, "text": "PAPAN TULIS"}]'),
    (cog01_id, 'MATA berbanding MELIHAT sama seperti TELINGA berbanding ...', 'multiple_choice', 'Pattern', 
     '[{"label": "A", "value": 1, "text": "MENDENGAR"}, {"label": "B", "value": 0, "text": "BERBICARA"}, {"label": "C", "value": 0, "text": "MENCIUM"}, {"label": "D", "value": 0, "text": "MERASA"}]'),
    (cog01_id, 'BURUNG berbanding TERBANG sama seperti IKAN berbanding ...', 'multiple_choice', 'Pattern', 
     '[{"label": "A", "value": 0, "text": "BERJALAN"}, {"label": "B", "value": 0, "text": "BERLARI"}, {"label": "C", "value": 1, "text": "BERENANG"}, {"label": "D", "value": 0, "text": "MELOMPAT"}]'),
    (cog01_id, 'TANGAN berbanding LENGAN sama seperti KAKI berbanding ...', 'multiple_choice', 'Pattern', 
     '[{"label": "A", "value": 0, "text": "JARI"}, {"label": "B", "value": 1, "text": "TUNGKAI"}, {"label": "C", "value": 0, "text": "LUTUT"}, {"label": "D", "value": 0, "text": "TELAPAK"}]');
    
    -- Reasoning items (Silogisme/Logika Verbal)
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (cog01_id, 'Semua A adalah B. Semua B adalah C. Maka ...', 'multiple_choice', 'Reasoning', 
     '[{"label": "A", "value": 1, "text": "Semua A adalah C"}, {"label": "B", "value": 0, "text": "Semua C adalah A"}, {"label": "C", "value": 0, "text": "Beberapa A adalah C"}, {"label": "D", "value": 0, "text": "Tidak ada yang benar"}]'),
    (cog01_id, 'Jika hujan, jalanan basah. Jalanan tidak basah. Maka ...', 'multiple_choice', 'Reasoning', 
     '[{"label": "A", "value": 0, "text": "Hujan"}, {"label": "B", "value": 1, "text": "Tidak hujan"}, {"label": "C", "value": 0, "text": "Mungkin hujan"}, {"label": "D", "value": 0, "text": "Tidak dapat ditentukan"}]'),
    (cog01_id, 'Tidak ada kucing yang bisa terbang. Milo adalah kucing. Maka ...', 'multiple_choice', 'Reasoning', 
     '[{"label": "A", "value": 0, "text": "Milo bisa terbang"}, {"label": "B", "value": 1, "text": "Milo tidak bisa terbang"}, {"label": "C", "value": 0, "text": "Mungkin Milo bisa terbang"}, {"label": "D", "value": 0, "text": "Tidak dapat ditentukan"}]'),
    (cog01_id, 'Semua mahasiswa rajin. Budi adalah mahasiswa. Maka ...', 'multiple_choice', 'Reasoning', 
     '[{"label": "A", "value": 0, "text": "Budi mungkin rajin"}, {"label": "B", "value": 0, "text": "Budi tidak rajin"}, {"label": "C", "value": 1, "text": "Budi rajin"}, {"label": "D", "value": 0, "text": "Tidak dapat ditentukan"}]'),
    (cog01_id, 'Jika A maka B. Jika B maka C. A benar. Maka ...', 'multiple_choice', 'Reasoning', 
     '[{"label": "A", "value": 0, "text": "Hanya B yang benar"}, {"label": "B", "value": 0, "text": "Hanya C yang benar"}, {"label": "C", "value": 1, "text": "B dan C benar"}, {"label": "D", "value": 0, "text": "Tidak ada yang benar"}]');
END $$;

-- ============================================
-- ATT-01: Tes Ketelitian & Konsistensi Kerja
-- Dimensions: Accuracy, Speed, Consistency
-- Format: Likert (self-assessment)
-- ============================================

DO $$
DECLARE
    att01_id uuid;
BEGIN
    SELECT id INTO att01_id FROM assessments WHERE code = 'ATT-01';
    
    -- Accuracy items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (att01_id, 'Saya selalu memeriksa ulang pekerjaan sebelum menyerahkannya', 'likert', 'Accuracy', null),
    (att01_id, 'Saya jarang membuat kesalahan dalam pekerjaan detail', 'likert', 'Accuracy', null),
    (att01_id, 'Saya mudah menemukan kesalahan kecil dalam dokumen', 'likert', 'Accuracy', null),
    (att01_id, 'Saya teliti dalam mengisi formulir atau data', 'likert', 'Accuracy', null),
    (att01_id, 'Saya memperhatikan detail yang sering terlewat orang lain', 'likert', 'Accuracy', null);
    
    -- Speed items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (att01_id, 'Saya dapat menyelesaikan tugas dengan cepat tanpa mengurangi kualitas', 'likert', 'Speed', null),
    (att01_id, 'Saya efisien dalam mengelola waktu kerja', 'likert', 'Speed', null),
    (att01_id, 'Saya bisa bekerja dengan baik di bawah tekanan waktu', 'likert', 'Speed', null),
    (att01_id, 'Saya tidak membuang waktu untuk hal-hal yang tidak perlu', 'likert', 'Speed', null),
    (att01_id, 'Saya cepat beradaptasi dengan tugas-tugas baru', 'likert', 'Speed', null);
    
    -- Consistency items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (att01_id, 'Kualitas pekerjaan saya konsisten dari hari ke hari', 'likert', 'Consistency', null),
    (att01_id, 'Saya tetap fokus meskipun tugas berulang-ulang', 'likert', 'Consistency', null),
    (att01_id, 'Saya tidak mudah bosan dengan pekerjaan rutin', 'likert', 'Consistency', null),
    (att01_id, 'Performa saya stabil meski bekerja dalam waktu lama', 'likert', 'Consistency', null),
    (att01_id, 'Saya menjaga standar kerja yang sama setiap saat', 'likert', 'Consistency', null);
END $$;

-- ============================================
-- WAI-01: Tes Sikap & Tanggung Jawab Kerja
-- Dimensions: Integrity, Responsibility
-- Format: Likert (self-assessment)
-- ============================================

DO $$
DECLARE
    wai01_id uuid;
BEGIN
    SELECT id INTO wai01_id FROM assessments WHERE code = 'WAI-01';
    
    -- Integrity items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (wai01_id, 'Saya selalu jujur meskipun tidak ada yang mengawasi', 'likert', 'Integrity', null),
    (wai01_id, 'Saya menepati janji yang sudah saya buat', 'likert', 'Integrity', null),
    (wai01_id, 'Saya tidak mengambil barang yang bukan milik saya', 'likert', 'Integrity', null),
    (wai01_id, 'Saya mengakui kesalahan yang saya buat', 'likert', 'Integrity', null),
    (wai01_id, 'Saya tidak menyebarkan gosip atau informasi yang tidak benar', 'likert', 'Integrity', null),
    (wai01_id, 'Saya menjaga kerahasiaan informasi perusahaan', 'likert', 'Integrity', null);
    
    -- Responsibility items
    INSERT INTO questions (assessment_id, text, type, category, options) VALUES
    (wai01_id, 'Saya menyelesaikan tugas tepat waktu', 'likert', 'Responsibility', null),
    (wai01_id, 'Saya tidak meninggalkan pekerjaan yang belum selesai', 'likert', 'Responsibility', null),
    (wai01_id, 'Saya bertanggung jawab atas hasil kerja saya', 'likert', 'Responsibility', null),
    (wai01_id, 'Saya hadir tepat waktu sesuai jadwal', 'likert', 'Responsibility', null),
    (wai01_id, 'Saya tidak menyalahkan orang lain atas kesalahan saya', 'likert', 'Responsibility', null),
    (wai01_id, 'Saya mengikuti aturan dan prosedur yang berlaku', 'likert', 'Responsibility', null);
END $$;

-- ============================================
-- Verify the data
-- ============================================

-- Count questions per assessment
SELECT 
    a.code,
    a.title,
    COUNT(q.id) as question_count
FROM assessments a
LEFT JOIN questions q ON a.id = q.assessment_id
GROUP BY a.code, a.title
ORDER BY a.code;

