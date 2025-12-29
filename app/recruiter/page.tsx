import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { UserPlus, Users, Clock, CheckCircle, Mail } from 'lucide-react'

export default async function RecruiterDashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Service client to bypass RLS for counting
    const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get organization
    const { data: organization } = await supabase
        .from('organizations')
        .select('*')
        .eq('recruiter_id', user?.id)
        .single()

    // Count invitations
    const { count: totalInvitations } = await serviceClient
        .from('invitations')
        .select('*', { count: 'exact', head: true })
        .eq('recruiter_id', user?.id)

    const { count: pendingInvitations } = await serviceClient
        .from('invitations')
        .select('*', { count: 'exact', head: true })
        .eq('recruiter_id', user?.id)
        .eq('status', 'pending')

    const { count: acceptedInvitations } = await serviceClient
        .from('invitations')
        .select('*', { count: 'exact', head: true })
        .eq('recruiter_id', user?.id)
        .eq('status', 'accepted')

    // Count candidates who completed assessments
    const { data: candidateProfiles } = await serviceClient
        .from('profiles')
        .select('id')
        .eq('invited_by', user?.id)

    const candidateIds = candidateProfiles?.map(p => p.id) || []

    let completedCount = 0
    if (candidateIds.length > 0) {
        const { data: sessions } = await serviceClient
            .from('assessment_sessions')
            .select('user_id')
            .in('user_id', candidateIds)
            .eq('status', 'completed')

        const uniqueCompleted = new Set(sessions?.map(s => s.user_id) || [])
        completedCount = uniqueCompleted.size
    }

    // Recent invitations
    const { data: recentInvitations } = await supabase
        .from('invitations')
        .select('*')
        .eq('recruiter_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="space-y-5 md:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Dashboard Recruiter</h1>
                    <p className="text-slate-500 text-sm md:text-base mt-1">Kelola kandidat dan lihat hasil assessment.</p>
                </div>
                <Link href="/recruiter/invite" className="hidden sm:flex px-4 py-2 md:px-5 md:py-2.5 bg-blue-600 text-white rounded-xl items-center gap-2 font-medium text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                    <UserPlus className="w-4 h-4" /> Invite Kandidat
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center text-blue-600">
                            <Mail className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-slate-500">Total Undangan</p>
                            <p className="text-xl md:text-3xl font-bold text-slate-800">{totalInvitations || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-lg md:rounded-xl flex items-center justify-center text-amber-600">
                            <Clock className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-slate-500">Menunggu</p>
                            <p className="text-xl md:text-3xl font-bold text-slate-800">{pendingInvitations || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center text-blue-600">
                            <Users className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-slate-500">Terdaftar</p>
                            <p className="text-xl md:text-3xl font-bold text-slate-800">{acceptedInvitations || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center text-green-600">
                            <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-slate-500">Selesai Tes</p>
                            <p className="text-xl md:text-3xl font-bold text-slate-800">{completedCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <Link href="/recruiter/invite" className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <h3 className="font-bold text-sm md:text-lg text-slate-800">Invite Kandidat</h3>
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm hidden md:block">Undang kandidat baru untuk mengerjakan assessment.</p>
                </Link>
                <Link href="/recruiter/candidates" className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Users className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <h3 className="font-bold text-sm md:text-lg text-slate-800">Lihat Kandidat</h3>
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm hidden md:block">Lihat daftar kandidat dan hasil assessment mereka.</p>
                </Link>
            </div>

            {/* Recent Invitations */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-800">Undangan Terbaru</h3>
                    <Link href="/recruiter/invite" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Lihat Semua →
                    </Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {recentInvitations?.map((inv) => (
                        <div key={inv.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50 transition">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                    {inv.candidate_name?.[0]?.toUpperCase() || inv.email[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{inv.candidate_name || inv.email}</p>
                                    <p className="text-sm text-slate-500">{inv.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${inv.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                    inv.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                        'bg-slate-100 text-slate-500'
                                    }`}>
                                    {inv.status === 'pending' ? 'Menunggu' : inv.status === 'accepted' ? 'Terdaftar' : 'Expired'}
                                </span>
                            </div>
                        </div>
                    ))}

                    {(!recentInvitations || recentInvitations.length === 0) && (
                        <div className="p-12 text-center text-slate-400">
                            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Belum ada undangan yang dikirim.</p>
                            <Link href="/recruiter/invite" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                                Invite Kandidat Pertama →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
