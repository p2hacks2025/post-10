// app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-500 to-yellow-400 mb-6 drop-shadow-sm">
        Mira
      </h1>
      <p className="text-gray-400 text-xl mb-12 max-w-lg">
        あなたの言葉が、輝きを放つか、闇に沈むか。<br />
        感情の重みを視覚化する、新感覚SNS。
      </p>

      <div className="flex gap-4">
        <Link href="/timeline" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
          タイムラインを見る
        </Link>
        <Link href="/new-post" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg border border-gray-700 transition-all">
          今すぐ投稿する
        </Link>
      </div>
    </main>
  );
}