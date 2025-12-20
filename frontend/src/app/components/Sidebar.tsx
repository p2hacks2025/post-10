'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'ホーム', href: '/', icon: '🏠' },
    { name: '投稿する', href: '/new-post', icon: '📝' },
    { name: 'このアプリについて', href: '/about', icon: 'ℹ️' },
  ];

  return (
    <>
      {/* PC画面用の固定サイドバー、左側 */}
      <aside className="w-18rem h-screen sticky top-0 border-r border-gray-700 p-6 bg-gray-800 hidden md:block">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-500">Mira</h2>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-700 transition-colors text-lg font-medium text-white"
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto absolute bottom-8 left-6">
          <Link href = "/new-post">
            <button className="bg-blue-500 text-white w-48 py-3 rounded-full font-bold hover:bg-blue-600 shadow-md transition-all">
              投稿する
            </button>
          </Link>
        </div>
      </aside>

      {/* --- スマホ用 (下部固定ナビゲーション) --- */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center z-50">
        <nav className="bg-gray-800 border border-gray-700 flex justify-around py-3 w-[90vw] rounded-2xl shadow-xl px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col flex-1 items-center space-y-1 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}
                //flex-1を追加することで、各アイテムに文字数に関係なく強制的に同じ幅を分けさせる
                //これで、きっちり中心に見えるようになる
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}