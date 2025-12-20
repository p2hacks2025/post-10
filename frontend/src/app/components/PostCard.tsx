// propsの型定義（TypeScriptの場合）
type PostProps = {
  post: {
    id: string;
    text: string;
    good: number;
    bad: number;
    created_at?: string;
  };
};

import ReactionButtons from './ReactionButtons';

export default function PostCard({ post }: PostProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 hover:border-gray-500 transition-colors">
      {/* 投稿本文 */}
      <p className="text-gray-100 text-xl md:text-lg mb-6 leading-relaxed whitespace-pre-line wrap-break-word">
        {post.text}
      </p>

      <div className="flex items-center justify-between border-t border-gray-700 pt-4">
        {/* 日時表示（とりあえず空文字かアイコンだけでも置いておく） */}
        <span className="text-xs text-gray-500 italic">
          {/* post.created_at ? someFunction(post.created_at) : "" */}
        </span>

        {/* リアクションボタン */}
        <ReactionButtons
          postId={post.id}
          initialGoodCount={post.good}
          initialBadCount={post.bad}
        />

      </div>
    </div>
  );
}