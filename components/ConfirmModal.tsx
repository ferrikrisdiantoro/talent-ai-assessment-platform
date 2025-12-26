'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react'
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'

interface ModalConfig {
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
    onConfirm?: () => void | Promise<void>
    onCancel?: () => void
}

interface ModalContextType {
    showConfirm: (config: Omit<ModalConfig, 'isOpen'>) => Promise<boolean>
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function useConfirmModal() {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('useConfirmModal must be used within a ModalProvider')
    }
    return context
}

export function ModalProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<ModalConfig>({
        isOpen: false,
        title: '',
        message: '',
    })
    const [loading, setLoading] = useState(false)
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

    const showConfirm = useCallback((newConfig: Omit<ModalConfig, 'isOpen'>): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfig({ ...newConfig, isOpen: true })
            setResolvePromise(() => resolve)
        })
    }, [])

    const closeModal = useCallback(() => {
        setConfig(prev => ({ ...prev, isOpen: false }))
        setLoading(false)
    }, [])

    const handleConfirm = async () => {
        setLoading(true)
        if (config.onConfirm) {
            await config.onConfirm()
        }
        resolvePromise?.(true)
        closeModal()
    }

    const handleCancel = () => {
        if (config.onCancel) {
            config.onCancel()
        }
        resolvePromise?.(false)
        closeModal()
    }

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && config.isOpen) {
                handleCancel()
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [config.isOpen])

    const getTypeStyles = () => {
        switch (config.type) {
            case 'danger':
                return {
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    confirmBtn: 'bg-red-500 hover:bg-red-600 text-white'
                }
            case 'warning':
                return {
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    confirmBtn: 'bg-amber-500 hover:bg-amber-600 text-white'
                }
            default:
                return {
                    iconBg: 'bg-primary/10',
                    iconColor: 'text-primary',
                    confirmBtn: 'btn-primary'
                }
        }
    }

    const styles = getTypeStyles()

    return (
        <ModalContext.Provider value={{ showConfirm, closeModal }}>
            {children}

            {/* Modal Overlay */}
            {config.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                        {/* Header */}
                        <div className="p-6 pb-0">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center shrink-0`}>
                                    {config.type === 'danger' ? (
                                        <Trash2 className={`w-6 h-6 ${styles.iconColor}`} />
                                    ) : (
                                        <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800">{config.title}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{config.message}</p>
                                </div>
                                <button
                                    onClick={handleCancel}
                                    className="p-1 hover:bg-slate-100 rounded-lg transition"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 flex justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition disabled:opacity-50"
                            >
                                {config.cancelText || 'Batal'}
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition disabled:opacity-50 ${styles.confirmBtn}`}
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {config.confirmText || 'Konfirmasi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    )
}

// Standalone Modal Component (for direct use without context)
export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    type = 'warning',
    loading = false
}: {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
    loading?: boolean
}) {
    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    confirmBtn: 'bg-red-500 hover:bg-red-600 text-white'
                }
            case 'warning':
                return {
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    confirmBtn: 'bg-amber-500 hover:bg-amber-600 text-white'
                }
            default:
                return {
                    iconBg: 'bg-primary/10',
                    iconColor: 'text-primary',
                    confirmBtn: 'btn-primary'
                }
        }
    }

    const styles = getTypeStyles()

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="p-6 pb-0">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center shrink-0`}>
                            {type === 'danger' ? (
                                <Trash2 className={`w-6 h-6 ${styles.iconColor}`} />
                            ) : (
                                <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                            <p className="text-slate-500 text-sm mt-1">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-slate-100 rounded-lg transition"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition disabled:opacity-50 ${styles.confirmBtn}`}
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
