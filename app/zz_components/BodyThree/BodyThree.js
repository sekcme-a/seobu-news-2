import Articles from "./Articles";

export default function BodyThree({ categorys = [] }) {
  return (
    <section className="mt-16 pt-12 border-t-2 border-black">
      {/* 제목 영역 추가 (SEO 및 구조 차별화) */}
      <div className="mb-8">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
          카테고리별 뉴스
        </h3>
        <div className="w-12 h-1 bg-blue-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categorys.map((category, index) => (
          <Articles
            categorySlug={category.slug}
            categoryName={category.name}
            key={category.slug || index}
          />
        ))}
      </div>
    </section>
  );
}
