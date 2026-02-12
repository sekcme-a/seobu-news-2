import { createServerSupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function Headline() {
  const supabase = await createServerSupabaseClient();

  const { data: articles, error } = await supabase
    .from("article_categories")
    .select("articles(title, thumbnail_image, id, images_bodo, content)")
    .eq("category_slug", "general")
    .eq("is_main", true);

  if (error) return <div className="py-10 text-gray-400">데이터 로딩 오류</div>;

  const articleData = articles?.[0]?.articles;
  if (!articleData) return null;

  return (
    <Link href={`/article/${articleData.id}`} className="group block">
      <article className="overflow-hidden">
        <div className="relative w-full h-[250px] md:h-[450px] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
          <Image
            src={
              articleData.thumbnail_image ??
              articleData.images_bodo?.[0] ??
              "/images/og_logo.png"
            }
            alt={articleData.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          {/* 이미지 위 오버레이 (선택사항: 뉴스 가독성 향상) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="mt-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-[1.3] group-hover:text-blue-600 transition-colors line-clamp-2">
            {articleData.title}
          </h2>
          <p className="mt-3 text-gray-500 line-clamp-2 text-sm md:text-base leading-relaxed">
            {articleData.content?.replace(/<[^>]*>?/gm, "").slice(0, 150)}...
          </p>
        </div>
      </article>
    </Link>
  );
}
