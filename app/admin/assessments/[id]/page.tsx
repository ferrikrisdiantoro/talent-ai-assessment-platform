'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client' // Use client for now for simplicity
import { useParams, useRouter } from 'next/navigation' // Use useParams for client components
import { Loader2, Plus, Trash2, Save, ArrowLeft } from 'lucide-react'
import { Question } from '@/types/database'
import Link from 'next/link'

export default function ManageQuestionsPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()
    const supabase = createClient()

    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState('')

    // New Question State
    const [newQ, setNewQ] = useState({
        text: '',
        type: 'multiple_choice',
        category: '',
        options: {
            "A": "", "B": "", "C": "", "D": ""
        } as Record<string, string> // Simple map for options
    })

    useEffect(() => {
        const fetchDetails = async () => {
            // Get Assessment Title
            const { data: asm } = await supabase.from('assessments').select('title').eq('id', id).single()
            if (asm) setTitle(asm.title)

            // Get Questions
            const { data: qs } = await supabase.from('questions').select('*').eq('assessment_id', id)
            if (qs) setQuestions(qs)

            setLoading(false)
        }
        fetchDetails()
    }, [id])

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault()

        // Format options based on type
        let formattedOptions: any = null
        if (newQ.type === 'multiple_choice') {
            formattedOptions = Object.entries(newQ.options).map(([key, val], idx) => ({
                label: key, // A, B, C...
                value: idx + 1, // 1, 2, 3... or just key
                text: val
            })).filter(o => o.text.trim() !== "")
        } else if (newQ.type === 'likert') {
            // Likert usually doesn't need explicit options if standard 1-5, but we can store custom labels if needed
            formattedOptions = null
        }

        const { data, error } = await supabase.from('questions').insert({
            assessment_id: id,
            text: newQ.text,
            type: newQ.type as any,
            category: newQ.category,
            options: formattedOptions
        }).select().single()

        if (error) {
            alert('Error adding question: ' + error.message)
        } else if (data) {
            setQuestions([...questions, data])
            setNewQ({ ...newQ, text: '', options: { "A": "", "B": "", "C": "", "D": "" } }) // Reset
        }
    }

    const handleDelete = async (qId: string) => {
        if (!confirm('Are you sure?')) return
        const { error } = await supabase.from('questions').delete().eq('id', qId)
        if (!error) {
            setQuestions(questions.filter(q => q.id !== qId))
        }
    }

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin" className="p-2 hover:bg-gray-800 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Manage Questions</h1>
                    <p className="text-muted-foreground">{title}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Question List */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b border-gray-800 pb-2">Existing Questions ({questions.length})</h3>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {questions.map((q, idx) => (
                            <div key={q.id} className="p-4 bg-card border border-gray-800 rounded-lg group">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-mono text-gray-500 mb-1 block">Q{idx + 1} • {q.type}</span>
                                    <button onClick={() => handleDelete(q.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="font-medium text-sm">{q.text}</p>
                            </div>
                        ))}
                        {questions.length === 0 && <p className="text-gray-500 italic text-sm">No questions yet.</p>}
                    </div>
                </div>

                {/* Right: Add New */}
                <div className="bg-card p-6 rounded-xl border border-gray-800 h-fit">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-primary" /> Add Question
                    </h3>
                    <form onSubmit={handleAddQuestion} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Question Text</label>
                            <textarea
                                required
                                rows={2}
                                className="w-full bg-background border border-gray-700 rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                value={newQ.text}
                                onChange={e => setNewQ({ ...newQ, text: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Type</label>
                                <select
                                    className="w-full bg-background border border-gray-700 rounded-lg p-2 text-sm"
                                    value={newQ.type}
                                    onChange={e => setNewQ({ ...newQ, type: e.target.value })}
                                >
                                    <option value="multiple_choice">Multiple Choice</option>
                                    <option value="likert">Likert Scale (1-5)</option>
                                    {/* <option value="text">Text Input</option> */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Category (Dimension)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Logic"
                                    className="w-full bg-background border border-gray-700 rounded-lg p-2 text-sm"
                                    value={newQ.category}
                                    onChange={e => setNewQ({ ...newQ, category: e.target.value })}
                                />
                            </div>
                        </div>

                        {newQ.type === 'multiple_choice' && (
                            <div className="space-y-2 pt-2">
                                <label className="block text-xs uppercase font-bold text-gray-500">Options</label>
                                {Object.keys(newQ.options).map((key) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <span className="text-xs font-mono w-4 text-center">{key}</span>
                                        <input
                                            type="text"
                                            placeholder={`Option ${key}`}
                                            className="flex-1 bg-background border border-gray-700 rounded p-1.5 text-sm"
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

                        <button type="submit" className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition mt-4">
                            Add to Assessment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
