"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function Articles({ categorySlug, categoryName }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: dataWithImg } = await supabase
        .from("articles")
        .select(
          `id, title, thumbnail_image, images_bodo, article_categories!inner(category_slug)`,
        )
        .eq("article_categories.category_slug", categorySlug)
        .order("created_at", { ascending: false })
        .limit(1);

      const { data: textData } = await supabase
        .from("articles")
        .select(`id, title, article_categories!inner(category_slug)`)
        .eq("article_categories.category_slug", categorySlug)
        .order("created_at", { ascending: false })
        .range(1, 2);

      setList([...(dataWithImg || []), ...(textData || [])]);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="h-64 bg-gray-50 animate-pulse rounded-2xl"></div>;
  if (list.length === 0) return null;

  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* 카테고리 헤더 */}
      <Link
        href={`/${categorySlug}`}
        className="group flex items-center justify-between mb-4 pb-3 border-b border-gray-50"
      >
        <p className="text-lg font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
          {categoryName}
        </p>
        <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
          <AddRoundedIcon style={{ fontSize: "16px" }} />
        </div>
      </Link>

      <ul className="space-y-4">
        {/* 대표 이미지 기사 */}
        {list[0] && (
          <li>
            <article className="group">
              <Link href={`/article/${list[0].id}`}>
                <div className="rounded-xl overflow-hidden relative w-full h-32 bg-gray-100">
                  <Image
                    src={
                      list[0].thumbnail_image ??
                      list[0].images_bodo?.[0] ??
                      "/images/og_logo.png"
                    }
                    alt={list[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-[15px] mt-3 line-clamp-2 leading-snug text-gray-800 group-hover:text-blue-600 transition-colors">
                  {list[0].title}
                </h4>
              </Link>
            </article>
          </li>
        )}

        {/* 일반 텍스트 리스트 */}
        {list.slice(1).map((item) => (
          <li key={item.id} className="pt-3 border-t border-gray-50 group">
            <Link href={`/article/${item.id}`}>
              <h5 className="text-[14px] font-medium text-gray-600 group-hover:text-black line-clamp-2 leading-snug transition-colors">
                {item.title}
              </h5>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
