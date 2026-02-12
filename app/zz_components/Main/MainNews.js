import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function MainNews() {
  const supabase = await createServerSupabaseClient();

  try {
    const { data: headlineData } = await supabase
      .from("article_categories")
      .select("article_id")
      .eq("category_slug", "general")
      .eq("is_main", true)
      .maybeSingle();

    const { data: articleList, error } = await supabase.rpc(
      "get_unique_main_articles",
      { p_limit: 4, p_exclude_id: headlineData?.article_id },
    );

    if (error || !articleList?.length)
      return <p className="text-gray-400">소식이 없습니다.</p>;

    return (
      <ul className="space-y-6">
        {articleList.map((article, index) => (
          <li key={article.id}>
            <Link
              href={`/article/${article.id}`}
              className="group flex gap-4 items-start"
            >
              <div className="flex-1">
                <h4 className="text-[16px] font-bold text-gray-800 leading-snug group-hover:text-blue-600 line-clamp-2 transition-colors">
                  {article.title}
                </h4>
                {index === 0 && (
                  <p className="mt-2 text-xs text-gray-400 uppercase tracking-wider">
                    Top Story
                  </p>
                )}
              </div>
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
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
            </Link>
            {index !== articleList.length - 1 && (
              <hr className="mt-6 border-gray-100" />
            )}
          </li>
        ))}
      </ul>
    );
  } catch (err) {
    return null;
  }
}
