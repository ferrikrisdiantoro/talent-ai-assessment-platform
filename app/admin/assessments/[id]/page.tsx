'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, Plus, Trash2, Save, ArrowLeft, Edit2, X, Check } from 'lucide-react'
import { Question } from '@/types/database'
import Link from 'next/link'
import { ConfirmModal } from '@/components/ConfirmModal'
import { useToast } from '@/components/Toast'

export default function ManageQuestionsPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({
        text: '',
        category: '',
        options: {} as Record<string, string>
    })
    const [saving, setSaving] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<{ id: string, text: string } | null>(null)
    const [deleting, setDeleting] = useState(false)

    // New Question State
    const [newQ, setNewQ] = useState({
        text: '',
        type: 'multiple_choice',
        category: '',
        options: {
            "A": "", "B": "", "C": "", "D": ""
        } as Record<string, string>
    })

    useEffect(() => {
        const fetchDetails = async () => {
            const { data: asm } = await supabase.from('assessments').select('title').eq('id', id).single()
            if (asm) setTitle(asm.title)

            const { data: qs } = await supabase.from('questions').select('*').eq('assessment_id', id)
            if (qs) setQuestions(qs)

            setLoading(false)
        }
        fetchDetails()
    }, [id])

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault()

        let formattedOptions: any = null
        if (newQ.type === 'multiple_choice') {
            formattedOptions = Object.entries(newQ.options).map(([key, val], idx) => ({
                label: key,
                value: idx + 1,
                text: val
            })).filter(o => o.text.trim() !== "")
        }

        const { data, error } = await supabase.from('questions').insert({
            assessment_id: id,
            text: newQ.text,
            type: newQ.type as any,
            category: newQ.category,
            options: formattedOptions
        }).select().single()

        if (error) {
            toast.error('Gagal menambah pertanyaan: ' + error.message)
        } else if (data) {
            toast.success('Pertanyaan berhasil ditambahkan!')
            setQuestions([...questions, data])
            setNewQ({ ...newQ, text: '', options: { "A": "", "B": "", "C": "", "D": "" } })
        }
    }

    const handleStartEdit = (q: Question) => {
        setEditingId(q.id)
        // Parse options back to simple format
        const optionsMap: Record<string, string> = { "A": "", "B": "", "C": "", "D": "" }
        if (q.options && Array.isArray(q.options)) {
            q.options.forEach((opt: any) => {
                if (opt.label && opt.text) {
                    optionsMap[opt.label] = opt.text
                }
            })
        }
        setEditForm({
            text: q.text,
            category: q.category || '',
            options: optionsMap
        })
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditForm({ text: '', category: '', options: {} })
    }

    const handleSaveEdit = async (qId: string, qType: string) => {
        setSaving(true)

        let formattedOptions: any = null
        if (qType === 'multiple_choice') {
            formattedOptions = Object.entries(editForm.options).map(([key, val], idx) => ({
                label: key,
                value: idx + 1,
                text: val
            })).filter(o => o.text.trim() !== "")
        }

        const { error } = await supabase.from('questions').update({
            text: editForm.text,
            category: editForm.category,
            options: formattedOptions
        }).eq('id', qId)

        if (error) {
            toast.error('Gagal menyimpan: ' + error.message)
        } else {
            toast.success('Pertanyaan berhasil diupdate!')
            setQuestions(questions.map(q =>
                q.id === qId
                    ? { ...q, text: editForm.text, category: editForm.category, options: formattedOptions }
                    : q
            ))
            setEditingId(null)
        }
        setSaving(false)
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        const { error } = await supabase.from('questions').delete().eq('id', deleteTarget.id)
        if (!error) {
            toast.success('Pertanyaan berhasil dihapus!')
            setQuestions(questions.filter(q => q.id !== deleteTarget.id))
        } else {
            toast.error('Gagal menghapus pertanyaan')
        }
        setDeleting(false)
        setDeleteTarget(null)
    }

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin" className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition group shadow-sm">
                    <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-primary" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Kelola Pertanyaan</h1>
                    <p className="text-primary font-medium">{title}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Question List */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-2">
                        Pertanyaan ({questions.length})
                    </h3>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {questions.map((q, idx) => (
                            <div key={q.id} className="bg-white border border-slate-200 rounded-xl group hover:shadow-md hover:border-slate-300 transition-all overflow-hidden">
                                {editingId === q.id ? (
                                    // Edit Mode
                                    <div className="p-4 space-y-3 bg-blue-50 border-l-4 border-primary">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-primary">Mengedit Q{idx + 1}</span>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="text-slate-400 hover:text-slate-600 p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <textarea
                                            value={editForm.text}
                                            onChange={e => setEditForm({ ...editForm, text: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                            rows={2}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Kategori/Dimensi"
                                            value={editForm.category}
                                            onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                        {q.type === 'multiple_choice' && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500">Opsi Jawaban</label>
                                                {Object.keys(editForm.options).map(key => (
                                                    <div key={key} className="flex items-center gap-2">
                                                        <span className="text-xs font-bold w-6 h-6 flex items-center justify-center bg-primary/10 text-primary rounded">{key}</span>
                                                        <input
                                                            type="text"
                                                            value={editForm.options[key]}
                                                            onChange={e => setEditForm({
                                                                ...editForm,
                                                                options: { ...editForm.options, [key]: e.target.value }
                                                            })}
                                                            className="flex-1 bg-white border border-slate-200 rounded p-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleSaveEdit(q.id, q.type)}
                                            disabled={saving}
                                            className="w-full py-2 btn-primary rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded mb-2 inline-block">
                                                Q{idx + 1} • {q.type === 'multiple_choice' ? 'Pilihan Ganda' : 'Skala Likert'}
                                            </span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                                <button
                                                    onClick={() => handleStartEdit(q)}
                                                    className="text-slate-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget({ id: q.id, text: q.text })}
                                                    className="text-slate-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="font-medium text-sm text-slate-700">{q.text}</p>
                                        {q.category && (
                                            <span className="text-xs text-slate-400 mt-2 block">Dimensi: {q.category}</span>
                                        )}
                                        {q.options && Array.isArray(q.options) && q.options.length > 0 && (
                                            <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                                                {q.options.slice(0, 2).map((opt: any, i: number) => (
                                                    <div key={i} className="truncate">
                                                        <span className="font-bold text-primary">{opt.label}.</span> {opt.text}
                                                    </div>
                                                ))}
                                                {q.options.length > 2 && (
                                                    <div className="text-slate-400">+{q.options.length - 2} opsi lainnya</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {questions.length === 0 && (
                            <div className="p-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm">Belum ada pertanyaan.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Add New */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit sticky top-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Plus className="w-4 h-4 text-primary" />
                        </div>
                        Tambah Pertanyaan
                    </h3>
                    <form onSubmit={handleAddQuestion} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5">Teks Pertanyaan</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                placeholder="Masukkan pertanyaan..."
                                value={newQ.text}
                                onChange={e => setNewQ({ ...newQ, text: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5">Tipe</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                    value={newQ.type}
                                    onChange={e => setNewQ({ ...newQ, type: e.target.value })}
                                >
                                    <option value="multiple_choice">Pilihan Ganda</option>
                                    <option value="likert">Skala Likert (1-5)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5">Kategori (Dimensi)</label>
                                <input
                                    type="text"
                                    placeholder="cth: Logic"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                    value={newQ.category}
                                    onChange={e => setNewQ({ ...newQ, category: e.target.value })}
                                />
                            </div>
                        </div>

                        {newQ.type === 'multiple_choice' && (
                            <div className="space-y-2 pt-2">
                                <label className="block text-xs uppercase font-bold text-slate-500">Opsi Jawaban</label>
                                {Object.keys(newQ.options).map((key) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <span className="text-xs font-bold w-6 h-6 flex items-center justify-center bg-primary/10 text-primary rounded">{key}</span>
                                        <input
                                            type="text"
                                            placeholder={`Opsi ${key}`}
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                            value={newQ.options[key]}
                                            onChange={e => setNewQ({
                                                ...newQ,
                                                options: { ...newQ.options, [key]: e.target.value }
                                            })}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 btn-primary rounded-xl text-sm font-bold transition mt-4 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Tambahkan ke Assessment
                        </button>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Hapus Pertanyaan?"
                message={`Yakin ingin menghapus pertanyaan "${deleteTarget?.text?.substring(0, 50)}${(deleteTarget?.text?.length || 0) > 50 ? '...' : ''}"?`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                type="danger"
                loading={deleting}
            />
        </div>
    )
}
