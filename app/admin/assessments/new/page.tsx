'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Trash2 } from 'lucide-react'

export default function CreateAssessmentPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        title: '',
        description: '',
        type: 'cognitive',
        duration_minutes: 10
    })

    // We will just create the assessment first, then redirect to a "Manage Questions" page or allow adding questions here?
    // For MVP simplicity, let's just create the metadata.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.from('assessments').insert(formData)

        if (error) {
            alert('Error creating assessment: ' + error.message)
        } else {
            router.push('/admin')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Create New Assessment</h1>
                <p className="text-muted-foreground mt-1">Define the metadata for a new test module.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl border border-gray-800">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Module Code</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. COG-01"
                            className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Time Limit (Minutes)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            value={formData.duration_minutes}
                            onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Logical Reasoning Test"
                        className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                        required
                        rows={3}
                        placeholder="Brief description of what this test measures..."
                        className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                    <select
                        className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="cognitive">Cognitive Ability</option>
                        <option value="personality">Personality (Likert)</option>
                        <option value="attitude">Attitude / Integrity</option>
                        <option value="interest">Interest (RIASEC)</option>
                    </select>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Module'}
                    </button>
                </div>
            </form>
        </div>
    )
}
