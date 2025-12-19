import SkeletonPost from './components/SkeletonPost';

export default function Loading() {
  return (
    <div className="max-w-[85vw] md:max-w-[65vw] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-200">読み込み中...</h1>
      
      <div className="space-y-4">
        {/* 20件分表示されるのを想定して、いくつか並べる */}
        {[...Array(10)].map((_, i) => (
          <SkeletonPost key={i} />
        ))}
      </div>
    </div>
  );
}