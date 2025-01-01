'use client'

import { useState } from 'react'
import Header from './Header'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        {children}
      </div>
    </div>
  )
} 