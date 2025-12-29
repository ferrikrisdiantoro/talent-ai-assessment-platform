export type Profile = {
    id: string
    full_name: string | null
    role: 'candidate' | 'admin' | 'recruiter'
    organization_id: string | null
    invited_by: string | null
    invitation_id: string | null
    created_at: string
}

export type Organization = {
    id: string
    name: string
    recruiter_id: string
    description: string | null
    created_at: string
}

export type Invitation = {
    id: string
    organization_id: string | null
    recruiter_id: string
    email: string
    candidate_name: string | null
    token: string
    status: 'pending' | 'accepted' | 'expired'
    expires_at: string
    accepted_at: string | null
    created_at: string
}

export type Assessment = {
    id: string
    code: string
    title: string
    description: string | null
    type: 'cognitive' | 'personality' | 'attitude' | 'interest'
    duration_minutes: number
    created_at: string
}

export type Question = {
    id: string
    assessment_id: string
    text: string
    type: 'multiple_choice' | 'likert' | 'text'
    options: any // JSON
    category: string | null
    created_at: string
}

export type AssessmentSession = {
    id: string
    user_id: string
    status: 'in_progress' | 'completed'
    started_at: string
    completed_at: string | null
    created_at: string
}

export type Response = {
    id: string
    session_id: string | null
    user_id: string
    assessment_id: string
    question_id: string
    answer_value: string | null
    score_value: number | null
    created_at: string
}

export type Score = {
    id: string
    user_id: string
    assessment_id: string | null
    dimension: string | null
    raw_score: number | null
    normalized_score: number | null
    category: string | null
    created_at: string
}

export type Report = {
    id: string
    user_id: string
    summary: string | null
    details: any
    pdf_url: string | null
    created_at: string
}
