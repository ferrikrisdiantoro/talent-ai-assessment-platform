'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, ArrowRight, CheckCircle, Timer } from 'lucide-react'
import { Assessment, Question } from '@/types/database'
import {
    calculateAssessmentScores,
    prepareScoreRows,
    ResponseWithQuestion
} from '@/lib/scoring'

export default function AssessmentRunner({ params }: { params: Promise<{ id: string }> }) {
    // Unwrapping params as Promise is required in newer Next.js versions if treating as async/await logic in component
    // easiest is to use a state or react 'use' hook, but for client component standard useEffect works with unwrapped params if we treat it as props.
    // However, in App Router pages, params is a Promise in recent canary, but usually an object in stable.
    // We will assume standard object for now or handle the promise if it breaks.
    // Actually, let's use a small trick to handle async params if needed, but for 'use client' we usually receive props.

    // NOTE: Next.js 15+ might require `await params`. For safety in this prompt context, I'll use a type that assumes it *might* be a promise but usually standard props in older App Router.
    // Let's just fetch it inside useEffect to be safe against hydration issues.

    const [assessmentId, setAssessmentId] = useState<string | null>(null)
    const [assessment, setAssessment] = useState<Assessment | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [responses, setResponses] = useState<Record<string, any>>({}) // question_id -> value
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Unwrap params safely
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
            // 1. Fetch Assessment Details
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

            // 2. Fetch Questions
            const { data: qData, error: qError } = await supabase
                .from('questions')
                .select('*')
                .eq('assessment_id', assessmentId)
            // .order('created_at') // or default order

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
            // Submit
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
        // In a real app, we would create a session ID first.
        // For MVP, we'll try to get current user and just insert responses directly (assuming session is implicit or we create one now).
        // Let's Create a Session wrapper first.

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Create Session
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
            alert('Failed to start session submission')
            setSubmitting(false)
            return
        }

        // 2. Insert/Update Responses (upsert to handle retakes)
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
            alert('Error saving responses')
            setSubmitting(false)
            return
        }

        // 3. Calculate Scores
        try {
            // Fetch responses with question metadata for scoring
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

            if (fetchError) {
                console.error('Error fetching responses for scoring', fetchError)
            } else if (responsesWithQuestions && assessment) {
                // Transform to ResponseWithQuestion format
                const scoringInput: ResponseWithQuestion[] = responsesWithQuestions.map((r: any) => ({
                    question_id: r.question_id,
                    answer_value: r.answer_value,
                    score_value: r.score_value,
                    question_type: r.questions.type,
                    question_category: r.questions.category,
                    question_options: r.questions.options
                }))

                // Calculate scores
                const scoringResult = calculateAssessmentScores(
                    assessmentId!,
                    assessment.code,
                    scoringInput
                )

                // Prepare and insert/update score rows
                const scoreRows = prepareScoreRows(user.id, assessmentId!, scoringResult)

                const { error: scoreError } = await supabase
                    .from('scores')
                    .upsert(scoreRows, {
                        onConflict: 'user_id,assessment_id,dimension',
                        ignoreDuplicates: false
                    })

                if (scoreError) {
                    console.error('Error saving scores', scoreError)
                    // Don't block redirect, scores can be recalculated
                } else {
                    console.log('Scores saved successfully:', scoringResult)
                }
            }
        } catch (scoringError) {
            console.error('Scoring calculation error:', scoringError)
            // Don't block redirect, scores can be recalculated later
        }

        // 4. Redirect to results page
        router.push('/dashboard/results')
        setSubmitting(false)
    }

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
    }

    if (!assessment || questions.length === 0) {
        return <div className="p-8 text-center">Assessment not found or has no questions.</div>
    }

    const currentQuestion = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100
    const isLast = currentIndex === questions.length - 1

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-800 bg-card p-4 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h2 className="font-bold text-lg">{assessment.title}</h2>
                    <div className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</div>
                </div>
                <div className="flex items-center gap-4">
                    {assessment.duration_minutes > 0 && (
                        <div className="flex items-center gap-2 text-primary font-mono bg-primary/10 px-3 py-1 rounded-full text-sm">
                            <Timer className="w-4 h-4" />
                            <span>{assessment.duration_minutes}:00</span>
                            {/* NOTE: Timer logic to be implemented properly later */}
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-800 w-full">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Question Area */}
            <div className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-12 flex flex-col justify-center">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-2xl md:text-3xl font-medium leading-relaxed">
                        {currentQuestion.text}
                    </h3>

                    <div className="space-y-3">
                        {currentQuestion.type === 'multiple_choice' && (
                            <div className="grid gap-3">
                                {(currentQuestion.options as any[])?.map((opt: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(opt.value)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${responses[currentQuestion.id] === opt.value
                                            ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                            : 'border-gray-700 bg-card hover:border-gray-500'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${responses[currentQuestion.id] === opt.value ? 'border-primary bg-primary text-white' : 'border-gray-500'
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span>{opt.label || opt.text}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {currentQuestion.type === 'likert' && (
                            <div className="flex flex-col md:flex-row justify-between gap-2 mt-8">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handleAnswer(val)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all flex-1 ${responses[currentQuestion.id] === val
                                            ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                            : 'border-gray-700 bg-card hover:border-gray-500'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${responses[currentQuestion.id] === val ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'
                                            }`}>
                                            {val}
                                        </div>
                                        <span className="text-xs text-center text-muted-foreground uppercase">
                                            {val === 1 ? 'Strongly Disagree' : val === 5 ? 'Strongly Agree' : ''}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="border-t border-gray-800 bg-card p-6 flex justify-between max-w-5xl mx-auto w-full">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <ArrowLeft className="w-4 h-4" /> Previous
                </button>

                <button
                    onClick={handleNext}
                    disabled={!responses[currentQuestion.id]}
                    className="flex items-center gap-2 px-8 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary/20"
                >
                    {isLast ? (
                        submitting ? 'Submitting...' : 'Finish Assessment'
                    ) : (
                        <>Next <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </div>
    )
}
