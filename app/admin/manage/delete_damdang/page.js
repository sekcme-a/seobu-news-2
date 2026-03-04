"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useState } from "react";

//"담당 부서" 가 들어있는 기사들 모두 담당 부서 부분 내용 지우기
export default function ArticleCleaner() {
  const supabase = createBrowserSupabaseClient();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. 시흥 카테고리 기사 가져오기 및 가공
  const fetchAndProcessArticles = async () => {
    setLoading(true);

    // 조인 쿼리를 통해 'siheung' 카테고리 기사만 추출
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id, 
        title, 
        content,
        article_categories!inner(category_slug)
      `,
      )
      .eq("article_categories.category_slug", "siheung");

    if (error) {
      console.error("Error fetching articles:", error);
      alert("데이터를 가져오는데 실패했습니다.");
    } else {
      // "담당 부서"가 포함된 기사만 필터링 및 내용 수정 시뮬레이션
      const targetArticles = data
        .filter((art) => art.content && art.content.includes("담당 부서"))
        .map((art) => {
          // '담당 부서' 키워드 앞부분만 추출 (보통 <br> 태그가 앞에 붙으므로 이를 고려)
          const searchKeyword = "<br><br>담당 부서";
          let newContent = art.content;

          if (art.content.includes(searchKeyword)) {
            newContent = art.content.split(searchKeyword)[0] + "</p>";
          } else if (art.content.includes("담당 부서")) {
            newContent = art.content.split("담당 부서")[0] + "</p>";
          }

          return { ...art, newContent };
        });

      setArticles(targetArticles);
    }
    setLoading(false);
  };

  // 2. 가공된 내용으로 DB 업데이트
  const handleUpdate = async () => {
    if (!confirm(`${articles.length}개의 기사 내용을 수정하시겠습니까?`))
      return;

    setLoading(true);
    try {
      const updatePromises = articles.map((art) =>
        supabase
          .from("articles")
          .update({ content: art.newContent })
          .eq("id", art.id),
      );

      await Promise.all(updatePromises);
      alert("성공적으로 변경되었습니다.");
      setArticles([]); // 목록 비우기
    } catch (err) {
      console.error(err);
      alert("업데이트 중 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{`시흥 기사 "담당 부서" 정보 변경 도구`}</h2>
      <button onClick={fetchAndProcessArticles} disabled={loading}>
        {loading ? "로딩 중..." : "시흥 기사 불러오기"}
      </button>

      {articles.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>수정 대상 목록 ({articles.length}건)</h3>
          <button
            onClick={handleUpdate}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            일괄 변경 반영하기
          </button>

          <table
            border="1"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th>제목</th>
                <th>기존 내용 (일부)</th>
                <th>변경 후 내용 (일부)</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((art) => (
                <tr key={art.id}>
                  <td style={{ padding: "10px" }}>{art.title}</td>
                  <td style={{ fontSize: "12px", color: "gray" }}>
                    {art.content.substring(art.content.length - 100)}
                  </td>
                  <td style={{ fontSize: "12px", color: "blue" }}>
                    {art.newContent.substring(art.newContent.length - 100)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
