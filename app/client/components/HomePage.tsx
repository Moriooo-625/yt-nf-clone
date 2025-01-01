'use client'

import { Suspense } from 'react'
import HeroSection from './HeroSection'
import CategorySection from './CategorySection'
import ClientWrapper from './ClientWrapper'
import ErrorBoundary from './ErrorBoundary'
import Loading from './Loading'
import { YouTubeVideo } from '@/app/shared/lib/youtube'

interface HomePageProps {
  recentVideos: YouTubeVideo[]
  trendingVideos: YouTubeVideo[]
  popularVideos: YouTubeVideo[]
}

export default function HomePage({ recentVideos, trendingVideos, popularVideos }: HomePageProps) {
  return (
    <ClientWrapper>
      <ErrorBoundary>
        <main className="pt-16">
          <Suspense fallback={<Loading />}>
            {recentVideos[0] && <HeroSection video={recentVideos[0]} />}
            <CategorySection title="Trending Now" videos={trendingVideos} />
            <CategorySection title="Latest Videos" videos={recentVideos} />
            <CategorySection title="Popular Videos" videos={popularVideos} />
          </Suspense>
        </main>
      </ErrorBoundary>
    </ClientWrapper>
  )
} 