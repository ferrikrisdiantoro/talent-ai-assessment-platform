-- ============================================
-- FIX SCRIPT: COG-01 Questions (v2)
-- MASALAH: Pertanyaan COG-01 tersimpan sebagai 'likert' dengan NULL options
-- SOLUSI: Hapus responses terkait, lalu update pertanyaan
-- ============================================

-- LANGKAH 1: Hapus responses yang terkait dengan COG-01
DELETE FROM responses 
WHERE question_id IN (
    SELECT q.id FROM questions q
    JOIN assessments a ON q.assessment_id = a.id
    WHERE a.code = 'COG-01'
);

-- LANGKAH 2: Hapus scores yang terkait dengan COG-01
DELETE FROM scores
WHERE assessment_id = (SELECT id FROM assessments WHERE code = 'COG-01');

-- LANGKAH 3: Hapus pertanyaan COG-01 yang salah
DELETE FROM questions 
WHERE assessment_id = (SELECT id FROM assessments WHERE code = 'COG-01');

-- LANGKAH 4: Insert ulang dengan format yang benar
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
    
    RAISE NOTICE 'COG-01 questions fixed successfully! Total: 15 questions';
END $$;

-- VERIFIKASI: Cek hasilnya
SELECT 
    q.text,
    q.type,
    q.category,
    q.options IS NOT NULL as has_options
FROM questions q
JOIN assessments a ON q.assessment_id = a.id
WHERE a.code = 'COG-01'
ORDER BY q.category, q.created_at;
