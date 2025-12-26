'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ConfirmModal'
import { useToast } from '@/components/Toast'

export default function DeleteAssessmentButton({
    assessmentId,
    assessmentTitle
}: {
    assessmentId: string
    assessmentTitle: string
}) {
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const handleDelete = async () => {
        setLoading(true)

        // Delete all questions first
        await supabase.from('questions').delete().eq('assessment_id', assessmentId)

        // Delete assessment
        const { error } = await supabase.from('assessments').delete().eq('id', assessmentId)

        if (error) {
            toast.error('Gagal menghapus assessment: ' + error.message)
        } else {
            toast.success('Assessment berhasil dihapus!')
            router.refresh()
        }
        setLoading(false)
        setShowModal(false)
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="text-slate-400 hover:text-red-500 font-medium transition"
                title="Hapus"
            >
                Hapus
            </button>

            <ConfirmModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
                title="Hapus Assessment?"
                message={`Yakin ingin menghapus "${assessmentTitle}"? Semua pertanyaan di dalamnya juga akan terhapus. Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                type="danger"
                loading={loading}
            />
        </>
    )
}
