import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function RightBodyTwo({ categorySlug }) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data: imageArticles } = await supabase
      .from("articles")
      .select(
        `id, title, thumbnail_image, images_bodo, article_categories!inner(category_slug)`,
      )
      .eq("article_categories.category_slug", categorySlug)
      .order("created_at", { ascending: false })
      .range(4, 5);

    const { data: textArticles } = await supabase
      .from("articles")
      .select(`id, title, article_categories!inner(category_slug)`)
      .eq("article_categories.category_slug", categorySlug)
      .order("created_at", { ascending: false })
      .range(6, 9);

    if (!imageArticles?.length) return null;

    return (
      <div className="grid grid-cols-2 gap-x-6">
        {[0, 1].map((colIdx) => (
          <div key={colIdx} className="flex flex-col">
            {imageArticles[colIdx] && (
              <article className="group mb-6">
                <Link href={`/article/${imageArticles[colIdx].id}`}>
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-50 mb-3 border border-gray-100">
                    <Image
                      src={
                        imageArticles[colIdx].thumbnail_image ??
                        imageArticles[colIdx].images_bodo?.[0] ??
                        "/images/og_logo.png"
                      }
                      alt={imageArticles[colIdx].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="text-[15px] font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2 leading-snug">
                    {imageArticles[colIdx].title}
                  </h4>
                </Link>
              </article>
            )}
            <ul className="space-y-3">
              {textArticles
                ?.slice(colIdx * 2, (colIdx + 1) * 2)
                .map((article) => (
                  <li
                    key={article.id}
                    className="group border-t border-gray-50 pt-3"
                  >
                    <Link href={`/article/${article.id}`}>
                      <h5 className="text-[14px] font-semibold text-gray-600 group-hover:text-black line-clamp-2 leading-snug transition-colors">
                        {article.title}
                      </h5>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    );
  } catch (err) {
    return null;
  }
}
