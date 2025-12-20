'use client';

import { useState } from 'react';

type ReactionType = 'good' | 'bad';

type Props = {
  postId: string;
  goodCount: number; // initial ではなく現在の数を受け取る
  badCount: number;  // 同上
  onReact: (id: string, good: number, bad: number, point: number) => void; // 追加
};

export default function ReactionButtons({ postId, goodCount, badCount, onReact }: Props) {
  const [activeType, setActiveType] = useState<ReactionType | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const handleReact = async (type: ReactionType) => {
    // ボタンの連打防止
    setActiveType(type);

    try {
      const res = await fetch(`${API_URL}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          type: type,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // ★ ここで親（TimelinePage）の posts ステートを直接更新する
        // 親が更新されると、このコンポーネントに渡される goodCount / badCount も自動で増える
        onReact(postId, data.good, data.bad, data.point);
      }
    } catch (error) {
      console.error('Failed to react:', error);
      setActiveType(null); // エラー時は色を戻す
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => handleReact('good')}
        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all ${
          activeType === 'good' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-400'
        }`}
      >
        <span>👍</span>
        <span className="font-bold">{goodCount}</span>
      </button>

      <button
        onClick={() => handleReact('bad')}
        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all ${
          activeType === 'bad' ? 'bg-red-600 text-white' : 'hover:bg-gray-700 text-gray-400'
        }`}
      >
        <span>👎</span>
        <span className="font-bold">{badCount}</span>
      </button>
    </div>
  );
}