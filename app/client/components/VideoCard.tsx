'use client'

import { useState } from 'react'
import { Play, Plus, ThumbsUp } from 'lucide-react'
import { Button } from './ui/button'
import type { YouTubeVideo } from '@/app/shared/lib/youtube'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface VideoCardProps {
  video: YouTubeVideo
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    router.push(`/video/${video.id}`)
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/video/${video.id}`)
  }

  return (
    <div
      className="relative w-64 h-36 rounded-md overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative w-full h-full">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="absolute bottom-2 right-2 px-1 py-0.5 bg-black bg-opacity-70 text-white text-xs rounded">
        {video.duration}
      </div>
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-between p-4 transition-opacity duration-300">
          <div className="space-y-2">
            <h3 className="text-white font-semibold line-clamp-2">{video.title}</h3>
            <p className="text-gray-300 text-sm">{video.viewCount} • {video.publishedAt}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:text-red-600"
                onClick={handlePlayClick}
              >
                <Play size={20} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:text-red-600"
                onClick={(e) => e.stopPropagation()}
              >
                <Plus size={20} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:text-red-600"
                onClick={(e) => e.stopPropagation()}
              >
                <ThumbsUp size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 