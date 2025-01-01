import axios from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

export const youtubeClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY
  }
})

// エラーハッセージのマッピング
const errorMessages: { [key: string]: string } = {
  'quotaExceeded': 'APIの利用制限に達しました。しばらく時間をおいて再度お試しください。',
  'keyInvalid': 'APIキーが無効です。',
  'channelNotFound': 'チャンネルが見つかりませんでした。',
  'playlistNotFound': 'プレイリストが見つかりませんでした。',
  'videoNotFound': '動画が見つかりませんでした。',
  'default': 'エラーが発生しました。しばらく時間をおいて再度お試しください。'
}

// エラーハンドリングのインターセプター
youtubeClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // APIからのエラーレスポンス
      const errorMessage = error.response.data?.error?.message || ''
      let userMessage = errorMessages.default

      // エラーメッセージに基づいて適切なメッセージを選択
      if (errorMessage.includes('quota')) {
        userMessage = errorMessages.quotaExceeded
      } else if (errorMessage.includes('key')) {
        userMessage = errorMessages.keyInvalid
      } else if (errorMessage.includes('channel')) {
        userMessage = errorMessages.channelNotFound
      } else if (errorMessage.includes('playlist')) {
        userMessage = errorMessages.playlistNotFound
      } else if (errorMessage.includes('video')) {
        userMessage = errorMessages.videoNotFound
      }

      throw new Error(userMessage)
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない
      throw new Error('YouTubeサーバーに接続できません。インターネット接続を確認してください。')
    } else {
      // リクエストの作成時にエラーが発生
      throw new Error('リクエストの作成中にエラーが発生しました。')
    }
  }
) 