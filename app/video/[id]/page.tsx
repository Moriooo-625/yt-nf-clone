import VideoDetailPage from '@/app/client/components/VideoDetailPage'
import { getVideoDetails } from '@/app/server/actions/videos'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const id = (await params).id
  try {
    const video = await getVideoDetails(id)
    return {
      title: video.title,
      description: video.description,
    }
  } catch {
    return {
      title: 'Video Not Found',
    }
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  try {
    const video = await getVideoDetails(id)
    return <VideoDetailPage video={video} />
  } catch {
    notFound()
  }
} 