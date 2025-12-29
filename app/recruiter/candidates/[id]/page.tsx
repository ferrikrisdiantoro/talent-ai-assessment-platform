import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Calendar, BarChart3, Layers, AlertTriangle, Brain, Sparkles, Target, MessageSquare, AlertCircle } from 'lucide-react'
import { DISCLAIMER_TEXT } from '@/lib/dimensions'
import GeneratePDFButton from '@/app/admin/candidates/[id]/GeneratePDFButton'
import { createClient as createServiceClient } from '@supabase/supabase-js'

interface ScoreWithAssessment {
    id: string
    dimension: string
    raw_score: number
    normalized_score: number
    category: string
    created_at: string
    assessments: {
        code: string
        title: string
        type: string
    } | null
}

export default async function RecruiterCandidateDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id: candidateId } = await params
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user is a recruiter
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentProfile?.role !== 'recruiter') {
        redirect('/dashboard')
    }

    // Create a service client for operations
    const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch candidate profile and verify they were invited by this recruiter
    const { data: profile } = await serviceClient
        .from('profiles')
        .select('id, full_name, created_at, invited_by')
        .eq('id', candidateId)
        .single()

    if (!profile) {
        notFound()
    }

    // Security check: Only allow viewing candidates invited by this recruiter
    if (profile.invited_by !== user.id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🚫</span>
                    </div>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak</h1>
                    <p className="text-slate-500 mb-6">Anda tidak memiliki akses ke kandidat ini.</p>
                    <Link href="/recruiter/candidates" className="px-6 py-3 bg-emerald-600 text-white rounded-xl inline-block font-medium hover:bg-emerald-700 transition">
                        Kembali ke Daftar Kandidat
                    </Link>
                </div>
            </div>
        )
    }

    // Fetch user email from auth
    const { data: authData } = await serviceClient.auth.admin.getUserById(candidateId)
    const email = authData?.user?.email || 'N/A'

    // Fetch AI report
    const { data: report } = await serviceClient
        .from('reports')
        .select('summary, details')
        .eq('user_id', candidateId)
        .single()

    const narrative = report?.details

    // Fetch all scores for this user
    const { data: scores, error: scoresError } = await serviceClient
        .from('scores')
        .select(`
            id,
            dimension,
            raw_score,
            normalized_score,
            category,
            created_at,
            assessments (
                code,
                title,
                type
            )
        `)
        .eq('user_id', candidateId)
        .order('created_at', { ascending: false })

    if (scoresError) {
        console.error('Error fetching scores:', scoresError)
    }

    // Group scores by assessment
    const scoresByAssessment: Record<string, ScoreWithAssessment[]> = {}

    if (scores) {
        for (const score of scores) {
            const assessmentData = Array.isArray(score.assessments)
                ? score.assessments[0]
                : score.assessments

            const typedScore: ScoreWithAssessment = {
                id: score.id,
                dimension: score.dimension,
                raw_score: score.raw_score,
                normalized_score: score.normalized_score,
                category: score.category,
                created_at: score.created_at,
                assessments: assessmentData || null
            }

            const code = typedScore.assessments?.code || 'Unknown'
            if (!scoresByAssessment[code]) {
                scoresByAssessment[code] = []
            }
            scoresByAssessment[code].push(typedScore)
        }
    }

    const hasScores = Object.keys(scoresByAssessment).length > 0

    // Calculate overall stats
    const allTotalScores = scores?.filter(s => s.dimension === 'Total').map(s => s.normalized_score) || []
    const overallAvg = allTotalScores.length > 0
        ? Math.round(allTotalScores.reduce((a, b) => a + b, 0) / allTotalScores.length)
        : 0

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/recruiter/candidates" className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition group shadow-sm">
                    <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-emerald-600" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">Hasil Assessment</h1>
                    <p className="text-slate-500 mt-1">Detail hasil assessment kandidat.</p>
                </div>
                {hasScores && (
                    <GeneratePDFButton
                        candidateName={profile.full_name || 'Kandidat'}
                        candidateEmail={email}
                        scoresByAssessment={scoresByAssessment}
                        overallScore={overallAvg}
                    />
                )}
            </div>

            {/* Candidate Info Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                            {profile.full_name?.[0]?.toUpperCase() || 'K'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{profile.full_name || 'Tanpa Nama'}</h2>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                <span className="flex items-center gap-1.5">
                                    <Mail className="w-4 h-4" />
                                    {email}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Bergabung {new Date(profile.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {hasScores && (
                        <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100">
                            <div className="text-right">
                                <div className="text-xs text-slate-500 font-medium uppercase">Skor Rata-rata</div>
                                <div className="text-3xl font-bold text-emerald-600">{overallAvg}</div>
                            </div>
                            <CategoryBadge score={overallAvg} size="lg" />
                        </div>
                    )}
                </div>
            </div>

            {/* AI Narrative Section */}
            {narrative && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white flex items-center gap-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                            <Brain className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-slate-800">Analisis AI & Insight</h2>
                            <p className="text-xs text-slate-500">Dibuat otomatis oleh Gemini AI berdasarkan hasil skor.</p>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        {/* Executive Summary */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                Ringkasan Eksekutif
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 leading-relaxed text-sm md:text-base border border-slate-100">
                                {narrative.executiveSummary || narrative.summary}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Strengths */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-emerald-700 flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Kekuatan Utama
                                </h3>
                                <ul className="space-y-3">
                                    {narrative.strengths?.map((strength: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-600 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                                            <span className="flex-shrink-0 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                {i + 1}
                                            </span>
                                            {strength}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Areas for Improvement */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-amber-700 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Area Pengembangan
                                </h3>
                                <ul className="space-y-3">
                                    {narrative.areasForImprovement?.map((area: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                                            <span className="flex-shrink-0 w-5 h-5 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                {i + 1}
                                            </span>
                                            {area}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Interview Questions */}
                        {narrative.interviewQuestions && narrative.interviewQuestions.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="font-bold text-blue-700 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Saran Pertanyaan Wawancara
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {narrative.interviewQuestions.map((q: any, i: number) => (
                                        <div key={i} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                            <p className="font-semibold text-slate-800 text-sm mb-2">"{q.question}"</p>
                                            <p className="text-xs text-slate-500 italic">Target: {q.context}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!hasScores ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BarChart3 className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Belum Ada Hasil</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        Kandidat ini belum menyelesaikan assessment apapun.
                    </p>
                </div>
            ) : (
                <>
                    {/* Scores by Module */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 ml-1">
                            <Layers className="w-5 h-5 text-emerald-600" />
                            Detail Hasil Per Modul
                        </h2>

                        {Object.entries(scoresByAssessment).map(([moduleCode, moduleScores]) => {
                            const assessment = moduleScores[0]?.assessments
                            const totalScore = moduleScores.find(s => s.dimension === 'Total')
                            const dimensionScores = moduleScores.filter(s => s.dimension !== 'Total')

                            return (
                                <div
                                    key={moduleCode}
                                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                                >
                                    {/* Module Header */}
                                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
                                        <div>
                                            <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase bg-emerald-100 px-2 py-1 rounded-md">
                                                {moduleCode}
                                            </span>
                                            <h3 className="font-bold text-xl text-slate-800 mt-2">
                                                {assessment?.title || moduleCode}
                                            </h3>
                                        </div>
                                        {totalScore && (
                                            <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="text-right">
                                                    <div className="text-xs text-slate-500 font-medium uppercase">Skor Total</div>
                                                    <div className="text-2xl font-bold text-slate-800">
                                                        {totalScore.normalized_score}<span className="text-sm text-slate-400 ml-1">/100</span>
                                                    </div>
                                                </div>
                                                <CategoryBadge score={totalScore.normalized_score} size="lg" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Dimension Scores */}
                                    <div className="p-8">
                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {dimensionScores.map((score) => (
                                                <div
                                                    key={score.id}
                                                    className="bg-slate-50 border border-slate-100 rounded-xl p-5 hover:shadow-md hover:border-slate-200 transition-all duration-300 group"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="font-semibold text-slate-700">{score.dimension}</span>
                                                        <CategoryBadge score={score.normalized_score} size="sm" />
                                                    </div>

                                                    <div className="flex items-end gap-2 mb-3">
                                                        <span className="text-3xl font-bold text-slate-800">{score.normalized_score}</span>
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-700 ${getCategoryGradient(score.normalized_score)}`}
                                                            style={{ width: `${score.normalized_score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Disclaimer Section */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <div className="flex gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                            <div className="text-sm text-amber-800 whitespace-pre-line leading-relaxed">
                                {DISCLAIMER_TEXT}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

function CategoryBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
    let category = 'Low'
    let styles = 'bg-red-100 text-red-700 border-red-200'

    if (score >= 71) {
        category = 'High'
        styles = 'bg-emerald-100 text-emerald-700 border-emerald-200'
    } else if (score >= 41) {
        category = 'Medium'
        styles = 'bg-amber-100 text-amber-700 border-amber-200'
    }

    let sizeClasses = 'text-xs px-2.5 py-1'
    if (size === 'sm') sizeClasses = 'text-[10px] px-2 py-0.5'
    if (size === 'lg') sizeClasses = 'text-sm px-3 py-1.5'

    return (
        <span className={`${styles} ${sizeClasses} rounded-lg border font-bold uppercase tracking-wider`}>
            {category}
        </span>
    )
}

function getCategoryGradient(score: number): string {
    if (score >= 71) return 'bg-gradient-to-r from-emerald-500 to-emerald-400'
    if (score >= 41) return 'bg-gradient-to-r from-amber-500 to-amber-400'
    return 'bg-gradient-to-r from-red-500 to-red-400'
}
