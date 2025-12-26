import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Users, Eye, Trophy, TrendingUp, Search } from 'lucide-react'

interface CandidateWithScores {
    id: string
    full_name: string
    email: string
    created_at: string
    totalScore: number
    completedModules: number
    scores: {
        assessment_code: string
        normalized_score: number
        category: string
    }[]
}

export default async function AdminCandidatesPage() {
    // Create service client for admin operations (bypasses RLS)
    const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch all candidates (users with role 'candidate')
    const { data: candidates } = await serviceClient
        .from('profiles')
        .select('id, full_name, created_at')
        .eq('role', 'candidate')
        .order('created_at', { ascending: false })

    // Fetch auth users for email
    const { data: authUsers } = await serviceClient.auth.admin.listUsers()

    // Fetch all Total scores using service client (bypasses RLS)
    const { data: allScores } = await serviceClient
        .from('scores')
        .select(`
            user_id,
            dimension,
            normalized_score,
            category,
            assessments (code)
        `)
        .eq('dimension', 'Total')

    // Combine data
    const candidatesWithScores: CandidateWithScores[] = (candidates || []).map(candidate => {
        const userEmail = authUsers?.users?.find(u => u.id === candidate.id)?.email || 'N/A'
        const userScores = allScores?.filter(s => s.user_id === candidate.id) || []

        // Calculate average total score across all modules
        const totalScores = userScores.map(s => s.normalized_score)
        const avgScore = totalScores.length > 0
            ? Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length)
            : 0

        return {
            id: candidate.id,
            full_name: candidate.full_name || 'Tanpa Nama',
            email: userEmail,
            created_at: candidate.created_at,
            totalScore: avgScore,
            completedModules: userScores.length,
            scores: userScores.map(s => ({
                assessment_code: (s.assessments as any)?.code || 'N/A',
                normalized_score: s.normalized_score,
                category: s.category
            }))
        }
    })

    // Sort by total score for ranking
    const rankedCandidates = [...candidatesWithScores].sort((a, b) => b.totalScore - a.totalScore)

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Daftar Kandidat</h1>
                    <p className="text-slate-500 text-sm md:text-base mt-1">Lihat semua kandidat dan hasil assessment.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-semibold text-xs md:text-sm flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {candidatesWithScores.length} Kandidat
                    </div>
                </div>
            </div>

            {/* Top 3 Ranking */}
            {rankedCandidates.filter(c => c.completedModules > 0).length >= 3 && (
                <div className="bg-gradient-to-r from-primary/10 to-blue-50 border border-primary/20 rounded-2xl p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Top 3 Kandidat
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {rankedCandidates.slice(0, 3).map((candidate, index) => (
                            <div key={candidate.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative">
                                <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="pl-4">
                                    <p className="font-semibold text-slate-800">{candidate.full_name}</p>
                                    <p className="text-sm text-slate-500">{candidate.completedModules} modul selesai</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-2xl font-bold text-primary">{candidate.totalScore}</span>
                                        <span className="text-sm text-slate-400">skor rata-rata</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Candidates Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-base md:text-lg text-slate-800">Semua Kandidat</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-3 md:px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                                <th className="text-left px-3 md:px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Kandidat</th>
                                <th className="text-left px-3 md:px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Modul</th>
                                <th className="text-left px-3 md:px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Skor</th>
                                <th className="text-left px-3 md:px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-3 md:px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rankedCandidates.map((candidate, index) => (
                                <tr key={candidate.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        {candidate.completedModules > 0 ? (
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                                index === 1 ? 'bg-slate-200 text-slate-600' :
                                                    index === 2 ? 'bg-amber-50 text-amber-600' :
                                                        'bg-slate-100 text-slate-500'
                                                }`}>
                                                {index + 1}
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4">
                                        <div className="max-w-[150px] md:max-w-none">
                                            <p className="font-semibold text-slate-800 text-sm md:text-base">{candidate.full_name}</p>
                                            <p className="text-xs md:text-sm text-slate-500 truncate">{candidate.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-600 font-medium">{candidate.completedModules}</span>
                                        <span className="text-slate-400 text-sm ml-1">selesai</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {candidate.completedModules > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-slate-800">{candidate.totalScore}</span>
                                                <CategoryBadge score={candidate.totalScore} />
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {candidate.completedModules > 0 ? (
                                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                                                Sudah Tes
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-semibold">
                                                Belum Tes
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/candidates/${candidate.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {candidatesWithScores.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                                        Belum ada kandidat yang terdaftar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function CategoryBadge({ score }: { score: number }) {
    let category = 'Low'
    let styles = 'bg-red-100 text-red-700'

    if (score >= 71) {
        category = 'High'
        styles = 'bg-emerald-100 text-emerald-700'
    } else if (score >= 41) {
        category = 'Medium'
        styles = 'bg-amber-100 text-amber-700'
    }

    return (
        <span className={`px-2 py-0.5 ${styles} rounded text-xs font-bold uppercase`}>
            {category}
        </span>
    )
}
