import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Users, Mail, Clock, CheckCircle, FileText, ExternalLink, AlertCircle } from 'lucide-react'

export default async function RecruiterCandidatesPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Service client to bypass RLS
    const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all invitations by this recruiter
    const { data: invitations } = await serviceClient
        .from('invitations')
        .select('*')
        .eq('recruiter_id', user?.id)
        .order('created_at', { ascending: false })

    // Get all candidates invited by this recruiter (who have registered)
    const { data: candidates } = await serviceClient
        .from('profiles')
        .select('*, invitations(email)')
        .eq('invited_by', user?.id)
        .order('created_at', { ascending: false })

    // Get completion status for each candidate
    const candidateIds = candidates?.map(c => c.id) || []
    let candidateStatus: Record<string, { completed: boolean; hasReport: boolean }> = {}

    if (candidateIds.length > 0) {
        // Check for completed sessions
        const { data: sessions } = await serviceClient
            .from('assessment_sessions')
            .select('user_id, status')
            .in('user_id', candidateIds)
            .in('status', ['completed']) // Fixed: use .in for better compatibility if needed, though .eq works

        // Check for reports
        const { data: reports } = await serviceClient
            .from('reports')
            .select('user_id')
            .in('user_id', candidateIds)

        candidateIds.forEach(id => {
            const userSessions = sessions?.filter(s => s.user_id === id) || []
            const hasCompletedSession = userSessions.some(s => s.status === 'completed')
            const hasReport = reports?.some(r => r.user_id === id) || false
            candidateStatus[id] = { completed: hasCompletedSession, hasReport }
        })
    }

    // Separate pending invitations (not yet registered)
    const pendingInvitations = invitations?.filter(inv => inv.status === 'pending') || []
    const expiredInvitations = invitations?.filter(inv => {
        const now = new Date()
        const expiresAt = new Date(inv.expires_at)
        return inv.status === 'pending' && expiresAt < now
    }) || []

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Daftar Kandidat</h1>
                <p className="text-slate-500 mt-1">Lihat status dan hasil assessment kandidat Anda.</p>
            </div>

            {/* Registered Candidates */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-lg text-slate-800">Kandidat Terdaftar</h3>
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                            {candidates?.length || 0}
                        </span>
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {candidates?.map((candidate: any) => {
                        const status = candidateStatus[candidate.id]
                        // Get email from invitations join or fallback
                        const candidateEmail = candidate.invitations?.email || '-'

                        return (
                            <div key={candidate.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                                        {candidate.full_name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{candidate.full_name || 'Tanpa Nama'}</p>
                                        <p className="text-sm text-slate-500">{candidateEmail}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 ml-16 md:ml-0">
                                    {status?.completed ? (
                                        <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-green-100 text-green-700">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Selesai
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700">
                                            <Clock className="w-3.5 h-3.5" />
                                            Dalam Proses
                                        </span>
                                    )}
                                    {(status?.completed || status?.hasReport) && (
                                        <Link
                                            href={`/recruiter/candidates/${candidate.id}`}
                                            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            Lihat Hasil
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {(!candidates || candidates.length === 0) && (
                        <div className="p-12 text-center text-slate-400">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Belum ada kandidat yang terdaftar.</p>
                            <p className="text-sm mt-1">Kandidat akan muncul di sini setelah mereka menerima undangan dan mendaftar.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pending Invitations */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-amber-600" />
                        <h3 className="font-bold text-lg text-slate-800">Undangan Menunggu</h3>
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                            {pendingInvitations.length}
                        </span>
                    </div>
                    <Link href="/recruiter/invite" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        + Invite Baru
                    </Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {pendingInvitations.map((inv) => {
                        const isExpired = new Date(inv.expires_at) < new Date()
                        return (
                            <div key={inv.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">
                                        {inv.candidate_name?.[0]?.toUpperCase() || inv.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{inv.candidate_name || 'Belum Diketahui'}</p>
                                        <p className="text-sm text-slate-500">{inv.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 ml-16 md:ml-0">
                                    {isExpired ? (
                                        <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-red-100 text-red-700">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            Expired
                                        </span>
                                    ) : (
                                        <>
                                            <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700">
                                                <Clock className="w-3.5 h-3.5" />
                                                Menunggu
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                Exp: {new Date(inv.expires_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {pendingInvitations.length === 0 && (
                        <div className="p-8 text-center text-slate-400">
                            <p>Tidak ada undangan yang menunggu.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
