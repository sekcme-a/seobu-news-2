import {
  getCategory,
  getParentCategory,
  getChildCategories,
} from "@/utils/supabase/getCategories";
import Link from "next/link";

export default async function Navbar({ categorySlug }) {
  const parentCategory = await getParentCategory(categorySlug);
  const categories = await getChildCategories(parentCategory.slug);
  const currentCategory = await getCategory(categorySlug);

  if (!categories) return null;

  return (
    <nav className="relative  border-gray-900 pb-4">
      <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-8">
        {parentCategory.name}
      </h2>

      {categories.length > 0 && (
        <div className="relative mt-6">
          <ul className="flex gap-x-6 overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth pr-10 py-1">
            {[{ ...parentCategory, name: "전체" }, ...categories].map(
              (cat, index) => {
                const isActive = currentCategory.slug === cat.slug;
                return (
                  <li key={index} className="flex-shrink-0">
                    <Link href={`/${cat.slug}`}>
                      <span
                        className={`text-[17px] font-bold transition-colors pb-2 block border-b-2 ${
                          isActive
                            ? "text-blue-600 border-blue-600"
                            : "text-gray-800 border-transparent hover:text-gray-600"
                        }`}
                      >
                        {cat.name}
                      </span>
                    </Link>
                  </li>
                );
              },
            )}
          </ul>
          {/* 라이트 테마용 페이드 효과 */}
          <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white via-white/50 to-transparent" />
        </div>
      )}
    </nav>
  );
}
