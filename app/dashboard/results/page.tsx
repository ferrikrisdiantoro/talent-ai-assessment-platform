import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BarChart3, AlertTriangle, CheckCircle, TrendingUp, Layers } from 'lucide-react'
import { DISCLAIMER_TEXT } from '@/lib/dimensions'
import NarrativeSection from './NarrativeSection'

// Type for score with assessment info
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

export default async function ResultsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch all scores for this user with assessment info
    const { data: scores, error } = await supabase
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching scores:', error)
    }

    // Group scores by assessment
    const scoresByAssessment: Record<string, ScoreWithAssessment[]> = {}

    if (scores) {
        for (const score of scores) {
            // Handle Supabase's relation format (could be array or object)
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

    return (
        <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-3 glass-panel rounded-full hover:bg-white/10 transition group">
                    <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-white" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Assessment Results</h1>
                    <p className="text-muted-foreground mt-1">Detailed analysis of your psychometric profile.</p>
                </div>
            </div>

            {!hasScores ? (
                <div className="glass-panel rounded-2xl p-16 text-center border-dashed border-2 border-white/10">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BarChart3 className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Results Yet</h3>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                        Your assessment journey begins here. Complete a module to generate your professional profile.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 btn-primary rounded-xl font-bold hover:brightness-110 transition shadow-lg shadow-primary/25"
                    >
                        Start Assessment
                    </Link>
                </div>
            ) : (
                <>
                    {/* AI Narrative Section */}
                    {/* Placed at top for "Executive Summary" first feel */}
                    <NarrativeSection />

                    {/* Scores by Module */}
                    <div className="grid gap-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-4 ml-1">
                            <Layers className="w-5 h-5 text-primary" />
                            Detailed Dimensions
                        </h2>

                        {Object.entries(scoresByAssessment).map(([moduleCode, moduleScores], index) => {
                            const assessment = moduleScores[0]?.assessments
                            const totalScore = moduleScores.find(s => s.dimension === 'Total')
                            const dimensionScores = moduleScores.filter(s => s.dimension !== 'Total')

                            return (
                                <div
                                    key={moduleCode}
                                    className="glass-panel rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    {/* Module Header */}
                                    <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex flex-wrap justify-between items-center gap-4">
                                        <div>
                                            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                                {moduleCode}
                                            </span>
                                            <h3 className="font-bold text-xl text-white mt-2">
                                                {assessment?.title || moduleCode}
                                            </h3>
                                        </div>
                                        {totalScore && (
                                            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                                <div className="text-right">
                                                    <div className="text-xs text-muted-foreground font-medium uppercase">Overall Score</div>
                                                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                                        {totalScore.normalized_score}<span className="text-sm text-muted-foreground ml-1">/100</span>
                                                    </div>
                                                </div>
                                                <CategoryBadge category={totalScore.category} size="lg" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Dimension Scores */}
                                    <div className="p-8">
                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {dimensionScores.map((score, idx) => (
                                                <div
                                                    key={score.id}
                                                    className="glass-card rounded-xl p-5 group"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="font-medium text-white/90 group-hover:text-white transition-colors">{score.dimension}</span>
                                                        <CategoryBadge category={score.category} size="sm" />
                                                    </div>

                                                    <div className="flex items-end gap-2 mb-3">
                                                        <span className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left duration-300">{score.normalized_score}</span>
                                                    </div>

                                                    {/* Custom Progress bar */}
                                                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-125 shadow-[0_0_10px_rgba(0,0,0,0.3)] ${getCategoryGradient(score.category)}`}
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
                    <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                            <div className="text-sm text-amber-100/80 whitespace-pre-line leading-relaxed">
                                {DISCLAIMER_TEXT}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

function CategoryBadge({ category, size = 'md' }: { category: string; size?: 'sm' | 'md' | 'lg' }) {
    const styles = {
        Low: 'bg-red-500/10 text-red-300 border-red-500/20 shadow-red-900/20',
        Medium: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20 shadow-yellow-900/20',
        High: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-emerald-900/20',
    }

    let sizeClasses = 'text-xs px-2 py-1'
    if (size === 'sm') sizeClasses = 'text-[10px] px-1.5 py-0.5'
    if (size === 'lg') sizeClasses = 'text-sm px-3 py-1.5'

    return (
        <span className={`${styles[category as keyof typeof styles] || 'bg-gray-500/10 text-gray-300'} ${sizeClasses} rounded-lg border font-bold uppercase tracking-wider shadow-inner backdrop-blur-md`}>
            {category}
        </span>
    )
}

function getCategoryGradient(category: string): string {
    switch (category) {
        case 'Low': return 'bg-gradient-to-r from-red-600 to-red-400'
        case 'Medium': return 'bg-gradient-to-r from-yellow-600 to-yellow-400'
        case 'High': return 'bg-gradient-to-r from-emerald-600 to-emerald-400'
        default: return 'bg-gradient-to-r from-slate-600 to-slate-400'
    }
}
