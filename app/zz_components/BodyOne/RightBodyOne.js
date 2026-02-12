import { createServerSupabaseClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function RightBodyOne({
  rightCategorySlug,
  rightCategoryName,
  limit = 8,
}) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data: articles, error } = await supabase
      .from("articles")
      .select(
        `
        id, title,
        article_categories!inner(category_slug)
      `,
      )
      .eq("article_categories.category_slug", rightCategorySlug || "opinion")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !articles) return null;

    return (
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h5 className="font-black text-xl text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          {rightCategoryName}
        </h5>
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.id} className="group">
              <Link href={`/article/${article.id}`} className="block">
                <h4 className="text-[15px] font-semibold text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h4>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={`/${rightCategorySlug || "opinion"}`}
          className="mt-6 block text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
        >
          전체보기 +
        </Link>
      </div>
    );
  } catch (err) {
    return null;
  }
}
