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

  // 初回読み込み
  useEffect(() => {
    fetchPosts(0);
  }, []);

  const fetchPosts = useCallback(async (currentOffset: number) => {
    // すでにロード中、またはデータがない場合は即終了
    // 💡 さらに isLoading (初回) 中もガードしておくと安全
    if (isMoreLoading || !hasMore || (currentOffset !== 0 && isLoading)) return; //重複読み込み防止

    setIsMoreLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeline?offset=${currentOffset}`);
      const newPosts = await res.json();

      if (newPosts.length < 20) {
        setHasMore(false); //20件未満なら、「次のデータ」はもうない
      }

      if (currentOffset === 0) {
        setPosts(newPosts);
      } else {
        setPosts((prev) =>[...prev, ...newPosts]); /// 既存のデータの後ろに合体！
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  }, [isMoreLoading, hasMore, isLoading]);

  // ★ 無限スクロールのコアロジック
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // ターゲットが画面に入り、かつ読み込み中でなければ次を読み込む
        if (entries[0].isIntersecting && hasMore && !isMoreLoading) {
          fetchPosts(posts.length);
        }
      },
      { threshold: 1.0 } // 完全に画面に入ったら発火
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [posts.length, hasMore, isMoreLoading, fetchPosts]);

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
      <div ref={observerTarget} className="h-20 flex items-center justify-center mt-4">
        {isMoreLoading && <p className="text-gray-500 animate-pulse">読み込み中...</p>}
        {!hasMore && <p className="text-gray-600 text-sm italic">すべての投稿を表示しました</p>}
      </div>
    </main>
  );
}
