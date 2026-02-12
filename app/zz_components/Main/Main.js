import { Suspense } from "react";
import SkeletonsMain from "./SkeletonsMain";
import Headline from "./Headline";
import MainNews from "./MainNews";
import RecentArticles from "./RecentArticles";

export default function Main() {
  return (
    <main className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8">
      <div className="flex flex-col xl:flex-row gap-12">
        {/* 왼쪽 섹션: 헤드라인 + 주요뉴스 (75%) */}
        <section className="w-full xl:w-[72%]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* 헤드라인 - 가로 비중 확대 */}
            <div className="lg:col-span-2">
              <Suspense fallback={<SkeletonsMain variant="Headline" />}>
                <Headline />
              </Suspense>
            </div>
            {/* 주요 뉴스 리스트 */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-black inline-block">
                주요 뉴스
              </h3>
              <Suspense fallback={<SkeletonsMain variant="MainNews" />}>
                <MainNews />
              </Suspense>
            </div>
          </div>
        </section>

        {/* 오른쪽 섹션: 최신 기사 / 사이드바 (25%) */}
        <aside className="w-full xl:w-[28%] border-t xl:border-t-0 xl:border-l xl:pl-8 border-gray-100">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            실시간 최신뉴스
          </h3>
          <Suspense fallback={<SkeletonsMain variant="RecentArticles" />}>
            <RecentArticles />
          </Suspense>
        </aside>
      </div>
    </main>
  );
}
