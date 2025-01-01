'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 mx-8 my-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
          <h2 className="text-lg font-semibold mb-2">エラーが発生しました</h2>
          <p className="text-sm">{this.state.error?.message}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            ページを再読み込み
          </button>
        </div>
      )
    }

    return this.props.children
  }
} 