import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowRight, Clock, Brain, Heart, Target, Lightbulb, Sparkles } from 'lucide-react'
import { Assessment } from '@/types/database'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch assessments
    const { data: assessments, error } = await supabase
        .from('assessments')
        .select('*')
        .order('code') as { data: Assessment[] | null, error: any }

    if (error) {
        console.error('Error fetching assessments', error)
    }

    // Fetch user profile
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .single()

    const firstName = profile?.full_name?.split(' ')[0] || 'User'

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-blue-600 font-semibold text-sm mb-1">👋 Selamat Datang,</p>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">{firstName}!</h1>
                        <p className="text-slate-500 mt-2 max-w-lg">
                            Selesaikan modul-modul assessment berikut untuk mengetahui potensi dan profil kepribadian Anda.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">{assessments?.length || 0} Modul</span>
                    </div>
                </div>
            </div>

            {/* Assessment Grid */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {assessments?.map((test) => (
                    <AssessmentCard key={test.id} assessment={test} />
                ))}

                {(!assessments || assessments.length === 0) && (
                    <div className="col-span-full p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                        <p className="text-slate-500">Belum ada assessment yang tersedia.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function AssessmentCard({ assessment }: { assessment: Assessment }) {
    const typeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        'cognitive': {
            label: 'Kemampuan Kognitif',
            color: 'bg-purple-100 text-purple-700',
            icon: <Brain className="w-4 h-4" />
        },
        'personality': {
            label: 'Profil Kepribadian',
            color: 'bg-pink-100 text-pink-700',
            icon: <Heart className="w-4 h-4" />
        },
        'attitude': {
            label: 'Sikap Kerja',
            color: 'bg-amber-100 text-amber-700',
            icon: <Target className="w-4 h-4" />
        },
        'interest': {
            label: 'Minat Karir',
            color: 'bg-emerald-100 text-emerald-700',
            icon: <Lightbulb className="w-4 h-4" />
        }
    }

    const config = typeConfig[assessment.type] || {
        label: assessment.type,
        color: 'bg-slate-100 text-slate-700',
        icon: <Sparkles className="w-4 h-4" />
    }

    return (
        <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-200 hover:-translate-y-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {assessment.code}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {assessment.duration_minutes > 0 ? `${assessment.duration_minutes} menit` : 'Tidak dibatasi'}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {assessment.title}
                </h3>
                <div className={`inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-md text-xs font-semibold ${config.color}`}>
                    {config.icon}
                    {config.label}
                </div>
                <p className="mt-3 text-sm text-slate-500 line-clamp-2">
                    {assessment.description}
                </p>
            </div>

            {/* Action */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                    href={`/assessment/${assessment.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/20"
                >
                    Mulai Tes <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
