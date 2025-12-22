import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowRight, Clock, CheckCircle } from 'lucide-react'
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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Candidate Dashboard</h1>
                <p className="text-muted-foreground mt-2">Complete the following modules to finish your assessment.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assessments?.map((test) => (
                    <AssessmentCard key={test.id} assessment={test} />
                ))}

                {(!assessments || assessments.length === 0) && (
                    <div className="col-span-full p-12 text-center border-2 border-dashed border-gray-700 rounded-xl bg-card/30">
                        <p className="text-muted-foreground">No assessments available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function AssessmentCard({ assessment }: { assessment: Assessment }) {
    const typeLabel = {
        'cognitive': 'Cognitive Ability',
        'personality': 'Personality Profile',
        'attitude': 'Work Attitude',
        'interest': 'Career Interest'
    }[assessment.type] || assessment.type

    return (
        <div className="flex flex-col rounded-xl border border-gray-700 bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-start justify-between">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                    {assessment.code}
                </span>
                {assessment.duration_minutes > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {assessment.duration_minutes}m
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Untimed
                    </div>
                )}
            </div>

            <div className="mt-4 flex-1">
                <h3 className="font-semibold text-lg text-foreground leading-tight">{assessment.title}</h3>
                <p className="text-xs text-primary/80 mt-1 uppercase tracking-wider font-semibold">{typeLabel}</p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {assessment.description}
                </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800">
                <Link
                    href={`/assessment/${assessment.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95"
                >
                    Start Test <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
