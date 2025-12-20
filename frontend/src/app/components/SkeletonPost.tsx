export default function SkeletonPost() {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 w-2xl mx-auto animate-pulse">
      {/* 本文の代わりのグレー棒 */}
      <div className="h-4 bg-gray-600 rounded-full w-3/4 mb-4"></div>
      
      <div className="flex items-center justify-end border-t pt-4">
        {/* リアクションボタンの代わり */}
        <div className="flex space-x-6">
          <div className="h-8 w-32 bg-gray-600 rounded-full"></div>
          <div className="h-8 w-32 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}