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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.01 }}
                className="glass-panel rounded-2xl p-8 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group cursor-pointer relative overflow-hidden"
                onClick={generateNarrative}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex flex-col items-center justify-center text-center gap-4 relative z-10">
                    <div className="p-4 bg-primary/20 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                        <Wand2 className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-white mb-2">Unlock AI Insights</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Generate comprehensive analysis, uncover hidden strengths, and get tailored interview questions using Gemini AI.
                        </p>
                    </div>
                    <button
                        className="mt-4 px-6 py-3 btn-primary rounded-xl font-bold flex items-center gap-2 group-hover:shadow-primary/40 transition-all"
                    >
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                        Generate Analysis
                    </button>
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </div>
            </motion.div>
        )
    }

    if (loading) {
        return (
            <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                    <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                </div>
                <h3 className="mt-8 font-bold text-xl text-white animate-pulse">Analyzing Profile...</h3>
                <p className="text-muted-foreground mt-2">Connecting to Gemini AI Neural Network</p>

                <div className="w-64 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent w-1/3 animate-[shimmer_1s_infinite_linear]"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition duration-300 group"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-white/5 shadow-inner">
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors">AI Analysis Result</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Generated by Gemini 2.5 Flash
                        </p>
                    </div>
                </div>
                {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
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
                        <motion.div variants={item} className="glass-card rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent" />
                            <h4 className="font-bold mb-3 flex items-center gap-2 text-white">
                                <Target className="w-5 h-5 text-primary" />
                                Executive Summary
                            </h4>
                            <p className="text-gray-300 leading-relaxed text-base">{narrative.summary}</p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <motion.div variants={item} className="glass-card rounded-xl p-6 border-l-4 border-l-emerald-500/50">
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-emerald-400">
                                    <Lightbulb className="w-5 h-5" />
                                    Key Strengths
                                </h4>
                                <ul className="space-y-3">
                                    {narrative.strengths.map((s, i) => (
                                        <motion.li key={i} variants={item} className="flex items-start gap-3 text-gray-300 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                                            <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                                            {s}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Development Areas */}
                            <motion.div variants={item} className="glass-card rounded-xl p-6 border-l-4 border-l-amber-500/50">
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-amber-400">
                                    <Target className="w-5 h-5" />
                                    Development Focus
                                </h4>
                                <ul className="space-y-3">
                                    {narrative.developmentAreas.map((d, i) => (
                                        <motion.li key={i} variants={item} className="flex items-start gap-3 text-gray-300 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                                            <span className="text-amber-400 mt-0.5 font-bold">→</span>
                                            {d}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        {/* Recommendations */}
                        <motion.div variants={item} className="glass-card rounded-xl p-6">
                            <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400">
                                <Target className="w-5 h-5" />
                                Recommended Roles
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {narrative.recommendations.map((r, i) => (
                                    <motion.span
                                        key={i}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        className="px-4 py-2 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-sm font-medium hover:bg-blue-500/20 hover:border-blue-400 transition-all cursor-default shadow-lg shadow-blue-900/10"
                                    >
                                        {r}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Interview Suggestions */}
                        <motion.div variants={item} className="glass-card rounded-xl p-6 border-t-4 border-t-purple-500/50">
                            <h4 className="font-bold mb-4 flex items-center gap-2 text-purple-400">
                                <MessageSquare className="w-5 h-5" />
                                Interview Guide
                            </h4>
                            <ul className="space-y-3">
                                {narrative.interviewSuggestions.map((q, i) => (
                                    <motion.li key={i} variants={item} className="text-gray-300 flex items-start gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                                        <span className="italic">"{q}"</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Regenerate button */}
                        <motion.div variants={item} className="text-center pt-4">
                            <button
                                onClick={generateNarrative}
                                className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                            >
                                <Sparkles className="w-4 h-4" />
                                Regenerate Analysis
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    )
}
