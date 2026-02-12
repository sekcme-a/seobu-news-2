"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import MyPageNavbar from "../components/MypageNavbar";
import { useAuth } from "@/providers/AuthProvider";
import { htmlToPlainString } from "@/utils/lib/htmlToPlainString";

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function BookmarksPage() {
  const supabase = createBrowserSupabaseClient();
  const { user } = useAuth();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;

      setLoading(true);
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await supabase
        .from("bookmarks")
        .select(
          `
          id,
          created_at,
          article_id,
          articles (
            id,
            title,
            content,
            thumbnail_image,
            images_bodo,
            category,
            created_at,
            author
          )
        `,
          { count: "exact" },
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else {
        setBookmarks(data || []);
        setTotalCount(count || 0);
      }
      setLoading(false);
    };

    fetchBookmarks();
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
          {/* 네비게이션 바 */}
          <MyPageNavbar selectedMenu="북마크" />

          <div className="mt-12">
            <div className="flex items-end justify-between mb-8 border-l-4 border-gray-900 pl-4">
              <h1 className="text-2xl font-black italic tracking-tighter">
                북마크 한 기사
              </h1>
              <span className="text-gray-400 text-sm font-bold uppercase">
                총 <b className="text-blue-600">{totalCount}</b>건
              </span>
            </div>

            {loading ? (
              // 로딩 스켈레톤
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 h-48 rounded-[2rem] animate-pulse border border-gray-100"
                  ></div>
                ))}
              </div>
            ) : bookmarks.length === 0 ? (
              // 데이터 없음
              <div className="text-center py-24 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">
                  아직 북마크한 기사가 없습니다.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block text-blue-600 font-bold hover:underline underline-offset-4"
                >
                  흥미로운 기사 찾아보기 →
                </Link>
              </div>
            ) : (
              // 북마크 리스트
              <div className="grid grid-cols-1 gap-6">
                {bookmarks.map((item) => {
                  const article = item.articles;
                  if (!article) return null;

                  return (
                    <div
                      key={item.id}
                      className="group bg-white hover:bg-gray-50 transition-all duration-300 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl overflow-hidden"
                    >
                      <Link
                        href={`/article/${article.id}`}
                        className="flex flex-col md:flex-row h-full"
                      >
                        {/* 썸네일 이미지 영역 */}
                        <div className="w-full md:w-48 h-48 md:h-auto relative bg-gray-100 shrink-0 overflow-hidden">
                          {article.thumbnail_image ||
                          article.images_bodo?.[0] ? (
                            <img
                              src={
                                article.thumbnail_image ||
                                article.images_bodo?.[0]
                              }
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-xs uppercase italic">
                              No Preview
                            </div>
                          )}
                          {/* 카테고리 뱃지 */}
                          {article.category && (
                            <div className="absolute top-5 left-5">
                              <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 uppercase">
                                {article.category}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 기사 내용 영역 */}
                        <div className="px-8 py-4 flex flex-col justify-between ">
                          <div>
                            <h2 className="text-lg md:text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-[1.2] mb-4">
                              {article.title}
                            </h2>
                            <p className="text-gray-500 text-[14px] md:text-[14px] line-clamp-2 leading-relaxed font-medium">
                              {htmlToPlainString(article.content) ||
                                "본문 미리보기가 제공되지 않는 콘텐츠입니다."}
                            </p>
                          </div>

                          <div className="flex justify-between items-center  border-t border-gray-50 mt-3">
                            <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                              <span className="text-gray-900">
                                {article.author || "편집부"}
                              </span>
                              <span className="w-1 h-1 bg-gray-200 rounded-full" />
                              <span>{formatDate(article.created_at)}</span>
                            </div>
                            <div className="hidden md:flex  items-center gap-1 text-sm font-black text-blue-600">
                              <span>자세히 보기</span>
                              <svg
                                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </div>
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
                  className="p-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-20 transition-all cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-7 h-7 rounded-2xl text-sm font-black transition-all cursor-pointer ${
                        currentPage === i + 1
                          ? "bg-gray-900 text-white shadow-xl shadow-gray-200 scale-110"
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
                  className="p-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-20 transition-all cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
