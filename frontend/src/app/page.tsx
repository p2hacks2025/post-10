type Post = {
  id: string;
  text: string;
  good: number;
  bad: number;
  point: number;
  createdAt: Date; // ISO 8601形式などを想定
};

import React from "react";

const API_URL = process.env.API_URL || "";

// データの取得関数
async function getTimeline(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/timeline`, {
    cache: "no-store", // 常に最新の投稿を取得する場合
  });

  if (!res.ok) {
    throw new Error("データの取得に失敗しました");
  }

  return res.json();
}

export default async function TimelinePage() {
  const posts = await getTimeline();

  return (
    <main className="min-h-screen bg-gray-800 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">名前はまだない</h1>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-400"
            >
              {/* 投稿本文 */}
              <p className="text-white text-lg mb-4 whitespace-pre-wrap">
                {post.text}
              </p>

              <div className="flex items-center justify-between text-sm text-white border-t pt-4">
                {/* 投稿時間 */}
                <time>{new Date(post.createdAt).toString()}</time>
                {/* いいね数 */}
                <div className="flex items-center space-x-1">
                  <span className="text-red-500">❤️</span>
                  <span>{post.good}</span>
                </div>
                {/* 僻み数 */}
                <div className="flex items-center space-x-1">
                  <span className="text-purple-400">👿</span>
                  <span>{post.bad}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
