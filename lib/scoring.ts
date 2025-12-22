/**
 * Scoring Engine for Assessment Platform
 * Rule-based deterministic scoring with dimension aggregation
 */

import {
    normalizeDimensionName,
    DEFAULT_DIMENSION,
    CATEGORY_THRESHOLDS,
    LIKERT_MIN,
    LIKERT_MAX
} from './dimensions'

// Types for scoring
export interface ResponseWithQuestion {
    question_id: string
    answer_value: string | null
    score_value: number | null
    question_type: 'multiple_choice' | 'likert' | 'text'
    question_category: string | null
    question_options: any[] | null
}

export interface DimensionScore {
    dimension: string
    raw_score: number
    max_possible: number
    normalized_score: number  // 0-100
    category: 'Low' | 'Medium' | 'High'
    question_count: number
}

export interface ModuleScoringResult {
    assessment_id: string
    module_code: string
    dimensions: DimensionScore[]
    total_raw: number
    total_max: number
    total_normalized: number
    total_category: 'Low' | 'Medium' | 'High'
}

/**
 * Parse the answer value from a response
 * Handles JSON-stringified values and raw numbers
 */
function parseAnswerValue(answerValue: string | null, scoreValue: number | null): number {
    // If pre-calculated score exists, use it
    if (scoreValue !== null && scoreValue !== undefined) {
        return scoreValue
    }

    if (!answerValue) return 0

    try {
        // Try to parse as JSON first (the assessment runner stores JSON.stringify(value))
        const parsed = JSON.parse(answerValue)
        if (typeof parsed === 'number') {
            return parsed
        }
        // If it's an object with a value property
        if (parsed && typeof parsed.value === 'number') {
            return parsed.value
        }
        return 0
    } catch {
        // Not JSON, try parsing as number directly
        const num = parseFloat(answerValue)
        return isNaN(num) ? 0 : num
    }
}

/**
 * Calculate max possible score for a question based on its type and options
 */
function getMaxScoreForQuestion(
    questionType: string,
    options: any[] | null
): number {
    if (questionType === 'likert') {
        return LIKERT_MAX
    }

    if (questionType === 'multiple_choice' && options && Array.isArray(options)) {
        // Find the maximum value among all options
        const maxValue = options.reduce((max, opt) => {
            const val = typeof opt.value === 'number' ? opt.value : 0
            return Math.max(max, val)
        }, 0)
        return maxValue > 0 ? maxValue : 1
    }

    // Default to 1 for binary correct/incorrect
    return 1
}

/**
 * Calculate min possible score for a question based on its type
 */
function getMinScoreForQuestion(questionType: string): number {
    if (questionType === 'likert') {
        return LIKERT_MIN
    }
    // For MCQ, minimum is typically 0 (wrong answer)
    return 0
}

/**
 * Categorize a normalized score (0-100) into Low/Medium/High
 */
export function categorizeScore(normalizedScore: number): 'Low' | 'Medium' | 'High' {
    if (normalizedScore <= CATEGORY_THRESHOLDS.LOW_MAX) {
        return 'Low'
    }
    if (normalizedScore <= CATEGORY_THRESHOLDS.MEDIUM_MAX) {
        return 'Medium'
    }
    return 'High'
}

/**
 * Normalize a raw score to 0-100 scale
 */
export function normalizeScore(raw: number, min: number, max: number): number {
    if (max === min) return 100 // Avoid division by zero
    const normalized = ((raw - min) / (max - min)) * 100
    return Math.round(Math.max(0, Math.min(100, normalized)))
}

/**
 * Main scoring function: Calculate scores for all responses in an assessment
 * Groups by dimension (question.category) and computes aggregated scores
 */
export function calculateAssessmentScores(
    assessmentId: string,
    moduleCode: string,
    responses: ResponseWithQuestion[]
): ModuleScoringResult {
    // Group responses by dimension
    const dimensionGroups: Record<string, ResponseWithQuestion[]> = {}

    for (const response of responses) {
        const dimension = normalizeDimensionName(response.question_category, moduleCode)

        if (!dimensionGroups[dimension]) {
            dimensionGroups[dimension] = []
        }
        dimensionGroups[dimension].push(response)
    }

    // Calculate scores per dimension
    const dimensionScores: DimensionScore[] = []
    let totalRaw = 0
    let totalMax = 0
    let totalMin = 0

    for (const [dimension, dimResponses] of Object.entries(dimensionGroups)) {
        let rawScore = 0
        let maxPossible = 0
        let minPossible = 0

        for (const resp of dimResponses) {
            const answerScore = parseAnswerValue(resp.answer_value, resp.score_value)
            const maxScore = getMaxScoreForQuestion(resp.question_type, resp.question_options)
            const minScore = getMinScoreForQuestion(resp.question_type)

            rawScore += answerScore
            maxPossible += maxScore
            minPossible += minScore
        }

        const normalizedScore = normalizeScore(rawScore, minPossible, maxPossible)
        const category = categorizeScore(normalizedScore)

        dimensionScores.push({
            dimension,
            raw_score: rawScore,
            max_possible: maxPossible,
            normalized_score: normalizedScore,
            category,
            question_count: dimResponses.length
        })

        totalRaw += rawScore
        totalMax += maxPossible
        totalMin += minPossible
    }

    // Calculate total/average score
    const totalNormalized = normalizeScore(totalRaw, totalMin, totalMax)
    const totalCategory = categorizeScore(totalNormalized)

    return {
        assessment_id: assessmentId,
        module_code: moduleCode,
        dimensions: dimensionScores,
        total_raw: totalRaw,
        total_max: totalMax,
        total_normalized: totalNormalized,
        total_category: totalCategory
    }
}

/**
 * Prepare score rows for insertion into the `scores` table
 * Returns an array of objects ready to insert
 */
export function prepareScoreRows(
    userId: string,
    assessmentId: string,
    scoringResult: ModuleScoringResult
): Array<{
    user_id: string
    assessment_id: string
    dimension: string
    raw_score: number
    normalized_score: number
    category: string
}> {
    const rows: Array<{
        user_id: string
        assessment_id: string
        dimension: string
        raw_score: number
        normalized_score: number
        category: string
    }> = []

    // Add per-dimension scores
    for (const dim of scoringResult.dimensions) {
        rows.push({
            user_id: userId,
            assessment_id: assessmentId,
            dimension: dim.dimension,
            raw_score: dim.raw_score,
            normalized_score: dim.normalized_score,
            category: dim.category
        })
    }

    // Add total score row
    rows.push({
        user_id: userId,
        assessment_id: assessmentId,
        dimension: 'Total',
        raw_score: scoringResult.total_raw,
        normalized_score: scoringResult.total_normalized,
        category: scoringResult.total_category
    })

    return rows
}
