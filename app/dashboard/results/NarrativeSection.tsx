'use client'

import { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp, Lightbulb, Target, MessageSquare, Loader2, Wand2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NarrativeResult {
    summary: string
    strengths: string[]
    developmentAreas: string[]
    recommendations: string[]
    interviewSuggestions: string[]
}

export default function NarrativeSection() {
    const [narrative, setNarrative] = useState<NarrativeResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [expanded, setExpanded] = useState(true)

    const generateNarrative = async () => {
        setLoading(true)
        setError(null)
        setExpanded(true)

        try {
            const response = await fetch('/api/narrative', {
                method: 'POST',
            })

            if (!response.ok) {
                throw new Error('Failed to generate narrative')
            }

            const data = await response.json()
            setNarrative(data)
        } catch (err) {
            setError('Gagal menghasilkan analisis AI. Silakan coba lagi.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    if (!narrative && !loading) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-primary/5 to-blue-50 border-2 border-dashed border-primary/30 rounded-2xl p-10 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                onClick={generateNarrative}
            >
                <div className="flex flex-col items-center justify-center text-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <Wand2 className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-slate-800 mb-2">Dapatkan Insight AI</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Generate analisis komprehensif, temukan kekuatan tersembunyi, dan dapatkan pertanyaan wawancara yang dipersonalisasi.
                        </p>
                    </div>
                    <button
                        className="mt-4 px-6 py-3 btn-primary rounded-xl font-bold flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generate Analisis
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            </motion.div>
        )
    }

    if (loading) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[300px] shadow-sm">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <h3 className="mt-6 font-bold text-xl text-slate-800">Menganalisis Profil...</h3>
                <p className="text-slate-500 mt-2">AI sedang menyusun interpretasi komprehensif</p>

                <div className="w-64 h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-primary w-1/2 animate-pulse rounded-full"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition duration-200 group"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-xl text-slate-800 group-hover:text-primary transition-colors">Hasil Analisis AI</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Dihasilkan oleh Gemini AI
                        </p>
                    </div>
                </div>
                {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            {/* Content */}
            <AnimatePresence>
                {expanded && narrative && (
                    <motion.div
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        variants={container}
                        className="px-8 pb-8 space-y-6"
                    >
                        {/* Summary */}
                        <motion.div variants={item} className="bg-slate-50 border border-slate-100 rounded-xl p-6">
                            <h4 className="font-bold mb-3 flex items-center gap-2 text-slate-800">
                                <Target className="w-5 h-5 text-primary" />
                                Ringkasan Profil
                            </h4>
                            <p className="text-slate-600 leading-relaxed">{narrative.summary}</p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <motion.div variants={item} className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-emerald-700">
                                    <Lightbulb className="w-5 h-5" />
                                    Kekuatan Utama
                                </h4>
                                <ul className="space-y-3">
                                    {narrative.strengths.map((s, i) => (
                                        <motion.li key={i} variants={item} className="flex items-start gap-3 text-emerald-800 bg-white p-3 rounded-lg border border-emerald-100">
                                            <span className="text-emerald-500 mt-0.5 font-bold">✓</span>
                                            {s}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Development Areas */}
                            <motion.div variants={item} className="bg-amber-50 border border-amber-100 rounded-xl p-6">
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-amber-700">
                                    <Target className="w-5 h-5" />
                                    Area Pengembangan
                                </h4>
                                <ul className="space-y-3">
                                    {narrative.developmentAreas.map((d, i) => (
                                        <motion.li key={i} variants={item} className="flex items-start gap-3 text-amber-800 bg-white p-3 rounded-lg border border-amber-100">
                                            <span className="text-amber-500 mt-0.5 font-bold">→</span>
                                            {d}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        {/* Recommendations */}
                        <motion.div variants={item} className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-700">
                                <Target className="w-5 h-5" />
                                Rekomendasi Posisi
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {narrative.recommendations.map((r, i) => (
                                    <motion.span
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        className="px-4 py-2 bg-white text-blue-700 border border-blue-200 rounded-full text-sm font-semibold hover:bg-blue-100 transition-colors cursor-default"
                                    >
                                        {r}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Interview Suggestions */}
                        <motion.div variants={item} className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                            <h4 className="font-bold mb-4 flex items-center gap-2 text-purple-700">
                                <MessageSquare className="w-5 h-5" />
                                Panduan Wawancara
                            </h4>
                            <ul className="space-y-3">
                                {narrative.interviewSuggestions.map((q, i) => (
                                    <motion.li key={i} variants={item} className="text-purple-800 flex items-start gap-3 p-3 hover:bg-white rounded-lg transition-colors">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                        <span>"{q}"</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Regenerate button */}
                        <motion.div variants={item} className="text-center pt-4">
                            <button
                                onClick={generateNarrative}
                                className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto font-medium"
                            >
                                <Sparkles className="w-4 h-4" />
                                Regenerate Analisis
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
