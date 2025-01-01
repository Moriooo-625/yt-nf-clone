import { getHomePageVideos } from './server/actions/videos'
import HomePage from './client/components/HomePage'

export const revalidate = 3600 // 1時間ごとに再検証

export default async function Page() {
  try {
    const videos = await getHomePageVideos()
    return <HomePage {...videos} />
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'YouTube APIの呼び出しに失敗しました。しばらく時間をおいて再度お試しください。'

    return <HomePage
      recentVideos={[]}
      trendingVideos={[]}
      popularVideos={[]}
      error={errorMessage}
    />
  }
}
