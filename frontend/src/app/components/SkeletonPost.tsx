export default function SkeletonPost() {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-500 w-full animate-pulse">
      {/* 本文の代わりのグレー棒 */}
      <div className="h-4 bg-gray-400 rounded w-3/4 mb-4"></div>
      
      <div className="flex items-center justify-between border-t pt-4">
        {/* リアクションボタンの代わり */}
        <div className="flex space-x-4">
          <div className="h-8 w-16 bg-gray-400 rounded-full"></div>
          <div className="h-8 w-16 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}