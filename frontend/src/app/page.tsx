'use client'

type Post = {
  id: string;
  text: string;
  good: number;
  bad: number;
  point: number;
  createdAt: Date; // ISO 8601形式などを想定
};

import { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "./components/PostCard"; // 投稿表示用コンポーネント
import SkeletonPost from "./components/SkeletonPost";


export default function TimelinePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ★ 監視用のターゲットを指すリファレンス
  const observerTarget = useRef(null);

const fetchPosts = useCallback(async (currentOffset: number) => {
  console.log(`Offset: ${currentOffset}, posts.length: ${posts.length}`);

  if (currentOffset === 0 && posts.length > 0) return;

  if (isMoreLoading || !hasMore || (currentOffset !== 0 && isLoading)) return;

  setIsMoreLoading(true);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeline?offset=${currentOffset}`);
    const newPosts = await res.json();

    if (newPosts.length < 20) {
      setHasMore(false);
    }

    setPosts((prev) => {
      // 最初の読み込み（offset 0）ならそのままセット
      if (currentOffset === 0) return newPosts;

      // 2回目以降なら、既存のデータと合体（重複を防ぐために念のためチェック）
      const existingIds = new Set(prev.map(p => p.id));
      const filteredNewPosts = newPosts.filter((p: Post) => !existingIds.has(p.id));
      return [...prev, ...filteredNewPosts];
    });

  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
    setIsMoreLoading(false);
  }
}, [isMoreLoading, hasMore, isLoading, posts.length]);

  // 初回読み込み
  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  // ★ 無限スクロールのコアロジック
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isMoreLoading && !isLoading && posts.length> 0) {
          // 念のため、現在の件数をログに出して確認
          console.log("Bottom reached! Fetching offset:", posts.length);
          fetchPosts(posts.length);
        }
      },
      {
        threshold: 0.1, // 10% 見えたら発火
        rootMargin: "100px" // 画面の底につく 100px 前に読み込み開始
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [posts.length, hasMore, isMoreLoading, isLoading, fetchPosts]);

  if (isLoading) return (
    <div className="space-y-4 p-4">
      {[...Array(7)].map((_, i) => <SkeletonPost key={i} />)}
    </div>
  );

return (
    <main className="md:max-w-[40vw] max-w-[90vw] mx-auto p-4 pb-24">
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* ★ 監視用ターゲット兼ローダー */}
      {/* ★ 常に一定の高さ(h-20)を保ち、透明でもそこに「ある」状態にする */}
      <div 
        ref={observerTarget} 
        className="h-20 w-full flex flex-col items-center justify-center mt-10 mb-20"
      >
        {isMoreLoading && (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-500 text-sm">さらに読み込み中...</p>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-gray-600 text-sm italic border-t border-gray-800 pt-4 w-full text-center">
            —— すべての投稿を表示しました ——
          </p>
        )}
      </div>
    </main>
  );
}
