import { createServerSupabaseClient } from "@/utils/supabase/server";
import {
  getParentCategory,
  getChildCategories,
} from "@/utils/supabase/getCategories";
import ArticleSmallThumbnail from "@/components/thumbnails/AritlceSmallThumbnail";

export default async function HeadlineList({ categorySlug }) {
  const supabase = await createServerSupabaseClient();
  const parentCategory = await getParentCategory(categorySlug);
  const categories = await getChildCategories(parentCategory.slug);
  const slugs = categories?.map((item) => item.slug) || [];

  let articles = [];
  try {
    if (slugs.length === 0) {
      const { data } = await supabase.rpc("get_random_articles_within_days", {
        days: 15,
        count: 7,
      });
      articles = data || [];
    } else {
      const { data } = await supabase
        .from("article_categories")
        .select("articles(title, thumbnail_image, images_bodo, id)")
        .in("category_slug", slugs)
        .eq("is_main", true)
        .limit(7);
      articles = data?.map((item) => item.articles) || [];
    }

    return (
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h3 className="font-black text-lg text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
          {slugs.length === 0 ? "인기 기사" : `${parentCategory.name} 핫이슈`}
        </h3>
        <ul className="flex flex-col gap-1">
          {articles.map((article, index) => (
            <ArticleSmallThumbnail
              article={article}
              key={article.id || index}
            />
          ))}
        </ul>
      </div>
    );
  } catch (err) {
    return null;
  }
}
