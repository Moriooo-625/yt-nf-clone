import { getHomePageVideos } from './server/actions/videos'
import HomePage from './client/components/HomePage'
import { dummyVideos } from './shared/lib/dummy-data'

export const revalidate = 3600 // 1時間ごとに再検証

export default async function Page() {
  try {
    const videos = await getHomePageVideos()
    return <HomePage {...videos} />
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ''
    const isQuotaExceeded = errorMessage.includes('APIの利用制限に達しました')

    // API制限時はダミーデータを使用
    if (isQuotaExceeded) {
      // ダミーデータを異なるカテゴリに分散
      const recent = dummyVideos.slice(0, 2)  // 最新の2つ
      const trending = dummyVideos.slice(2, 4) // 次の2つをトレンド
      const popular = dummyVideos.slice(4)     // 残りを人気動画に

      return <HomePage
        recentVideos={recent}
        trendingVideos={trending}
        popularVideos={popular}
        error="現在、デモ用のダミーデータを表示しています。しばらく時間をおいて再度お試しください。"
      />
    }

    // その他のエラーの場合
    return <HomePage
      recentVideos={[]}
      trendingVideos={[]}
      popularVideos={[]}
      error={errorMessage || 'YouTube APIの呼び出しに失敗しました。しばらく時間をおいて再度お試しください。'}
    />
  }
}
