import { getChannelVideos, searchVideos, getVideoById } from "@/app/shared/lib/youtube"


export async function getHomePageVideos() {
  try {
    const [channelVideos, trending, popular] = await Promise.all([
      getChannelVideos(10),
      searchVideos('trending', 10),
      searchVideos('popular', 10)
    ])

    return {
      recentVideos: channelVideos,
      trendingVideos: trending,
      popularVideos: popular
    }
  } catch (error) {
    console.error('Error fetching videos:', error)
    throw error
  }
}

export async function getVideoDetails(videoId: string) {
  try {
    const video = await getVideoById(videoId)
    return video
  } catch (error) {
    console.error('Error fetching video details:', error)
    throw error
  }
} 