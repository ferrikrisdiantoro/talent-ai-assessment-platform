'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, ArrowLeft, Tag, FileText, Clock, Type } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/Toast'

export default function CreateAssessmentPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        code: '',
        title: '',
        description: '',
        type: 'cognitive',
        duration_minutes: 0
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { data, error } = await supabase.from('assessments').insert(formData).select().single()

        if (error) {
            toast.error('Gagal membuat assessment: ' + error.message)
        } else if (data) {
            toast.success('Assessment berhasil dibuat!')
            // Redirect to manage questions for the new assessment
            router.push(`/admin/assessments/${data.id}`)
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin" className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition group shadow-sm">
                    <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-primary" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Buat Assessment Baru</h1>
                    <p className="text-slate-500">Buat modul tes baru untuk kandidat.</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 space-y-5 md:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        {/* Code */}
                        <div>
                            <label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-500 mb-2">
                                <Tag className="w-4 h-4" />
                                Kode Modul
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="cth: COG-02"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            />
                            <p className="text-xs text-slate-400 mt-1">Kode unik untuk modul ini</p>
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                value={formData.duration_minutes}
                                onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-slate-400 mt-1">0 = Tanpa batas waktu</p>
                        </div>
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
                            placeholder="cth: Tes Kepribadian Big Five"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-2 block">Deskripsi</label>
                        <textarea
                            rows={3}
                            placeholder="Deskripsi singkat tentang apa yang diukur oleh tes ini..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-500 mb-2">
                            <Type className="w-4 h-4" />
                            Tipe Assessment
                        </label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="cognitive">Cognitive (Kemampuan Kognitif)</option>
                            <option value="personality">Personality (Kepribadian)</option>
                            <option value="attitude">Attitude (Sikap & Integritas)</option>
                            <option value="interest">Interest (Minat Karir)</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-4 md:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <Link
                        href="/admin"
                        className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition text-center"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 btn-primary rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Buat & Tambah Pertanyaan
                    </button>
                </div>
            </form>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-1">💡 Langkah Selanjutnya</h4>
                <p className="text-sm text-blue-700">
                    Setelah membuat assessment, Anda akan diarahkan untuk menambahkan pertanyaan ke modul ini.
                </p>
            </div>
        </div>
    )
}
