import { htmlToPlainString } from "@/utils/lib/htmlToPlainString";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import MoreArticles from "./MoreArticles";
import ArticleThumbnail from "@/components/thumbnails/ArticleThumbnail";
import AdBanner from "@/app/zz_components/AdBanner";

export default async function ArticleList({ categorySlug }) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `id, title, thumbnail_image, images_bodo, content, created_at, article_categories!inner(category_slug, is_main)`,
      )
      .eq("article_categories.category_slug", categorySlug)
      .eq("article_categories.is_main", false)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !data) return null;

    const articles = data.map((item) => ({
      ...item,
      content: htmlToPlainString(item.content),
    }));

    return (
      <section className="mt-8">
        <ul className="divide-y divide-gray-100">
          {articles.map((article, index) => (
            <li key={article.id} className="py-2">
              <ArticleThumbnail article={article} />
              {index === 4 && (
                <AdBanner
                  ad_type="category_middle_1"
                  className="rounded-lg my-5 overflow-hidden border border-gray-50"
                />
              )}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <MoreArticles categorySlug={categorySlug} />
        </div>
      </section>
    );
  } catch (err) {
    return null;
  }
}
