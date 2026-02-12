"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchInput({ input }) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(input);

  const handleSearch = () => {
    if (searchValue.trimStart().length === 0) return;
    if (searchValue.trimStart().length < 2) {
      alert("검색어는 2글자 이상 입력해주세요.");
      return;
    }
    router.push(`/article/search?input=${searchValue}`);
  };

  return (
    <section className="w-full flex justify-center px-4">
      <div className="w-full lg:w-2/3 flex items-center mt-10 relative group">
        {/* 검색 돋보기 아이콘 (SVG) */}
        <div className="absolute left-5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="궁금한 태백 소식을 검색해보세요."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="w-full bg-white text-gray-900 placeholder-gray-400 pl-14 pr-28 py-4 rounded-[2rem]
          border border-gray-300 shadow-xl shadow-gray-100/50 outline-none 
          focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg font-medium"
        />

        {/* 검색 버튼 (입력창 내부 우측 배치) */}
        <button
          className="absolute right-2 bg-gray-900 text-white font-black px-6 py-2.5 rounded-[1.5rem] 
          hover:bg-blue-600 transition-all cursor-pointer text-sm shadow-md"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>
    </section>
  );
}
