import Sidebar from './components/Sidebar';
import './globals.css';
import { Noto_Sans_JP } from 'next/font/google';

// app/layout.tsx
import type { Metadata } from "next";

const notoTasks = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700', '900'], // 900（black）は巨大化した時に映えます
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Mira | 新感覚SNS",
    template: "%s | Mira",
  },
  description: "キラキラした思い出だけが見える。ハッカソン発、新感覚SNS。",
  keywords: ["SNS", "感情", "視覚化", "ハッカソン"],
  // OGP設定（シェアされた時の見た目）
  openGraph: {
    title: "Mira",
    description: "感情の重みを視覚化する新感覚SNS",
    url: "https://your-app-url.com", // デプロイ後のURL
    siteName: "Mira",
    locale: "ja_JP",
    type: "website",
  },
  // Twitter用カード
  twitter: {
    card: "summary_large_image",
    title: "Mira",
    description: "感情の重みを視覚化する新感覚SNS",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="{notoTasks.className} bg-gray-800 text-white">
        <div className="flex max-w-vw mx-auto">
          {/* 左側：固定サイドバー */}
          <Sidebar />

          {/* 右側：メインコンテンツ（タイムラインなど） */}
          <main className="flex-1 min-h-screen border-r border-gray-500 bg-gray-800">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}