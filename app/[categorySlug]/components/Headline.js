import { htmlToPlainString } from "@/utils/lib/htmlToPlainString";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function Headline({ categorySlug }) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("article_categories")
      .select("articles(title, thumbnail_image, images_bodo, content, id)")
      .eq("category_slug", categorySlug)
      .eq("is_main", true)
      .maybeSingle();

    if (error || !data) return null;

    const plainContent = htmlToPlainString(data.articles.content);
    const article = { ...data.articles, content: plainContent };

    return (
      <Link href={`/article/${article.id}`} className="group">
        <article className="grid md:grid-cols-5 gap-8 items-center bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 transition-all hover:bg-gray-100/50">
          <div className="md:col-span-3 order-2 md:order-1">
            <h3 className="font-extrabold text-2xl md:text-3xl text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-500 text-[15px] md:text-base leading-relaxed mt-4 line-clamp-3">
              {article.content}
            </p>
          </div>
          <div className="md:col-span-2 order-1 md:order-2">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={
                  article.thumbnail_image ??
                  article.images_bodo?.[0] ??
                  "/images/og_logo.png"
                }
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </article>
      </Link>
    );
  } catch (err) {
    return null;
  }
}
