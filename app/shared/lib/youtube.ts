import { youtubeClient } from './youtube-client'

// キャッシュの型定義
interface Cache<T> {
  data: T
  timestamp: number
}

// メモリキャッシュ
const CACHE_DURATION = 5 * 60 * 1000 // 5分
const cache: {
  channelVideos?: Cache<YouTubeVideo[]>
  searchResults?: { [query: string]: Cache<YouTubeVideo[]> }
  videoDetails?: { [id: string]: Cache<YouTubeVideoDetail> }
} = {
  searchResults: {}
}

// キャッシュチェック関数
function isCacheValid<T>(cache?: Cache<T>): cache is Cache<T> {
  if (!cache) return false
  return Date.now() - cache.timestamp < CACHE_DURATION
}

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

export async function getChannelVideos(maxResults: number = 10): Promise<YouTubeVideo[]> {
  // キャッシュをチェック
  if (isCacheValid(cache.channelVideos)) {
    return cache.channelVideos.data
  }

  try {
    const channelResponse = await youtubeClient.get('/channels', {
      params: {
        part: 'contentDetails',
        id: process.env.YOUTUBE_CHANNEL_ID,
      }
    })

    if (!channelResponse.data.items?.length) {
      throw new YouTubeAPIError('Channel not found')
    }

    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads
    const videos = await fetchVideosFromPlaylist(uploadsPlaylistId, maxResults)

    // キャッシュを更新
    cache.channelVideos = {
      data: videos,
      timestamp: Date.now()
    }

    return videos
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    if (error instanceof YouTubeAPIError) {
      throw error
    }
    throw new YouTubeAPIError(error instanceof Error ? error.message : 'Failed to fetch channel videos')
  }
}

async function fetchVideosFromPlaylist(playlistId: string, maxResults: number): Promise<YouTubeVideo[]> {
  const playlistResponse = await youtubeClient.get('/playlistItems', {
    params: {
      part: 'snippet',
      playlistId: playlistId,
      maxResults
    }
  })

  const videoIds = playlistResponse.data.items.map((item: YouTubePlaylistItem) => item.snippet.resourceId.videoId)

  const videoResponse = await youtubeClient.get('/videos', {
    params: {
      part: 'contentDetails,statistics',
      id: videoIds.join(',')
    }
  })

  return playlistResponse.data.items.map((item: YouTubePlaylistItem, index: number): YouTubeVideo | null => {
    const videoData = videoResponse.data.items[index]
    if (!videoData) return null

    return {
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      duration: formatDuration(videoData.contentDetails.duration),
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
      viewCount: formatViewCount(videoData.statistics.viewCount),
      description: item.snippet.description
    }
  }).filter((video: YouTubeVideo | null): video is YouTubeVideo => video !== null)
}

export async function searchVideos(query: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  // キャッシュをチェック
  if (isCacheValid(cache.searchResults?.[query])) {
    return cache.searchResults[query].data
  }

  try {
    const searchResponse = await youtubeClient.get('/search', {
      params: {
        part: 'snippet',
        q: query,
        maxResults,
        type: 'video'
      }
    })

    const videoIds = searchResponse.data.items.map((item: YouTubeSearchItem) => item.id.videoId)

    const videoResponse = await youtubeClient.get('/videos', {
      params: {
        part: 'contentDetails,statistics',
        id: videoIds.join(',')
      }
    })

    const videos = searchResponse.data.items.map((item: YouTubeSearchItem, index: number): YouTubeVideo | null => {
      const videoData = videoResponse.data.items[index]
      if (!videoData) return null

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: formatDuration(videoData.contentDetails.duration),
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        viewCount: formatViewCount(videoData.statistics.viewCount),
        description: item.snippet.description
      }
    }).filter((video: YouTubeVideo | null): video is YouTubeVideo => video !== null)
    // キャッシュを更新
    if (!cache.searchResults) cache.searchResults = {}
    cache.searchResults[query] = {
      data: videos,
      timestamp: Date.now()
    }

    return videos
  } catch (error) {
    console.error('Error searching YouTube videos:', error)
    if (error instanceof YouTubeAPIError) {
      throw error
    }
    throw new YouTubeAPIError(error instanceof Error ? error.message : 'Failed to search videos')
  }
}

export async function getVideoById(videoId: string): Promise<YouTubeVideoDetail> {
  // キャッシュをチェック
  if (isCacheValid(cache.videoDetails?.[videoId])) {
    return cache.videoDetails[videoId].data
  }

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
    const videoDetail: YouTubeVideoDetail = {
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

    // キャッシュを更新
    if (!cache.videoDetails) cache.videoDetails = {}
    cache.videoDetails[videoId] = {
      data: videoDetail,
      timestamp: Date.now()
    }

    return videoDetail
  } catch (error) {
    console.error('Error fetching video details:', error)
    if (error instanceof YouTubeAPIError) {
      throw error
    }
    throw new YouTubeAPIError(error instanceof Error ? error.message : 'Failed to fetch video details')
  }
} 