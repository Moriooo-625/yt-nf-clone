import { Search, Bell, ChevronDown, Sun, Moon } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'

interface HeaderProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export default function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold text-red-600">
            YouFlix
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <Link href="#" className="hover:text-red-600 transition-colors">
              TV Shows
            </Link>
            <Link href="#" className="hover:text-red-600 transition-colors">
              Movies
            </Link>
            <Link href="#" className="hover:text-red-600 transition-colors">
              New & Popular
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search"
              className="pl-8 pr-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <ChevronDown size={16} />
          </div>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
      </div>
    </header>
  )
} 