'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, ArrowRight, CheckCircle, Timer, Loader2, Home } from 'lucide-react'
import { Assessment, Question } from '@/types/database'
import {
    calculateAssessmentScores,
    prepareScoreRows,
    ResponseWithQuestion
} from '@/lib/scoring'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from '@/components/Toast'

export default function AssessmentRunner({ params }: { params: Promise<{ id: string }> }) {
    const [assessmentId, setAssessmentId] = useState<string | null>(null)
    const [assessment, setAssessment] = useState<Assessment | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [responses, setResponses] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    useEffect(() => {
        const unwrap = async () => {
            const resolvedParams = await params
            setAssessmentId(resolvedParams.id)
        }
        unwrap()
    }, [params])

    useEffect(() => {
        if (!assessmentId) return

        const fetchData = async () => {
            setLoading(true)
            const { data: asmData, error: asmError } = await supabase
                .from('assessments')
                .select('*')
                .eq('id', assessmentId)
                .single()

            if (asmError) {
                console.error('Error fetching assessment', asmError)
                return
            }
            setAssessment(asmData)

            const { data: qData, error: qError } = await supabase
                .from('questions')
                .select('*')
                .eq('assessment_id', assessmentId)

            if (qData) {
                setQuestions(qData)
            }
            setLoading(false)
        }

        fetchData()
    }, [assessmentId])

    const handleAnswer = (value: any) => {
        const currentQ = questions[currentIndex]
        setResponses(prev => ({
            ...prev,
            [currentQ.id]: value
        }))
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            submitResponses()
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    const submitResponses = async () => {
        setSubmitting(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: session, error: sessionError } = await supabase
            .from('assessment_sessions')
            .insert({
                user_id: user.id,
                status: 'completed',
                completed_at: new Date().toISOString()
            })
            .select()
            .single()

        if (sessionError) {
            toast.error('Gagal menyimpan sesi assessment')
            setSubmitting(false)
            return
        }

        const responseRows = Object.entries(responses).map(([qId, value]) => ({
            session_id: session.id,
            user_id: user.id,
            assessment_id: assessmentId,
            question_id: qId,
            answer_value: JSON.stringify(value)
        }))

        const { error: respError } = await supabase
            .from('responses')
            .upsert(responseRows, {
                onConflict: 'user_id,question_id',
                ignoreDuplicates: false
            })

        if (respError) {
            console.error('Error saving responses', respError)
            toast.error('Gagal menyimpan jawaban')
            setSubmitting(false)
            return
        }

        // Calculate Scores
        try {
            const { data: responsesWithQuestions, error: fetchError } = await supabase
                .from('responses')
                .select(`
                    question_id,
                    answer_value,
                    score_value,
                    questions!inner (
                        type,
                        category,
                        options
                    )
                `)
                .eq('session_id', session.id)

            if (!fetchError && responsesWithQuestions && assessment) {
                const scoringInput: ResponseWithQuestion[] = responsesWithQuestions.map((r: any) => ({
                    question_id: r.question_id,
                    answer_value: r.answer_value,
                    score_value: r.score_value,
                    question_type: r.questions.type,
                    question_category: r.questions.category,
                    question_options: r.questions.options
                }))

                const scoringResult = calculateAssessmentScores(
                    assessmentId!,
                    assessment.code,
                    scoringInput
                )

                const scoreRows = prepareScoreRows(user.id, assessmentId!, scoringResult)

                await supabase
                    .from('scores')
                    .upsert(scoreRows, {
                        onConflict: 'user_id,assessment_id,dimension',
                        ignoreDuplicates: false
                    })
            }
        } catch (scoringError) {
            console.error('Scoring calculation error:', scoringError)
        }

        toast.success('Assessment selesai!')
        router.push('/dashboard/results')
        setSubmitting(false)
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">Memuat assessment...</p>
                </div>
            </div>
        )
    }

    if (!assessment || questions.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">Assessment tidak ditemukan atau tidak memiliki pertanyaan.</p>
                    <Link href="/dashboard" className="text-blue-600 font-medium hover:underline">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    const currentQuestion = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100
    const isLast = currentIndex === questions.length - 1

    // Likert labels in Indonesian
    const likertLabels: Record<number, string> = {
        1: 'Sangat Tidak Setuju',
        2: 'Tidak Setuju',
        3: 'Netral',
        4: 'Setuju',
        5: 'Sangat Setuju'
    }

    // Likert colors for visual feedback
    const likertColors: Record<number, string> = {
        1: 'hover:border-red-400 hover:bg-red-50',
        2: 'hover:border-orange-400 hover:bg-orange-50',
        3: 'hover:border-yellow-400 hover:bg-yellow-50',
        4: 'hover:border-lime-400 hover:bg-lime-50',
        5: 'hover:border-emerald-400 hover:bg-emerald-50'
    }

    const likertSelectedColors: Record<number, string> = {
        1: 'border-red-500 bg-red-50 ring-2 ring-red-500/20',
        2: 'border-orange-500 bg-orange-50 ring-2 ring-orange-500/20',
        3: 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-500/20',
        4: 'border-lime-500 bg-lime-50 ring-2 ring-lime-500/20',
        5: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20'
    }

    const likertNumberColors: Record<number, string> = {
        1: 'bg-red-500',
        2: 'bg-orange-500',
        3: 'bg-yellow-500',
        4: 'bg-lime-500',
        5: 'bg-emerald-500'
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-blue-600 text-white sticky top-0 z-50 shadow-lg">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition">
                            <Home className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">{assessment.title}</h2>
                            <div className="text-sm text-blue-200">Pertanyaan {currentIndex + 1} dari {questions.length}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {assessment.duration_minutes > 0 && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
                                <Timer className="w-4 h-4" />
                                <span>{assessment.duration_minutes} menit</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-blue-700/50 w-full">
                    <div
                        className="h-full bg-white transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* Question Area */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-3xl">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Question Number Badge */}
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-6">
                            <span>#{currentIndex + 1}</span>
                            <span className="text-blue-400">•</span>
                            <span className="text-blue-500 font-normal">{currentQuestion.category || 'Pertanyaan'}</span>
                        </div>

                        {/* Question Text */}
                        <h3 className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed mb-8">
                            {currentQuestion.text}
                        </h3>

                        {/* Answer Options */}
                        <div className="space-y-3">
                            {currentQuestion.type === 'multiple_choice' && (
                                <div className="grid gap-3">
                                    {(currentQuestion.options as any[])?.map((opt: any, idx: number) => {
                                        const optionLabel = opt.label || String.fromCharCode(65 + idx)
                                        const isSelected = responses[currentQuestion.id]?.label === optionLabel
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer({ label: optionLabel, value: opt.value })}
                                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                                                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isSelected
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {optionLabel}
                                                    </div>
                                                    <span className="font-medium text-slate-700">{opt.text}</span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}

                            {currentQuestion.type === 'likert' && (
                                <div className="grid grid-cols-5 gap-2 md:gap-3">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => handleAnswer(val)}
                                            className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl border-2 transition-all duration-200 ${responses[currentQuestion.id] === val
                                                ? likertSelectedColors[val]
                                                : `border-slate-200 bg-white ${likertColors[val]}`
                                                }`}
                                        >
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-white text-lg transition-all ${responses[currentQuestion.id] === val
                                                ? likertNumberColors[val]
                                                : 'bg-slate-300'
                                                }`}>
                                                {val}
                                            </div>
                                            <span className="text-[10px] md:text-xs text-center text-slate-600 font-medium leading-tight">
                                                {likertLabels[val]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="bg-white border-t border-slate-200 sticky bottom-0">
                <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition border border-slate-200"
                    >
                        <ArrowLeft className="w-4 h-4" /> Sebelumnya
                    </button>

                    {/* Question Dots (Optional - shows progress) */}
                    <div className="hidden md:flex items-center gap-1.5">
                        {questions.slice(Math.max(0, currentIndex - 3), Math.min(questions.length, currentIndex + 4)).map((q, idx) => {
                            const actualIdx = Math.max(0, currentIndex - 3) + idx
                            return (
                                <div
                                    key={q.id}
                                    className={`w-2 h-2 rounded-full transition-all ${actualIdx === currentIndex
                                        ? 'w-6 bg-blue-600'
                                        : responses[q.id]
                                            ? 'bg-emerald-500'
                                            : 'bg-slate-300'
                                        }`}
                                />
                            )
                        })}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={!responses[currentQuestion.id] || submitting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-600/20"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : isLast ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Selesai
                            </>
                        ) : (
                            <>
                                Selanjutnya <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </footer>
        </div>
    )
}
