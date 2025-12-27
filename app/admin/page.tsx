import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Users, FileText } from 'lucide-react'
import DeleteAssessmentButton from './DeleteAssessmentButton'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Service client for admin operations (bypasses RLS)
    const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch assessments
    const { data: assessments } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false })

    // Fetch candidate count (needs service client to bypass RLS)
    const { count: candidateCount } = await serviceClient
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'candidate')

    // Fetch completed assessments count - count unique user_id entries in scores
    // This counts how many users have at least one score (meaning they completed at least one module)
    const { data: completedData } = await serviceClient
        .from('scores')
        .select('user_id')

    // Count unique users who have completed assessments
    const uniqueUsers = new Set(completedData?.map(s => s.user_id) || [])
    const completedCount = uniqueUsers.size

    return (
        <div className="space-y-5 md:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Dashboard Admin</h1>
                    <p className="text-slate-500 text-sm md:text-base mt-1">Kelola assessment dan lihat hasil kandidat.</p>
                </div>
                <Link href="/admin/assessments/new" className="hidden sm:flex px-4 py-2 md:px-5 md:py-2.5 btn-primary rounded-xl items-center gap-2 font-medium text-sm">
                    <Plus className="w-4 h-4" /> Buat Assessment
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 md:gap-6">
                <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center text-primary">
                            <Users className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-slate-500">Total Kandidat</p>
                            <p className="text-xl md:text-3xl font-bold text-slate-800">{candidateCount || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600">
                            <FileText className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-slate-500">Assessment Selesai</p>
                            <p className="text-xl md:text-3xl font-bold text-slate-800">{completedCount || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center text-purple-600">
                            <FileText className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-slate-500">Modul Aktif</p>
                            <p className="text-xl md:text-3xl font-bold text-slate-800">{assessments?.length || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <Link href="/admin/candidates" className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Users className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <h3 className="font-bold text-sm md:text-lg text-slate-800">Lihat Kandidat</h3>
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm hidden md:block">Lihat daftar kandidat, hasil tes, dan ranking.</p>
                </Link>
                <Link href="/admin/assessments/new" className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <h3 className="font-bold text-sm md:text-lg text-slate-800">Buat Assessment</h3>
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm hidden md:block">Tambahkan modul tes baru dengan pertanyaan.</p>
                </Link>
            </div>

            {/* Active Modules */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-800">Modul Assessment Aktif</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {assessments?.map((asm) => (
                        <div key={asm.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">{asm.code}</span>
                                    <h4 className="font-semibold text-slate-800">{asm.title}</h4>
                                </div>
                                <p className="text-sm text-slate-500 mt-1 max-w-xl truncate">{asm.description}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-400 capitalize bg-slate-100 px-2 py-1 rounded">{asm.type}</span>
                                <span className="text-slate-400">{asm.duration_minutes} menit</span>
                                <Link href={`/admin/assessments/${asm.id}/edit`} className="text-primary hover:underline font-medium">Edit</Link>
                                <DeleteAssessmentButton assessmentId={asm.id} assessmentTitle={asm.title} />
                            </div>
                        </div>
                    ))}

                    {(!assessments || assessments.length === 0) && (
                        <div className="p-12 text-center text-slate-400">
                            Belum ada assessment yang dibuat.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
