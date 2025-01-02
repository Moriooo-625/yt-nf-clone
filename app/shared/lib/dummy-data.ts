import type { YouTubeVideo } from './youtube'

export const dummyVideos: YouTubeVideo[] = [
  // 最新動画
  {
    id: 'dummy1',
    title: 'プログラミング入門講座 #1 - JavaScriptの基礎',
    thumbnail: '/placeholder.svg',
    duration: '15:30',
    publishedAt: '2024-01-15',
    viewCount: '1.2K views',
    description: 'プログラミング初心者向けのJavaScript基礎講座です。変数、関数、制御構文などの基本的な概念を解説します。'
  },
  {
    id: 'dummy2',
    title: 'Webアプリケーション開発実践 - React/Next.js入門',
    thumbnail: '/placeholder.svg',
    duration: '23:45',
    publishedAt: '2024-01-14',
    viewCount: '2.5K views',
    description: 'React/Next.jsを使用したモダンなWebアプリケーション開発の基礎を学びます。'
  },
  // トレンド動画
  {
    id: 'dummy3',
    title: '【話題】ChatGPTを使った最新アプリケーション開発手法',
    thumbnail: '/placeholder.svg',
    duration: '18:20',
    publishedAt: '2024-01-13',
    viewCount: '15.1K views',
    description: 'AIを活用した最新のアプリケーション開発手法について解説します。'
  },
  {
    id: 'dummy4',
    title: '【注目】Web3.0時代のブロックチェーン開発入門',
    thumbnail: '/placeholder.svg',
    duration: '27:15',
    publishedAt: '2024-01-12',
    viewCount: '12.8K views',
    description: 'ブロックチェーン技術を活用したDApps開発の基礎を学びます。'
  },
  {
    id: 'dummy5',
    title: '【急上昇】最新のクラウドネイティブ開発手法2024',
    thumbnail: '/placeholder.svg',
    duration: '21:40',
    publishedAt: '2024-01-11',
    viewCount: '18.2K views',
    description: '2024年のクラウドネイティブ開発のトレンドと実践手法を解説します。'
  },
  // 人気動画
  {
    id: 'dummy6',
    title: 'データベース設計マスター講座 - 完全保存版',
    thumbnail: '/placeholder.svg',
    duration: '45:30',
    publishedAt: '2024-01-10',
    viewCount: '50.5K views',
    description: 'データベース設計の基本から応用まで、実践的なノウハウを詳しく解説します。'
  },
  {
    id: 'dummy7',
    title: 'システム設計の王道 - マイクロサービス実践ガイド',
    thumbnail: '/placeholder.svg',
    duration: '38:15',
    publishedAt: '2024-01-09',
    viewCount: '45.2K views',
    description: 'マイクロサービスアーキテクチャの設計と実装について詳しく解説します。'
  },
  {
    id: 'dummy8',
    title: 'Docker & Kubernetes 完全攻略ガイド',
    thumbnail: '/placeholder.svg',
    duration: '42:20',
    publishedAt: '2024-01-08',
    viewCount: '62.3K views',
    description: 'コンテナ技術の基礎から本番環境での運用まで徹底解説します。'
  }
] 