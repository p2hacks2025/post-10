'use client';

import { useState } from 'react';

type ReactionType = 'good' | 'bad';

type Props = {
  postId: string;
  initialGoodCount: number;
  initialBadCount: number;
};

export default function ReactionButtons({ postId, initialGoodCount, initialBadCount }: Props) {
  const [counts, setCounts] = useState({ good: initialGoodCount, bad: initialBadCount });
  const [activeType, setActiveType] = useState<ReactionType | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const handleReact = async (type: ReactionType) => {
    // 既に同じタイプが押されている場合は解除（トグル）する想定
    // ※バックエンドの仕様が「上書き」か「解除不可」かによって調整してください
    const isDeselcting = activeType === type;
    const nextType = isDeselcting ? null : type;

    // 楽観的更新のロジック
    const newCounts = { ...counts };
    if (activeType) newCounts[activeType]--; // 前の評価を引く
    if (nextType) newCounts[nextType]++;    // 新しい評価を足す

    setCounts(newCounts);
    setActiveType(nextType);

    try {
      await fetch(`${API_URL}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          type: type, // 'good' or 'bad'
        }),
      });
      console.log('Successfully reacted!');
    } catch (error) {
      console.error('Failed to react:', error);
      // 本来はここでエラー前の状態にロールバックする処理を入れます
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Good ボタン */}
      <button
        onClick={() => handleReact('good')}
        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
          activeType === 'good' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'
        }`}
      >
        <span>{activeType === 'good' ? '👍' : 'いいね👍'}</span>
        <span className="font-bold">{counts.good}</span>
      </button>

      {/* Bad ボタン */}
      <button
        onClick={() => handleReact('bad')}
        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
          activeType === 'bad' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-500'
        }`}
      >
        <span>{activeType === 'bad' ? '👎' : 'よくないね👎'}</span>
        <span className="font-bold">{counts.bad}</span>
      </button>
    </div>
  );
}