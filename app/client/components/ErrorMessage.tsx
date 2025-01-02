'use client'

import { AlertCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/app/shared/lib/utils'

interface ErrorMessageProps {
  message: string
  type?: 'error' | 'warning'
}

export default function ErrorMessage({ message, type = 'error' }: ErrorMessageProps) {
  const Icon = type === 'error' ? AlertCircle : AlertTriangle

  return (
    <div
      className={cn(
        'flex items-center justify-center p-4 rounded-lg',
        type === 'error'
          ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
          : 'bg-yellow-50 dark:bg-yellow-900/10 text-yellow-600 dark:text-yellow-400'
      )}
    >
      <Icon className="mr-2" size={20} />
      <p>{message}</p>
    </div>
  )
} 