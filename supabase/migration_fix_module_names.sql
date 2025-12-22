-- Migration Script: Fix Module Naming to Match Client Brief
-- Run this on existing databases where seeds already ran

-- Update COG-01
UPDATE assessments 
SET title = 'Tes Penalaran & Problem Solving Kerja' 
WHERE code = 'COG-01';

-- Update ATT-01
UPDATE assessments 
SET title = 'Tes Ketelitian & Konsistensi Kerja' 
WHERE code = 'ATT-01';

-- Update PER-02 (add "Kerja")
UPDATE assessments 
SET title = 'Profil Gaya Interaksi & Komunikasi Kerja (DISC)' 
WHERE code = 'PER-02';

-- Update WAI-01
UPDATE assessments 
SET title = 'Tes Sikap & Tanggung Jawab Kerja' 
WHERE code = 'WAI-01';

-- Update INT-01
UPDATE assessments 
SET title = 'Tes Minat & Kecocokan Peran Kerja (RIASEC)' 
WHERE code = 'INT-01';

-- Update RES-01
UPDATE assessments 
SET title = 'Tes Ketahanan & Daya Juang Kerja (AQ)' 
WHERE code = 'RES-01';

-- Note: PER-01 "Profil Gaya Kerja Profesional (Big Five)" is already correct
