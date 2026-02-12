import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function BodyFullArticle({ categorySlug }) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id, title, thumbnail_image, images_bodo, content,
        article_categories!inner(category_slug)
      `,
      )
      .eq("article_categories.category_slug", categorySlug)
      .limit(1);

    if (error || !data?.[0]) return null;
    const article = data[0];

    const plainContent = article.content
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return (
      <article className="group">
        <Link href={`/article/${article.id}`} className="block">
          <div className="relative w-full h-60 md:h-72 rounded-2xl overflow-hidden bg-gray-50 mb-6">
            <Image
              src={
                article.thumbnail_image ??
                article.images_bodo?.[0] ??
                "/images/og_logo.png"
              }
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h4 className="text-2xl font-extrabold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {article.title}
          </h4>
          <p className="text-[15px] text-gray-500 line-clamp-3 leading-relaxed">
            {plainContent}
          </p>
        </Link>
      </article>
    );
  } catch (err) {
    return null;
  }
}
