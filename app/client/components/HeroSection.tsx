'use client'

import { Play, Info } from 'lucide-react'
import { Button } from './ui/button'
import type { YouTubeVideo } from '@/app/lib/youtube'

interface HeroSectionProps {
  video: YouTubeVideo
}

export default function HeroSection({ video }: HeroSectionProps) {
  return (
    <section className="relative h-[80vh] bg-black">
      <div className="absolute inset-0">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 space-y-4">
        <h2 className="text-4xl md:text-6xl font-bold text-white">{video.title}</h2>
        <div className="flex items-center space-x-4 text-gray-300">
          <span>{video.viewCount}</span>
          <span>•</span>
          <span>{video.publishedAt}</span>
        </div>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl line-clamp-2">
          {video.description}
        </p>
        <div className="flex space-x-4">
          <Button size="lg" className="bg-white text-black hover:bg-gray-200">
            <Play className="mr-2" size={20} />
            Play
          </Button>
          <Button size="lg" variant="secondary">
            <Info className="mr-2" size={20} />
            More Info
          </Button>
        </div>
      </div>
    </section>
  )
} 