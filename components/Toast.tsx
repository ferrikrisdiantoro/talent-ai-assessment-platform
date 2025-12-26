'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: string
    type: ToastType
    message: string
    duration?: number
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void
    success: (message: string, duration?: number) => void
    error: (message: string, duration?: number) => void
    warning: (message: string, duration?: number) => void
    info: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const showToast = useCallback((type: ToastType, message: string, duration = 4000) => {
        const id = Math.random().toString(36).substring(2, 11)
        const newToast: Toast = { id, type, message, duration }

        setToasts(prev => [...prev, newToast])

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }, [removeToast])

    const success = useCallback((message: string, duration?: number) => {
        showToast('success', message, duration)
    }, [showToast])

    const error = useCallback((message: string, duration?: number) => {
        showToast('error', message, duration)
    }, [showToast])

    const warning = useCallback((message: string, duration?: number) => {
        showToast('warning', message, duration)
    }, [showToast])

    const info = useCallback((message: string, duration?: number) => {
        showToast('info', message, duration)
    }, [showToast])

    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-emerald-500" />
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const getStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-emerald-50 border-emerald-200 text-emerald-800'
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800'
            case 'warning':
                return 'bg-amber-50 border-amber-200 text-amber-800'
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800'
        }
    }

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-in slide-in-from-right-5 fade-in duration-300 ${getStyles(toast.type)}`}
                    >
                        {getIcon(toast.type)}
                        <p className="text-sm font-medium flex-1">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-black/5 rounded transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

// Hook for using toast outside of React components (for server actions)
// Store toast messages to show after redirect
export function setClientToast(type: ToastType, message: string) {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('pendingToast', JSON.stringify({ type, message }))
    }
}

// Component to check and show pending toasts
export function PendingToastHandler() {
    const toast = useToast()

    // Check for pending toast on mount
    if (typeof window !== 'undefined') {
        const pending = sessionStorage.getItem('pendingToast')
        if (pending) {
            try {
                const { type, message } = JSON.parse(pending)
                sessionStorage.removeItem('pendingToast')
                // Use setTimeout to ensure toast context is ready
                setTimeout(() => {
                    toast.showToast(type, message)
                }, 100)
            } catch (e) {
                console.error('Failed to parse pending toast:', e)
            }
        }
    }

    return null
}
