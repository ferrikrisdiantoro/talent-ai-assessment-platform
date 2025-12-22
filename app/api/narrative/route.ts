import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { generateNarrative, ScoreData } from '@/lib/ai-narrative'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user profile for name
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()

        const candidateName = profile?.full_name || 'Kandidat'

        // Fetch all scores for this user with assessment info
        const { data: scores, error: scoresError } = await supabase
            .from('scores')
            .select(`
                dimension,
                normalized_score,
                category,
                assessments (
                    code,
                    title
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (scoresError || !scores || scores.length === 0) {
            return NextResponse.json({ error: 'No scores found' }, { status: 404 })
        }

        // Group scores by assessment
        const scoresByModule: Record<string, ScoreData> = {}

        for (const score of scores) {
            const assessment = Array.isArray(score.assessments)
                ? score.assessments[0]
                : score.assessments

            if (!assessment) continue

            const code = assessment.code

            if (!scoresByModule[code]) {
                scoresByModule[code] = {
                    moduleCode: code,
                    moduleTitle: assessment.title,
                    dimensions: [],
                    totalScore: 0,
                    totalCategory: 'Medium'
                }
            }

            if (score.dimension === 'Total') {
                scoresByModule[code].totalScore = score.normalized_score
                scoresByModule[code].totalCategory = score.category
            } else {
                scoresByModule[code].dimensions.push({
                    name: score.dimension,
                    score: score.normalized_score,
                    category: score.category
                })
            }
        }

        const scoreDataArray = Object.values(scoresByModule)

        // Generate AI narrative
        const narrative = await generateNarrative(candidateName, scoreDataArray)

        // Optionally save to reports table
        await supabase.from('reports').upsert({
            user_id: user.id,
            summary: narrative.summary,
            details: narrative,
            created_at: new Date().toISOString()
        }, {
            onConflict: 'user_id'
        })

        return NextResponse.json(narrative)
    } catch (error) {
        console.error('Error generating narrative:', error)
        return NextResponse.json(
            { error: 'Failed to generate narrative' },
            { status: 500 }
        )
    }
}
