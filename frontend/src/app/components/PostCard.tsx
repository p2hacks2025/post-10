// propsの型定義（TypeScriptの場合）
type Post = {
  id: string;
  text: string;
  good: number;
  bad: number;
  point: number; // pointプロパティを追加
  created_at?: string;
};

import ReactionButtons from './ReactionButtons';

// PostCard.tsx の中（コンポーネントの外に置くとスッキリします）
const getDynamicStyle = (point: number) => {
  // 1. 神投稿 (point 10〜)
  if (point >= 10) return "text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-bounce leading-tight py-2";

  // 2. 優良投稿 (point 5〜)
  if (point >= 5) return "text-3xl font-extrabold text-blue-300 drop-shadow-md leading-snug";

  // 3. 軽度の低評価 (-1 〜 -4)
  if (point <= -1 && point > -5) {
    return "text-lg font-medium text-red-500 opacity-80 drop-shadow-[0_0_3px_rgba(239,68,68,0.4)]";
  }

  // 4. 重度の低評価 (-5以下)
  if (point <= -5) {
    return "text-sm font-light text-red-800 opacity-50 line-through decoration-red-900 blur-[0.8px] hover:blur-none transition-all duration-500 hover:opacity-100 hover:text-red-600 cursor-help";
  }

  // 標準
  return "text-lg text-white leading-relaxed";
};

export default function PostCard({ post, onUpdate }: { post: Post, onUpdate: (id: string, good: number, bad: number, point: number) => void }) { // ここを修正
  const textStyle = getDynamicStyle(post.point);

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 transition-all duration-500 overflow-hidden">
      <p className={`${textStyle} whitespace-pre-line wrap-anywhere text-wrap duration-700 hover:scale-[1.02] transition-transform`}>
        {post.text}
      </p>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <ReactionButtons
          postId={post.id}
          goodCount={post.good}
          badCount={post.bad}
          onReact={onUpdate} //さらに子へ渡す
        />
      </div>
    </div>
  );
}