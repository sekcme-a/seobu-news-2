"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SideNavbar from "./SideNavbar";
import { useRouter } from "next/navigation";

export default function HeaderClient({
  children,
  scrolled,
  categories,
  isSignedIn,
}) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(scrolled ?? false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (scrolled) return;
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    if (searchValue.trim().length < 2) {
      alert("검색어를 2자 이상 입력해주세요.");
      return;
    }
    router.push(`/article/search?input=${searchValue}`);
    setShowSearch(false);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/90 " : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-[1280px] mx-auto h-16 md:h-20 flex justify-between items-center px-4 md:px-6">
        {/* 왼쪽: 로고 및 메인메뉴 (children) */}
        <div className="flex items-center">{children}</div>

        {/* 오른쪽: 유틸리티 아이콘 */}
        <nav>
          <ul className="flex items-center gap-2 md:gap-4">
            <li>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 cursor-pointer text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="검색창 열기"
              >
                <SearchRoundedIcon fontSize="medium" />
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  router.push(isSignedIn ? "/mypage/profile" : "/auth/login")
                }
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="내 계정"
              >
                <PersonOutlineRoundedIcon fontSize="medium" />
              </button>
            </li>
            <li className="ml-1 border-l pl-2 border-gray-200">
              <SideNavbar
                categoriess={categories}
                onClick={() => setShowSearch(false)}
              />
            </li>
          </ul>
        </nav>
      </div>

      {/* 검색창 영역 - 화이트 테마 최적화 */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl py-6 px-4"
          >
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="어떤 소식을 찾으시나요?"
                className="flex-1 bg-gray-100 border-none px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-gray-900 cursor-pointer text-white px-6 py-3 rounded-full font-medium hover:bg-black transition-colors"
              >
                검색
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
