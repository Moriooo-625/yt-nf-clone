'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { Button } from './ui/button'
import VideoCard from './VideoCard'
import { YouTubeVideo } from '@/app/shared/lib/youtube'

interface CategorySectionProps {
  title: string
  videos: YouTubeVideo[]
}

export default function CategorySection({ title, videos }: CategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      })
    }
  }

  if (videos.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold mb-4 px-8">{title}</h2>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 px-8 pb-4 scrollbar-hide scroll-smooth"
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
          onClick={() => scroll('left')}
        >
          <ChevronLeft size={24} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
          onClick={() => scroll('right')}
        >
          <ChevronRight size={24} />
        </Button>
      </div>
    </section>
  )
}
