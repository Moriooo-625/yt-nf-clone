import { getHomePageVideos } from './server/actions/videos'
import HomePage from './client/components/HomePage'

export const revalidate = 3600 // 1時間ごとに再検証

export default async function Page() {
  const videos = await getHomePageVideos()
  return <HomePage {...videos} />
}
