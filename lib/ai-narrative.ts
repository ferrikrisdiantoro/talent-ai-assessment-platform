/**
 * AI Narrative Generator using Google Gemini
 * Generates interpretive analysis of assessment scores
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export interface ScoreData {
    moduleCode: string
    moduleTitle: string
    dimensions: {
        name: string
        score: number
        category: string
    }[]
    totalScore: number
    totalCategory: string
}

export interface NarrativeResult {
    summary: string
    strengths: string[]
    developmentAreas: string[]
    recommendations: string[]
    interviewSuggestions: string[]
}

/**
 * Generate AI narrative interpretation of assessment scores
 */
export async function generateNarrative(
    candidateName: string,
    scores: ScoreData[]
): Promise<NarrativeResult> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Build the prompt
    const prompt = buildPrompt(candidateName, scores)

    try {
        const result = await model.generateContent(prompt)
        const response = result.response
        const text = response.text()

        // Parse the structured response
        return parseNarrativeResponse(text)
    } catch (error) {
        console.error('Error generating AI narrative:', error)
        // Return a fallback response
        return getFallbackNarrative(scores)
    }
}

function buildPrompt(candidateName: string, scores: ScoreData[]): string {
    const scoresText = scores.map(s => {
        const dims = s.dimensions.map(d => `  - ${d.name}: ${d.score}/100 (${d.category})`).join('\n')
        return `
### ${s.moduleCode}: ${s.moduleTitle}
Total Score: ${s.totalScore}/100 (${s.totalCategory})
Dimensions:
${dims}`
    }).join('\n')

    return `Kamu adalah seorang konsultan HR profesional yang ahli dalam interpretasi hasil asesmen rekrutmen.

Berdasarkan data hasil asesmen kandidat berikut, buatkan analisis naratif yang komprehensif.

**Nama Kandidat:** ${candidateName}

**Hasil Asesmen:**
${scoresText}

**PENTING:** 
- Ini adalah alat bantu pengambilan keputusan, BUKAN penentu akhir.
- Tidak boleh memberikan diagnosis klinis.
- Fokus pada konteks profesional/kerja.
- Gunakan bahasa Indonesia yang profesional.

Berikan respons dalam format JSON berikut (pastikan valid JSON):
{
  "summary": "Ringkasan profil kandidat dalam 2-3 kalimat",
  "strengths": ["Kekuatan 1", "Kekuatan 2", "Kekuatan 3"],
  "developmentAreas": ["Area pengembangan 1", "Area pengembangan 2"],
  "recommendations": ["Rekomendasi posisi/role yang cocok 1", "Rekomendasi 2"],
  "interviewSuggestions": ["Pertanyaan interview untuk menggali lebih dalam 1", "Pertanyaan 2", "Pertanyaan 3"]
}

Respons hanya JSON, tanpa markdown code block:`
}

function parseNarrativeResponse(text: string): NarrativeResult {
    try {
        // Clean up the response - remove any markdown code blocks if present
        let cleanText = text.trim()
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.slice(7)
        }
        if (cleanText.startsWith('```')) {
            cleanText = cleanText.slice(3)
        }
        if (cleanText.endsWith('```')) {
            cleanText = cleanText.slice(0, -3)
        }
        cleanText = cleanText.trim()

        const parsed = JSON.parse(cleanText)
        return {
            summary: parsed.summary || 'Tidak tersedia',
            strengths: parsed.strengths || [],
            developmentAreas: parsed.developmentAreas || [],
            recommendations: parsed.recommendations || [],
            interviewSuggestions: parsed.interviewSuggestions || []
        }
    } catch (error) {
        console.error('Error parsing AI response:', error)
        // Return a basic extraction if JSON parsing fails
        return {
            summary: text.slice(0, 300),
            strengths: [],
            developmentAreas: [],
            recommendations: [],
            interviewSuggestions: []
        }
    }
}

function getFallbackNarrative(scores: ScoreData[]): NarrativeResult {
    const avgScore = scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length
    const category = avgScore >= 70 ? 'tinggi' : avgScore >= 40 ? 'sedang' : 'rendah'

    return {
        summary: `Kandidat menunjukkan performa ${category} secara keseluruhan dengan rata-rata skor ${Math.round(avgScore)}/100. Diperlukan analisis lebih lanjut untuk interpretasi yang komprehensif.`,
        strengths: scores
            .flatMap(s => s.dimensions.filter(d => d.category === 'High'))
            .slice(0, 3)
            .map(d => `Skor tinggi pada dimensi ${d.name}`),
        developmentAreas: scores
            .flatMap(s => s.dimensions.filter(d => d.category === 'Low'))
            .slice(0, 2)
            .map(d => `Perlu pengembangan pada dimensi ${d.name}`),
        recommendations: ['Diperlukan wawancara lanjutan untuk konfirmasi profil'],
        interviewSuggestions: [
            'Ceritakan pengalaman Anda menghadapi tantangan di pekerjaan sebelumnya?',
            'Bagaimana Anda biasanya menyelesaikan konflik dengan rekan kerja?',
            'Apa motivasi utama Anda dalam bekerja?'
        ]
    }
}
