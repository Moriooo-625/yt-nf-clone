import axios from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

export const youtubeClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY
  }
})

// エラーハンドリングのインターセプター
youtubeClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // APIからのエラーレスポンス
      const message = error.response.data?.error?.message || 'YouTube API error'
      throw new Error(`YouTube API Error: ${message}`)
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない
      throw new Error('No response from YouTube API')
    } else {
      // リクエストの作成時にエラーが発生
      throw new Error(`Error creating request: ${error.message}`)
    }
  }
) 