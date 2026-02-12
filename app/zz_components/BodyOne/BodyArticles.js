import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function BodyArticles({ categorySlug }) {
  const supabase = await createServerSupabaseClient();
  try {
    const { data: articles, error } = await supabase
      .from("articles")
      .select(
        `
        id, title, content, thumbnail_image, images_bodo,
        article_categories!inner(category_slug)
      `,
      )
      .eq("article_categories.category_slug", categorySlug)
      .order("created_at", { ascending: false })
      .range(1, 3);

    if (error || !articles?.length) return null;

    const formatContent = (content) => content.replace(/<[^>]+>/g, "").trim();

    return (
      <div className="divide-y divide-gray-100">
        {articles.map((article, index) => {
          const isLast = index === articles.length - 1;
          return (
            <article
              key={article.id}
              className={`${index === 0 ? "pb-6" : "py-6"} group`}
            >
              <Link href={`/article/${article.id}`} className="flex gap-4">
                <div className="flex-1">
                  <h4 className="text-[17px] font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2 mb-2 transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {formatContent(article.content)}
                  </p>
                </div>
                {/* 마지막 기사 혹은 이미지가 있는 경우 작은 썸네일 노출 */}
                {(isLast || article.thumbnail_image) && (
                  <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-50">
                    <Image
                      src={
                        article.thumbnail_image ??
                        article.images_bodo?.[0] ??
                        "/images/og_logo.png"
                      }
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
              </Link>
            </article>
          );
        })}
      </div>
    );
  } catch (err) {
    return null;
  }
}
