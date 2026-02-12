import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function LeftBodyTwo({ categorySlug }) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data: fullData } = await supabase
      .from("articles")
      .select(
        `id, title, thumbnail_image, images_bodo, content, article_categories!inner(category_slug)`,
      )
      .eq("article_categories.category_slug", categorySlug)
      .order("created_at", { ascending: false })
      .limit(1);

    const { data: datas } = await supabase
      .from("articles")
      .select(`id, title, article_categories!inner(category_slug)`)
      .eq("article_categories.category_slug", categorySlug)
      .order("created_at", { ascending: false })
      .range(1, 3);

    if (!fullData?.[0]) return null;

    const fullArticle = fullData[0];
    const plainContent = fullArticle.content.replace(/<[^>]+>/g, "").trim();

    return (
      <div className="flex flex-col h-full">
        <article className="group">
          <Link href={`/article/${fullArticle.id}`} className="block">
            <h4 className="text-[22px] font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-4">
              {fullArticle.title}
            </h4>
            <div className="flex gap-x-5 items-start">
              <div className="flex-1 relative h-32 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                <Image
                  src={
                    fullArticle.thumbnail_image ??
                    fullArticle.images_bodo?.[0] ??
                    "/images/og_logo.png"
                  }
                  alt={fullArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-[1.2]">
                <p className="text-[14.5px] leading-relaxed line-clamp-4 text-gray-500">
                  {plainContent}
                </p>
              </div>
            </div>
          </Link>
        </article>

        <ul className="mt-8 space-y-4">
          {datas?.map((article) => (
            <li
              key={article.id}
              className="group border-b border-gray-50 pb-4 last:border-0"
            >
              <Link
                href={`/article/${article.id}`}
                className="flex items-center gap-2"
              >
                <span className="w-1 h-1 bg-gray-300 rounded-full group-hover:bg-blue-600"></span>
                <h5 className="text-[16px] font-medium text-gray-700 group-hover:text-black line-clamp-1 transition-colors">
                  {article.title}
                </h5>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (err) {
    return null;
  }
}
