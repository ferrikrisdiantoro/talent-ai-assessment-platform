'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ScoreData {
    dimension: string
    normalized_score: number
    category: string
    assessment_code: string
    assessment_title: string
}

interface CandidatePDFButtonProps {
    candidateName: string
    candidateEmail: string
    scores: ScoreData[]
}

// Dimension translation map
const dimensionTranslations: Record<string, string> = {
    // Attitude dimensions
    'Consistency': 'Konsistensi',
    'Speed': 'Kecepatan',
    'Accuracy': 'Akurasi',
    'Focus': 'Fokus',
    'Precision': 'Presisi',

    // Personality dimensions (Big Five)
    'Openness': 'Keterbukaan',
    'Conscientiousness': 'Kecermatan',
    'Extraversion': 'Ekstraversi',
    'Agreeableness': 'Keramahan',
    'Neuroticism': 'Stabilitas Emosi',

    // DISC dimensions
    'Dominance': 'Dominansi',
    'Influence': 'Pengaruh',
    'Steadiness': 'Kestabilan',
    'Compliance': 'Kepatuhan',

    // RIASEC dimensions
    'Realistic': 'Realistis',
    'Investigative': 'Investigatif',
    'Artistic': 'Artistik',
    'Social': 'Sosial',
    'Enterprising': 'Wirausaha',
    'Conventional': 'Konvensional',

    // AQ dimensions
    'Control': 'Kendali',
    'Origin': 'Asal Masalah',
    'Ownership': 'Kepemilikan',
    'Reach': 'Jangkauan',
    'Endurance': 'Daya Tahan',

    // Common
    'Total': 'Total'
}

