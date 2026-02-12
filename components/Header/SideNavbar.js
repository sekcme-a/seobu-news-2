"use client";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useState, useRef, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { getCategories } from "@/utils/supabase/getCategories";
import Link from "next/link";

const supabase = createBrowserSupabaseClient();

const fetchCategories = async () => {
  console.log("Supabase에서 카테고리 데이터 로딩 시작...");

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, parent_id, order, slug")
    .order("order", { ascending: true });

  if (error) {
    console.error("Supabase 카테고리 로딩 오류:", error);
    throw new Error("카테고리 데이터를 불러오는 데 실패했습니다.");
  }

  return data;
};

const buildCategoryTree = (categories) => {
  const map = {};
  const tree = [];

  categories.forEach((category) => {
    map[category.id] = { ...category, children: [] };
  });

  categories.forEach((category) => {
    const item = map[category.id];
    if (item.parent_id && map[item.parent_id]) {
      map[item.parent_id].children.push(item);
    } else {
      tree.push(item);
    }
  });

  const sortTree = (nodes) => {
    nodes.sort((a, b) => a.order - b.order);
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortTree(node.children);
      }
    });
  };

  sortTree(tree);
  return tree;
};

export default function SideNavbar({ categoriess, onClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sideNavRef = useRef(null);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categoryTree = buildCategoryTree(categoriess);
        setCategories(categoryTree);
      } catch (e) {
        setError(e.message || "알 수 없는 오류가 발생했습니다.");
        console.error("카테고리 로딩 실패:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (sideNavRef.current) {
          sideNavRef.current.classList.remove("translate-x-full");
          sideNavRef.current.classList.add("translate-x-0");
        }
      }, 50);
    }
  }, [isOpen]);

  const closeSidebar = () => {
    if (sideNavRef.current) {
      sideNavRef.current.classList.remove("translate-x-0");
      sideNavRef.current.classList.add("translate-x-full");
    }

    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const CategoryItem = ({ category }) => {
    const hasChildren = category.children && category.children.length > 0;
    const [isExpanded, setIsExpanded] = useState(false);

    const href = `/${category.slug}`;

    return (
      <li className="mb-1">
        <div className="flex items-center justify-between">
          <a
            href={href}
            onClick={closeSidebar}
            className="flex-grow p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-150 font-medium"
          >
            {category.name}
          </a>
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 ml-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition duration-150"
              aria-expanded={isExpanded}
              aria-controls={`submenu-${category.id}`}
            >
              <ArrowRightIcon
                className={`transition-transform duration-200 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </div>

        {hasChildren && (
          <ul
            id={`submenu-${category.id}`}
            className={`pl-4 overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
            }`}
          >
            {category.children.map((child) => (
              <CategoryItem key={child.id} category={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <button
        onClick={() => {
          onClick();
          setTimeout(() => setIsOpen(true), 100);
        }}
        className="p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <MenuRoundedIcon style={{ fontSize: "30px" }} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
            onClick={closeSidebar}
          ></div>

          <div
            ref={sideNavRef}
            className="fixed top-0 right-0 w-[280px] md:w-[350px] h-screen bg-white shadow-2xl z-[70] translate-x-full transition-transform duration-300 ease-out flex flex-col"
          >
            {/* 헤더 섹션 */}
            <div className="flex justify-between items-center p-6 border-b">
              <span className="font-black text-xl tracking-tighter">
                CATEGORY
              </span>
              <button
                onClick={closeSidebar}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <CloseRoundedIcon />
              </button>
            </div>

            {/* 본문 네비게이션 */}
            <nav className="flex-1 overflow-y-auto p-4">
              {/* 로딩/에러 처리는 유지 */}
              <ul className="space-y-1 ">
                {categories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}

                <li className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href="/article/pdf"
                    onClick={closeSidebar}
                    className="flex items-center p-3 text-red-600 font-bold hover:bg-red-50 rounded-lg"
                  >
                    PDF 지면 보기
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="p-6 bg-gray-50 text-xs text-gray-400">
              © 2026 뉴스 홈페이지명. All rights reserved.
            </div>
          </div>
        </>
      )}
    </>
  );
}
