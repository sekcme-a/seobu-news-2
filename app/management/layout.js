import Link from "next/link";

export const metadata = {
  title: "월세 관리 시스템",
  description: "Professional Room Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
            <h1 className="text-xl font-bold mb-10 text-blue-400">
              Rent Manager
            </h1>
            <nav className="space-y-4">
              <Link
                href="/"
                className="block hover:text-blue-300 transition-colors"
              >
                방 목록 관리
              </Link>
              <Link
                href="#"
                className="block hover:text-blue-300 transition-colors opacity-50"
              >
                수납 내역 (준비중)
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">
                관리자 패널
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">송관리자 님</span>
              </div>
            </header>
            <div className="p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
