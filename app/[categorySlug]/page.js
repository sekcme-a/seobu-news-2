import Footer from "@/components/Footer";
import ArticleList from "./components/ArticleList";
import Headline from "./components/Headline";
import Navbar from "./components/Navbar";
import HeadlineList from "./components/HeadlineList";
import RightBodyOne from "../zz_components/BodyOne/RightBodyOne";
import { Suspense } from "react";
import SkeletonCategory from "./components/SkeletonCategory";
import { categories } from "@/utils/data/categories";
import { createMetadata } from "@/utils/metadata";
import AdBanner from "../zz_components/AdBanner";

export async function generateMetadata({ params }) {
  const { categorySlug } = params;
  const category = categories.find((cat) => cat.slug === categorySlug);
  return createMetadata({
    title: category?.name,
    description: category?.description,
    url: `/category/${categorySlug}`,
  });
}

export default function CategoryPage({ params }) {
  const { categorySlug } = params;
  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-[1280px] mx-auto pt-14 md:pt-24 px-4 lg:px-6">
        <Navbar categorySlug={categorySlug} />

        <div className="flex flex-col xl:flex-row gap-12 mt-10">
          {/* 메인 리스트 영역 (75%) */}
          <div className="w-full xl:w-[72%]">
            <Suspense fallback={<SkeletonCategory variant="Headline" />}>
              <Headline categorySlug={categorySlug} />
            </Suspense>

            <div className="mt-12">
              <Suspense fallback={<SkeletonCategory variant="ArticleList" />}>
                <ArticleList categorySlug={categorySlug} />
              </Suspense>
            </div>
          </div>

          {/* 사이드바 영역 (25%) */}
          <aside className="w-full xl:w-[28%] flex flex-col gap-8">
            <Suspense fallback={<SkeletonCategory variant="HeadlineList" />}>
              <HeadlineList categorySlug={categorySlug} />
            </Suspense>

            <div className="space-y-4">
              <AdBanner
                ad_type="category_right_middle_1"
                className="rounded-lg overflow-hidden border border-gray-100"
              />
              <AdBanner
                ad_type="category_right_middle_2"
                className="rounded-lg overflow-hidden border border-gray-100"
              />
            </div>

            <div className="border-t border-gray-100 pt-8">
              <Suspense
                fallback={
                  <div className="h-40 bg-gray-50 rounded-xl animate-pulse" />
                }
              >
                <RightBodyOne
                  rightCategorySlug="opinion"
                  rightCategoryName="오피니언"
                  limit={5}
                />
              </Suspense>
            </div>

            <div className="space-y-4">
              <AdBanner
                ad_type="category_right_bottom_1"
                className="rounded-lg overflow-hidden border border-gray-100"
              />
              <AdBanner
                ad_type="category_right_bottom_2"
                className="rounded-lg overflow-hidden border border-gray-100"
              />
            </div>
          </aside>
        </div>

        <AdBanner
          ad_type="category_bottom_full"
          width="100%"
          className="mt-20 mb-10 rounded-xl overflow-hidden shadow-sm"
        />
      </main>
      <Footer />
    </div>
  );
}
