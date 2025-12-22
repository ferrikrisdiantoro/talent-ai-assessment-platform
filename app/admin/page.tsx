import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    const { data: assessments } = await supabase.from('assessments').select('*').order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Overview</h1>
                    <p className="text-muted-foreground mt-1">Manage assessments and view candidate results.</p>
                </div>
                <Link href="/admin/assessments/new" className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:brightness-110 font-medium">
                    <Plus className="w-4 h-4" /> New Assessment
                </Link>
            </div>

            <div className="bg-card border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h3 className="font-semibold text-lg">Active Modules</h3>
                </div>
                <div className="divide-y divide-gray-800">
                    {assessments?.map((asm) => (
                        <div key={asm.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono bg-gray-700 px-1.5 rounded text-gray-300">{asm.code}</span>
                                    <h4 className="font-medium text-foreground">{asm.title}</h4>
                                </div>
                                <p className="text-sm text-gray-400 mt-1 max-w-xl truncate">{asm.description}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-500 capitalize">{asm.type}</span>
                                <span className="text-gray-500">{asm.duration_minutes}m</span>
                                <button className="text-primary hover:underline">Edit</button>
                            </div>
                        </div>
                    ))}

                    {(!assessments || assessments.length === 0) && (
                        <div className="p-8 text-center text-gray-500">
                            No assessments created yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
