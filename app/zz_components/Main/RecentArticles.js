import { createServerSupabaseClient } from "@/utils/supabase/server";
import Link from "next/link";
import AdBanner from "../AdBanner";

export default async function RecentArticles() {
  const supabase = await createServerSupabaseClient();

  const { data: adData } = await supabase
    .from("advertisements")
    .select("image_url, target_url, ad_type")
    .eq("ad_type", "main_top_right")
    .maybeSingle();

  try {
    const { data: recentArticles, error } = await supabase
      .from("articles")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(adData ? 6 : 8);

    if (error) throw error;

    return (
      <div className="flex flex-col gap-5">
        <ul className="divide-y divide-gray-50">
          {recentArticles.map((article, index) => (
            <li key={article.id} className="py-3 first:pt-0 group">
              <Link href={`/article/${article.id}`} className="flex gap-3">
                <span
                  className={`text-lg font-black ${index < 3 ? "text-blue-600" : "text-gray-300"}`}
                >
                  {index + 1}
                </span>
                <span className="text-[15px] font-medium text-gray-700 group-hover:text-black line-clamp-2 leading-snug">
                  {article.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {adData && (
          <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
            <AdBanner data={adData} />
          </div>
        )}
      </div>
    );
  } catch (err) {
    return (
      <p className="text-gray-400 text-sm">최신 뉴스를 가져올 수 없습니다.</p>
    );
  }
}
