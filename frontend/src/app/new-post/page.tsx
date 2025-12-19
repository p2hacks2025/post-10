'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const [content, setContent] = useState('');
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPending(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content }),
      });

      if (!res.ok) throw new Error('投稿に失敗しました');

      // 投稿成功後、入力欄を空にしてタイムラインに戻る
      setContent('');
      router.push('/');
      router.refresh(); // タイムラインのデータを最新にする
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="max-w-screen mx-auto min-h-dvh bg-gray-800 p-4 py-8">
      <h1 className="flex text-2xl font-bold text-white ml-[15dvw] mb-6">新しい投稿</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center">
          <textarea
            className="w-[70dvw] h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-white"
            placeholder="あなたのキラキラを投稿しよう！"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending}
          />
        </div>


        <div className="flex justify-end mr-[15dvw]">
          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isPending ? '送信中...' : '投稿する'}
          </button>
        </div>
      </form>
    </main>
  );
}