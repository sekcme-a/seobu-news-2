"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import MyPageNavbar from "../components/MypageNavbar";
import { useAuth } from "@/providers/AuthProvider";

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function CommentsPage() {
  const supabase = createBrowserSupabaseClient();
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchComments = async () => {
      if (!user) return;

      setLoading(true);
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          created_at,
          articles ( id, title, thumbnail_image, images_bodo, category )
        `,
          { count: "exact" },
        )
        .eq("user_id", user.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) console.error("Error:", error);
      else {
        setComments(data || []);
        setTotalCount(count || 0);
      }
      setLoading(false);
    };

    fetchComments();
  }, [user, currentPage, supabase]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-10 pb-20">
        <div className="lg:mx-20 xl:mx-32">
          <MyPageNavbar selectedMenu="내 댓글" />

          <div className="mt-12">
            <div className="flex items-end justify-between mb-8 border-l-4 border-gray-900 pl-4">
              <h1 className="text-2xl font-black">내가 쓴 댓글</h1>
              <span className="text-gray-500 font-medium">
                총 <b className="text-blue-600">{totalCount}</b>건
              </span>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 h-32 rounded-3xl animate-pulse border border-gray-100"
                  />
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">
                  아직 작성하신 댓글이 없습니다.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block text-blue-600 font-bold hover:underline"
                >
                  기사 보러 가기
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((item) => {
                  const article = item.articles;
                  return (
                    <div
                      key={item.id}
                      className="group relative bg-white hover:bg-gray-50 transition-all rounded-xl border border-gray-300 shadow-sm hover:shadow-md overflow-hidden"
                    >
                      <Link
                        href={`/article/${article?.id}`}
                        className="flex flex-col md:flex-row h-full"
                      >
                        {/* 썸네일 영역 */}
                        <div className="w-full md:w-48 h-32 md:h-auto relative bg-gray-100 shrink-0">
                          {article?.thumbnail_image ||
                          article?.images_bodo?.[0] ? (
                            <img
                              src={
                                article.thumbnail_image ||
                                article?.images_bodo?.[0]
                              }
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                              No Image
                            </div>
                          )}
                          {article?.category && (
                            <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                              {article.category}
                            </span>
                          )}
                        </div>

                        {/* 텍스트 영역 */}
                        <div className="p-6 flex flex-col justify-between flex-grow">
                          <div>
                            {/* <p className="text-gray-400 text-[12px] font-bold mb-1 uppercase tracking-tight">
                              Original Article
                            </p> */}
                            <h2 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-3">
                              {article?.title || "삭제된 기사입니다"}
                            </h2>
                            <div className="bg-gray-50 group-hover:bg-white px-4 py-2 rounded-xl border border-gray-100 transition-colors">
                              <p className="text-gray-700 text-sm md:text-[15px] line-clamp-2 leading-relaxed font-medium">
                                "{item.content}"
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <span className="text-[12px] text-gray-400 flex items-center gap-1.5">
                              <span className="w-1 h-1 bg-gray-300 rounded-full" />
                              작성일: {formatDate(item.created_at)}
                            </span>
                            <span className="text-[12px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              기사 보기 →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 페이지네이션 */}
            {!loading && totalCount > 0 && (
              <div className="flex justify-center items-center mt-16 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                  이전
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                        currentPage === i + 1
                          ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
