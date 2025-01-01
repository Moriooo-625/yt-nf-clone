'use client'

import { Suspense } from 'react'
import HeroSection from './HeroSection'
import CategorySection from './CategorySection'
import ClientWrapper from './ClientWrapper'
import ErrorBoundary from './ErrorBoundary'
import Loading from './Loading'
import ErrorMessage from './ErrorMessage'
import { YouTubeVideo } from '@/app/shared/lib/youtube'

interface HomePageProps {
  recentVideos: YouTubeVideo[]
  trendingVideos: YouTubeVideo[]
  popularVideos: YouTubeVideo[]
  error?: string
}

export default function HomePage({ recentVideos, trendingVideos, popularVideos, error }: HomePageProps) {
  if (error) {
    return (
      <ClientWrapper>
        <main className="pt-24 px-4">
          <ErrorMessage message={error} />
        </main>
      </ClientWrapper>
    )
  }

  const hasNoVideos = !recentVideos.length && !trendingVideos.length && !popularVideos.length

  if (hasNoVideos) {
    return (
      <ClientWrapper>
        <main className="pt-24 px-4">
          <ErrorMessage message="動画を読み込めませんでした。しばらく時間をおいて再度お試しください。" />
        </main>
      </ClientWrapper>
    )
  }

  return (
    <ClientWrapper>
      <ErrorBoundary>
        <main className="pt-16">
          <Suspense fallback={<Loading />}>
            {recentVideos[0] && <HeroSection video={recentVideos[0]} />}
            {trendingVideos.length > 0 && (
              <CategorySection title="Trending Now" videos={trendingVideos} />
            )}
            {recentVideos.length > 0 && (
              <CategorySection title="Latest Videos" videos={recentVideos} />
            )}
            {popularVideos.length > 0 && (
              <CategorySection title="Popular Videos" videos={popularVideos} />
            )}
          </Suspense>
        </main>
      </ErrorBoundary>
    </ClientWrapper>
  )
} 