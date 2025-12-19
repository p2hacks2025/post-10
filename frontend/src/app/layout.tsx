import Sidebar from './components/Sidebar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-800 text-white">
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