import { Suspense } from "react";
import BodyArticles from "./BodyArticles";
import BodyFullArticle from "./BodyFullArticle";
import SkeletonsBodyOne from "./SkeletonsBodyOne";
import RightBodyOne from "./RightBodyOne";
import AdBanner from "../AdBanner";

export default function BodyOne({
  leftCategorySlugs = [],
  rightCategorySlug,
  rightCategoryName,
  id,
}) {
  return (
    <section className="mt-16">
      <div className="lg:flex gap-x-12">
        {/* 왼쪽: 주요 카테고리 기사 영역 */}
        <div className="w-full lg:w-[72%]">
          {/* 첫 번째 카테고리 섹션 */}
          <div className="md:flex gap-x-8 items-start border-t-2 border-gray-900 pt-8">
            <div className="w-full md:w-1/2">
              <Suspense
                fallback={<SkeletonsBodyOne variant="BodyFullArticle" />}
              >
                <BodyFullArticle categorySlug={leftCategorySlugs[0]} />
              </Suspense>
            </div>
            <div className="w-full md:w-1/2 mt-10 md:mt-0">
              <Suspense fallback={<SkeletonsBodyOne variant="BodyArticles" />}>
                <BodyArticles categorySlug={leftCategorySlugs[0]} />
              </Suspense>
            </div>
          </div>

          <div className="my-10">
            <AdBanner
              ad_type={`main_body_one_${id}_middle`}
              width="100%"
              aspectRatio="720/100"
              className="rounded-lg overflow-hidden border border-gray-100"
            />
          </div>

          {/* 두 번째 카테고리 섹션 */}
          <div className="md:flex gap-x-8 items-start border-t border-gray-200 pt-8 mt-10">
            <div className="w-full md:w-1/2">
              <Suspense
                fallback={<SkeletonsBodyOne variant="BodyFullArticle" />}
              >
                <BodyFullArticle categorySlug={leftCategorySlugs[1]} />
              </Suspense>
            </div>
            <div className="w-full md:w-1/2 mt-10 md:mt-0">
              <Suspense fallback={<SkeletonsBodyOne variant="BodyArticles" />}>
                <BodyArticles categorySlug={leftCategorySlugs[1]} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* 오른쪽: 사이드바 영역 (오피니언 등) */}
        <div className="w-full lg:w-[28%] mt-12 lg:mt-0">
          <div className="sticky top-6">
            <Suspense fallback={<SkeletonsBodyOne variant="Opinions" />}>
              <RightBodyOne {...{ rightCategorySlug, rightCategoryName }} />
            </Suspense>

            <div className="mt-8">
              <AdBanner
                ad_type={`main_body_one_${id}_right`}
                width="100%"
                className="aspect-[16/9] rounded-xl overflow-hidden shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