export default function CandidatePDFButton({
    candidateName,
    candidateEmail,
    scores
}: CandidatePDFButtonProps) {
    const [loading, setLoading] = useState(false)

    // Group scores by assessment
    const scoresByAssessment: Record<string, ScoreData[]> = {}
    for (const score of scores) {
        const code = score.assessment_code
        if (!scoresByAssessment[code]) {
            scoresByAssessment[code] = []
        }
        scoresByAssessment[code].push(score)
    }

    // Calculate overall average
    const totalScores = scores.filter(s => s.dimension === 'Total').map(s => s.normalized_score)
    const overallScore = totalScores.length > 0
        ? Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length)
        : 0

    const generatePDF = async () => {
        setLoading(true)

        try {
            const doc = new jsPDF()
            const pageWidth = doc.internal.pageSize.getWidth()

            // Colors
            const primaryColor: [number, number, number] = [37, 99, 235] // blue-600
            const textColor: [number, number, number] = [30, 41, 59]
            const mutedColor: [number, number, number] = [100, 116, 139]
            const successColor: [number, number, number] = [22, 163, 74] // green-600
            const warningColor: [number, number, number] = [202, 138, 4] // yellow-600
            const dangerColor: [number, number, number] = [220, 38, 38] // red-600

            let yPos = 20

            // Header
            doc.setFillColor(...primaryColor)
            doc.rect(0, 0, pageWidth, 45, 'F')

            // Try to add logo
            try {
                const logoResponse = await fetch('/logo.jpg')
                const logoBlob = await logoResponse.blob()
                const logoBase64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result as string)
                    reader.readAsDataURL(logoBlob)
                })
                doc.addImage(logoBase64, 'JPEG', 15, 8, 28, 28)
            } catch {
                // Logo failed to load, continue without it
            }

            doc.setTextColor(255, 255, 255)
            doc.setFontSize(20)
            doc.setFont('helvetica', 'bold')
            doc.text('Humania TalentMap', 48, 23)

            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text('Laporan Hasil Assessment', 48, 33)

            doc.setFontSize(9)
            doc.text(`${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - 20, 33, { align: 'right' })

            yPos = 60

            // Candidate Info - Fix: Show name properly, only show email once
            doc.setFillColor(248, 250, 252)
            doc.roundedRect(15, yPos - 5, pageWidth - 30, 35, 3, 3, 'F')

            doc.setTextColor(...textColor)
            doc.setFontSize(16)
            doc.setFont('helvetica', 'bold')

            // If candidateName is same as email or empty, show "Kandidat" as title
            const displayName = (candidateName && candidateName !== candidateEmail)
                ? candidateName
                : 'Kandidat'
            doc.text(displayName, 20, yPos + 8)

            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(...mutedColor)
            doc.text(candidateEmail, 20, yPos + 18)

            // Score badge
            doc.setFillColor(...primaryColor)
            doc.roundedRect(pageWidth - 55, yPos - 2, 40, 28, 3, 3, 'F')
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(20)
            doc.setFont('helvetica', 'bold')
            doc.text(overallScore.toString(), pageWidth - 35, yPos + 12, { align: 'center' })
            doc.setFontSize(6)
            doc.text('SKOR RATA-RATA', pageWidth - 35, yPos + 20, { align: 'center' })

            yPos += 45

            // Scores by Module
            for (const [moduleCode, moduleScores] of Object.entries(scoresByAssessment)) {
                const title = moduleScores[0]?.assessment_title || moduleCode
                const totalScore = moduleScores.find(s => s.dimension === 'Total')
                const dimensionScores = moduleScores.filter(s => s.dimension !== 'Total')

                if (yPos > 250) {
                    doc.addPage()
                    yPos = 20
                }

                // Module header
                doc.setFillColor(248, 250, 252)
                doc.roundedRect(15, yPos - 3, pageWidth - 30, 18, 2, 2, 'F')

                doc.setTextColor(...primaryColor)
                doc.setFontSize(9)
                doc.setFont('helvetica', 'bold')
                doc.text(moduleCode, 20, yPos + 7)

                doc.setTextColor(...textColor)
                doc.setFontSize(12)
                doc.text(title, 50, yPos + 7)

                if (totalScore) {
                    doc.setFontSize(14)
                    doc.text(`${totalScore.normalized_score}/100`, pageWidth - 20, yPos + 7, { align: 'right' })
                }

                yPos += 22

                // Table data with translations and colored categories
                const tableData = dimensionScores.map(score => {
                    const translatedDimension = dimensionTranslations[score.dimension] || score.dimension
                    const { label, color } = getCategoryInfo(score.normalized_score)
                    return [translatedDimension, score.normalized_score.toString(), label]
                })

                autoTable(doc, {
                    startY: yPos,
                    head: [['Dimensi', 'Skor', 'Kategori']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: {
                        fillColor: primaryColor,
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        fontSize: 9
                    },
                    bodyStyles: {
                        fontSize: 9,
                        textColor: textColor
                    },
                    columnStyles: {
                        0: { cellWidth: 80 },
                        1: { cellWidth: 30, halign: 'center' },
                        2: { cellWidth: 40, halign: 'center' }
                    },
                    margin: { left: 15, right: 15 },
                    didParseCell: function (data) {
                        // Color the category column
                        if (data.section === 'body' && data.column.index === 2) {
                            const cellText = data.cell.raw as string
                            if (cellText === 'Tinggi') {
                                data.cell.styles.textColor = successColor
                                data.cell.styles.fontStyle = 'bold'
                            } else if (cellText === 'Sedang') {
                                data.cell.styles.textColor = warningColor
                                data.cell.styles.fontStyle = 'bold'
                            } else if (cellText === 'Rendah') {
                                data.cell.styles.textColor = dangerColor
                                data.cell.styles.fontStyle = 'bold'
                            }
                        }
                    }
                })

                yPos = (doc as any).lastAutoTable.finalY + 15
            }

            // Disclaimer
            if (yPos > 240) {
                doc.addPage()
                yPos = 20
            }

            doc.setFillColor(254, 252, 232)
            doc.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'F')

            doc.setTextColor(180, 83, 9)
            doc.setFontSize(8)
            doc.setFont('helvetica', 'bold')
            doc.text('CATATAN PENTING', 20, yPos + 8)

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(7)
            const disclaimerText = 'Hasil assessment ini bersifat indikatif dan merupakan gambaran karakteristik psikologis berdasarkan respons yang diberikan. Hasil ini bukan diagnosis klinis dan sebaiknya digunakan sebagai salah satu pertimbangan, bukan satu-satunya dasar pengambilan keputusan.'
            const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 50)
            doc.text(splitDisclaimer, 20, yPos + 16)

            // Footer
            const pageCount = doc.internal.pages.length - 1
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.setFontSize(8)
                doc.setTextColor(...mutedColor)
                doc.text(`Humania TalentMap | Halaman ${i} dari ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })
            }

            // Generate filename with sanitized name
            const safeName = displayName.replace(/[^a-zA-Z0-9]/g, '_')
            doc.save(`Laporan_Assessment_${safeName}.pdf`)

        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Gagal membuat PDF. Silakan coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    if (scores.length === 0) {
        return null
    }

    return (
        <button
            onClick={generatePDF}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50 transition shadow-lg shadow-blue-600/20"
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Membuat PDF...
                </>
            ) : (
                <>
                    <Download className="w-4 h-4" />
                    Download Laporan PDF
                </>
            )}
        </button>
    )
}

function getCategoryInfo(score: number): { label: string; color: [number, number, number] } {
    if (score >= 71) return { label: 'Tinggi', color: [22, 163, 74] }
    if (score >= 41) return { label: 'Sedang', color: [202, 138, 4] }
    return { label: 'Rendah', color: [220, 38, 38] }
}
