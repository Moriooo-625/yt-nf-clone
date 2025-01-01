import { youtubeClient } from './youtube-client'

export interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  duration: string
  publishedAt: string
  viewCount: string
  description: string
}

export interface YouTubeVideoDetail extends YouTubeVideo {
  channelTitle: string
  likeCount: string
  commentCount: string
}

interface YouTubePlaylistItem {
  snippet: {
    resourceId: {
      videoId: string
    }
    title: string
    thumbnails: {
      high: {
        url: string
      }
    }
    publishedAt: string
    description: string
  }
}

interface YouTubeSearchItem {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    thumbnails: {
      high: {
        url: string
      }
    }
    publishedAt: string
    description: string
  }
}

class YouTubeAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message)
    this.name = 'YouTubeAPIError'
  }
}

export async function getChannelVideos(maxResults = 10): Promise<YouTubeVideo[]> {
  const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID

  if (!CHANNEL_ID) {
    throw new YouTubeAPIError('YouTube Channel ID is not set')
  }

  try {
    // チャンネルのアップロード済みプレイリストIDを取得
    const channelResponse = await youtubeClient.get('/channels', {
      params: {
        part: 'contentDetails',
        id: CHANNEL_ID
      }
    })

    if (!channelResponse.data.items?.length) {
      throw new YouTubeAPIError('Channel not found')
    }

    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads

    // プレイリストの動画を取得
    const playlistResponse = await youtubeClient.get('/playlistItems', {
      params: {
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults
      }
    })

    if (!playlistResponse.data.items?.length) {
      throw new YouTubeAPIError('No videos found in the playlist')
    }

    // 動画の詳細情報（再生回数、時間など）を取得
    const videoIds = playlistResponse.data.items
      .map((item: YouTubePlaylistItem) => item.snippet.resourceId.videoId)
      .join(',')

    const videosResponse = await youtubeClient.get('/videos', {
      params: {
        part: 'contentDetails,statistics',
        id: videoIds
      }
    })

    if (!videosResponse.data.items?.length) {
      throw new YouTubeAPIError('Failed to fetch video details')
    }

    // データを整形
    return playlistResponse.data.items.map((item: YouTubePlaylistItem, index: number) => {
      const videoDetails = videosResponse.data.items[index]
      if (!videoDetails) {
        console.warn(`Missing details for video ${item.snippet.resourceId.videoId}`)
        return null
      }

      return {
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: formatDuration(videoDetails.contentDetails.duration),
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        viewCount: formatViewCount(videoDetails.statistics.viewCount),
        description: item.snippet.description
      }
    }).filter((video): video is YouTubeVideo => video !== null)
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    if (error instanceof YouTubeAPIError) {
      throw error
    }
    throw new YouTubeAPIError(error instanceof Error ? error.message : 'Failed to fetch videos from YouTube')
  }
}

export async function searchVideos(query: string, maxResults = 10): Promise<YouTubeVideo[]> {
  if (!query.trim()) {
    throw new YouTubeAPIError('Search query cannot be empty')
  }

  try {
    const searchResponse = await youtubeClient.get('/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults
      }
    })

    if (!searchResponse.data.items?.length) {
      return []
    }

    const videoIds = searchResponse.data.items
      .map((item: YouTubeSearchItem) => item.id.videoId)
      .join(',')

    const videosResponse = await youtubeClient.get('/videos', {
      params: {
        part: 'contentDetails,statistics',
        id: videoIds
      }
    })

    if (!videosResponse.data.items?.length) {
      throw new YouTubeAPIError('Failed to fetch video details')
    }

    return searchResponse.data.items.map((item: YouTubeSearchItem, index: number) => {
      const videoDetails = videosResponse.data.items[index]
      if (!videoDetails) {
        console.warn(`Missing details for video ${item.id.videoId}`)
        return null
      }

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: formatDuration(videoDetails.contentDetails.duration),
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        viewCount: formatViewCount(videoDetails.statistics.viewCount),
        description: item.snippet.description
      }
    }).filter((video): video is YouTubeVideo => video !== null)
  } catch (error) {
    console.error('Error searching YouTube videos:', error)
    if (error instanceof YouTubeAPIError) {
      throw error
    }
    throw new YouTubeAPIError(error instanceof Error ? error.message : 'Failed to search videos on YouTube')
  }
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return '0:00'

  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatViewCount(count: string): string {
  const num = parseInt(count)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`
  }
  return `${num} views`
}

export async function getVideoById(videoId: string): Promise<YouTubeVideoDetail> {
  try {
    const videoResponse = await youtubeClient.get('/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId
      }
    })

    if (!videoResponse.data.items?.length) {
      throw new YouTubeAPIError('Video not found')
    }

    const videoData = videoResponse.data.items[0]
    return {
      id: videoId,
      title: videoData.snippet.title,
      thumbnail: videoData.snippet.thumbnails.high.url,
      duration: formatDuration(videoData.contentDetails.duration),
      publishedAt: new Date(videoData.snippet.publishedAt).toLocaleDateString(),
      viewCount: formatViewCount(videoData.statistics.viewCount),
      description: videoData.snippet.description,
      channelTitle: videoData.snippet.channelTitle,
      likeCount: formatViewCount(videoData.statistics.likeCount),
      commentCount: formatViewCount(videoData.statistics.commentCount)
    }
  } catch (error) {
    console.error('Error fetching video details:', error)
    if (error instanceof YouTubeAPIError) {
      throw error
    }
    throw new YouTubeAPIError(error instanceof Error ? error.message : 'Failed to fetch video details')
  }
} 