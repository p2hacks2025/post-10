'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const [content, setContent] = useState('');
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const MAX_CHARS = 140; //文字数制限
  const remainingChars = MAX_CHARS - content.length;
  const isOverLimit = remainingChars < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isOverLimit) return;

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
      router.refresh(); // タイムラインのデータを最新にする
      router.push('/timeline');
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました');
    } finally {
      setIsPending(false);
    }
  };

  return (
  <main className="min-h-dvh bg-gray-800 p-4 py-8 flex flex-col items-center">
    {/* コンテナ：h1とtextareaの幅をここで統一する */}
    <div className="w-full max-w-2xl px-4"> 

      <h1 className="text-2xl font-bold text-white mb-6">
        新しい投稿
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className={`w-full h-40 p-4 border rounded-xl outline-none resize-none transition-all bg-gray-900 text-white ${
            isOverLimit
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : "border-gray-600 focus:ring-2 focus:ring-blue-500"
          }`}
          placeholder="あなたの感情を文字の大きさに変えよう！"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
        />

        <div className="flex justify-end items-center">
          {/* 文字数カウンター */}
          <span className={`text-sm font-medium mr-4 ${
            isOverLimit ? "text-red-500" : "text-gray-300"
          }`}>
            あと {remainingChars} 文字
          </span>

          {/* 投稿ボタン */}
          <button
            type="submit"
            disabled={isPending || !content.trim() || isOverLimit}
            className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-25 disabled:bg-blue-200 transition-colors"
          >
            {isPending ? '送信中...' : '投稿する'}
          </button>
        </div>
      </form>
    </div>
  </main>
  );
}