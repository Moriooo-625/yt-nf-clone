'use client'

import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react'
import { Button } from './ui/button'
import type { YouTubeVideoDetail } from '@/app/shared/lib/youtube'
import ClientWrapper from './ClientWrapper'

interface VideoDetailPageProps {
  video: YouTubeVideoDetail
}

export default function VideoDetailPage({ video }: VideoDetailPageProps) {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <main className="pt-16 container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 動画プレーヤーとメタ情報 */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className="mt-4 space-y-4">
                <h1 className="text-2xl font-bold">{video.title}</h1>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{video.viewCount}</span>
                    <span className="text-sm text-gray-500">{video.publishedAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="space-x-2">
                      <ThumbsUp size={20} />
                      <span>{video.likeCount}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="space-x-2">
                      <MessageCircle size={20} />
                      <span>{video.commentCount}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 size={20} />
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">{video.channelTitle}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {video.description}
                  </p>
                </div>
              </div>
            </div>

            {/* 関連動画（将来的な実装のためのプレースホルダー） */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">関連動画</h2>
              <div className="space-y-4">
                {/* 関連動画のリストはここに実装予定 */}
                <p className="text-gray-500">関連動画は準備中です...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ClientWrapper>
  )
} 