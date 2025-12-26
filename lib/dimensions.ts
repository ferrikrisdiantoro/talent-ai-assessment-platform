/**
 * Dimension Definitions for Assessment Modules
 * These dimensions are used for scoring aggregation and display.
 * Questions should have their `category` field set to one of these dimension names.
 */

// Module dimension mappings
export const MODULE_DIMENSIONS: Record<string, string[]> = {
    // COG-01: Tes Penalaran & Problem Solving Kerja
    'COG-01': ['Logic', 'Pattern', 'Reasoning'],

    // ATT-01: Tes Ketelitian & Konsistensi Kerja
    'ATT-01': ['Accuracy', 'Speed', 'Consistency'],

    // PER-01: Profil Gaya Kerja Profesional (Big Five)
    'PER-01': ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],

    // PER-02: Profil Gaya Interaksi & Komunikasi Kerja (DISC)
    'PER-02': ['Dominance', 'Influence', 'Steadiness', 'Compliance'],

    // WAI-01: Tes Sikap & Tanggung Jawab Kerja
    'WAI-01': ['Integrity', 'Responsibility'],

    // INT-01: Tes Minat & Kecocokan Peran Kerja (RIASEC)
    'INT-01': ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],

    // RES-01: Tes Ketahanan & Daya Juang Kerja (AQ)
    'RES-01': ['Control', 'Ownership', 'Reach', 'Endurance']
}

// Short codes for DISC (for backwards compatibility if needed)
export const DISC_SHORT_CODES: Record<string, string> = {
    'D': 'Dominance',
    'I': 'Influence',
    'S': 'Steadiness',
    'C': 'Compliance'
}

// Short codes for RIASEC
export const RIASEC_SHORT_CODES: Record<string, string> = {
    'R': 'Realistic',
    'I': 'Investigative',
    'A': 'Artistic',
    'S': 'Social',
    'E': 'Enterprising',
    'C': 'Conventional'
}

// Default dimension if category is not set on a question
export const DEFAULT_DIMENSION = 'General'

// Category thresholds for normalized scores (0-100)
export const CATEGORY_THRESHOLDS = {
    LOW_MAX: 40,      // 0-40 = Low
    MEDIUM_MAX: 70,   // 41-70 = Medium
    // 71-100 = High
}

// Likert scale range
export const LIKERT_MIN = 1
export const LIKERT_MAX = 5

// Disclaimer text (required on all results)
export const DISCLAIMER_TEXT = `
DISCLAIMER / PENYANGKALAN:

Hasil asesmen ini merupakan alat bantu pengambilan keputusan (decision support) dan BUKAN penentu keputusan akhir dalam proses rekrutmen. 
Interpretasi hasil harus dilakukan oleh profesional HR yang berkompeten dengan mempertimbangkan konteks posisi, budaya organisasi, dan faktor-faktor lainnya.

Asesmen ini tidak bersifat diagnostik klinis dan tidak dapat digunakan untuk mendiagnosis kondisi psikologis apapun.
Hasil tes ini bersifat rahasia dan hanya boleh diakses oleh pihak yang berwenang dalam proses rekrutmen.

© ${new Date().getFullYear()} Humania TalentMap. All rights reserved.
`.trim()

// Short disclaimer for inline use
export const DISCLAIMER_SHORT =
    'Hasil ini adalah alat bantu pengambilan keputusan, bukan penentu akhir. Tidak bersifat diagnostik klinis.'

/**
 * Get dimension name from a category value
 * Handles short codes (D, I, S, C for DISC) and full names
 */
export function normalizeDimensionName(category: string | null, moduleCode: string): string {
    if (!category) return DEFAULT_DIMENSION

    const trimmed = category.trim()

    // Check if it's a DISC short code
    if (moduleCode === 'PER-02' && DISC_SHORT_CODES[trimmed.toUpperCase()]) {
        return DISC_SHORT_CODES[trimmed.toUpperCase()]
    }

    // Check if it's a RIASEC short code
    if (moduleCode === 'INT-01' && RIASEC_SHORT_CODES[trimmed.toUpperCase()]) {
        return RIASEC_SHORT_CODES[trimmed.toUpperCase()]
    }

    // Return as-is (already a full dimension name)
    return trimmed
}

/**
 * Get all expected dimensions for a module
 */
export function getModuleDimensions(moduleCode: string): string[] {
    return MODULE_DIMENSIONS[moduleCode] || [DEFAULT_DIMENSION]
}
