'use client'

type Post = {
  id: string;
  text: string;
  good: number;
  bad: number;
  point: number;
  createdAt: Date; // ISO 8601形式などを想定
};

import { useState, useEffect } from "react";
import PostCard from "./components/PostCard"; // 投稿表示用コンポーネント
import SkeletonPost from "./components/SkeletonPost";


export default function TimelinePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 初回読み込み
  useEffect(() => {
    fetchPosts(0);
  }, []);

  const fetchPosts = async (currentOffset: number) => {
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
  };

  const handleLoadMore = () => {
    setIsMoreLoading(true);
    fetchPosts(posts.length); // 現在の件数を offset として送る
  };

  if (isLoading) return (
    <div className="scapce-y-4 p-4">
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

      {/* もっと見るボタン */}
      <div className="mt-8 flex justify-center">
        {hasMore ? (
          <button
            onClick={handleLoadMore}
            disabled={isMoreLoading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold transition-colors disabled:opacity-50"
          >
            {isMoreLoading ? '読み込み中...' : 'もっと見る'}
          </button>
        ) : (
          <p className="text-gray-400 text-sm">すべての投稿を読み込みました</p>
        )}
      </div>
    </main>
  );
}
