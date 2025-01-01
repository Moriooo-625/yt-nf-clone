import VideoDetailPage from '@/app/client/components/VideoDetailPage'
import { getVideoDetails } from '@/app/server/actions/videos'
import { notFound } from 'next/navigation'

interface VideoPageProps {
  params: {
    id: string
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  try {
    const video = await getVideoDetails(params.id)
    return <VideoDetailPage video={video} />
  } catch (error) {
    console.error('Error fetching video details:', error)
    notFound()
  }
} 