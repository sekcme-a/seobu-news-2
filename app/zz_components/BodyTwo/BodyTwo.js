import { Suspense } from "react";
import LeftBodyTwo from "./LeftBodyTwo";
import RightBodyTwo from "./RightBodyTwo";
import SkeletonsBodyTwo from "./SkeletonsBodyTwo";

export default function BodyTwo({ categorySlug }) {
  return (
    <section className="pt-12 mt-16 border-t-2 border-gray-900">
      <div className="lg:flex gap-x-12">
        {/* 왼쪽 섹션: 텍스트 요약 강조형 */}
        <div className="lg:w-1/2 w-full">
          <Suspense fallback={<SkeletonsBodyTwo variant="LeftBodyTwo" />}>
            <LeftBodyTwo categorySlug={categorySlug} />
          </Suspense>
        </div>

        {/* 오른쪽 섹션: 썸네일 카드 병렬형 */}
        <div className="lg:w-1/2 w-full mt-12 lg:mt-0 lg:pl-12 lg:border-l border-gray-100">
          <Suspense fallback={<SkeletonsBodyTwo variant="RightBodyTwo" />}>
            <RightBodyTwo categorySlug={categorySlug} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
