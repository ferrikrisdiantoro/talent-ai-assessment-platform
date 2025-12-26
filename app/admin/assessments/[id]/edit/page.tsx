'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, Save, Clock, FileText, Tag, Type } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/Toast'

interface Assessment {
    id: string
    code: string
    title: string
    description: string
    type: string
    duration_minutes: number
}

export default function EditAssessmentPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState<Assessment>({
        id: '',
        code: '',
        title: '',
        description: '',
        type: 'cognitive',
        duration_minutes: 0
    })

    useEffect(() => {
        const fetchAssessment = async () => {
            const { data, error } = await supabase
                .from('assessments')
                .select('*')
                .eq('id', id)
                .single()

            if (data) {
                setForm(data)
            }
            setLoading(false)
        }
        fetchAssessment()
    }, [id])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const { error } = await supabase
            .from('assessments')
            .update({
                title: form.title,
                description: form.description,
                type: form.type,
                duration_minutes: form.duration_minutes
            })
            .eq('id', id)

        if (error) {
            toast.error('Gagal menyimpan: ' + error.message)
        } else {
            toast.success('Perubahan berhasil disimpan!')
            router.push('/admin')
        }
        setSaving(false)
    }

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
    )

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin" className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition group shadow-sm">
                    <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-primary" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Edit Assessment</h1>
                    <p className="text-slate-500">Ubah detail modul assessment</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                    {/* Code (Read-only) */}
                    <div>
                        <label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-500 mb-2">
                            <Tag className="w-4 h-4" />
                            Kode Modul
                        </label>
                        <input
                            type="text"
                            value={form.code}
                            disabled
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm text-slate-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-400 mt-1">Kode modul tidak bisa diubah</p>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-500 mb-2">
                            <FileText className="w-4 h-4" />
                            Judul Assessment
                        </label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            placeholder="cth: Tes Kepribadian Big Five"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-2 block">Deskripsi</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none"
                            placeholder="Deskripsi singkat tentang assessment ini..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Type */}
                        <div>
                            <label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-500 mb-2">
                                <Type className="w-4 h-4" />
                                Tipe Assessment
                            </label>
                            <select
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            >
                                <option value="cognitive">Cognitive (Kognitif)</option>
                                <option value="personality">Personality (Kepribadian)</option>
                                <option value="attitude">Attitude (Sikap)</option>
                                <option value="interest">Interest (Minat)</option>
                            </select>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-500 mb-2">
                                <Clock className="w-4 h-4" />
                                Durasi (Menit)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.duration_minutes}
                                onChange={e => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                placeholder="0 = Tanpa batas waktu"
                            />
                            <p className="text-xs text-slate-400 mt-1">0 = Tanpa batas waktu</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <Link
                        href={`/admin/assessments/${id}`}
                        className="text-primary hover:underline text-sm font-medium"
                    >
                        Kelola Pertanyaan →
                    </Link>
                    <div className="flex gap-3">
                        <Link
                            href="/admin"
                            className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 btn-primary rounded-xl text-sm font-bold flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
