import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tighter">
              서부뉴스
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              서울특별시 중구 세종대로 123 서부미디어센터 15층
              <br />
              대표전화: 02-1234-5678 | 팩스: 02-1234-5679
              <br />
              등록번호: 서울 아 12345 | 등록일자: 2026.01.01
            </p>
            <p className="text-sm">
              발행인/편집인: 홍길동 | 청소년보호책임자: 김철수
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about/intro"
                  className="hover:text-white transition"
                >
                  회사소개
                </Link>
              </li>
              <li>
                <Link
                  href="/inquiry/report"
                  className="hover:text-white transition"
                >
                  기사제보
                </Link>
              </li>
              <li>
                <Link
                  href="/inquiry/ad"
                  className="hover:text-white transition"
                >
                  광고문의
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/policy/terms"
                  className="hover:text-white transition"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/policy/privacy"
                  className="text-white font-bold hover:underline transition"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/policy/youth"
                  className="hover:text-white transition"
                >
                  청소년보호정책
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>
            Copyright © {new Date().getFullYear()} SEOBU NEWS. All rights
            reserved.
          </p>
          <p className="mt-2 md:mt-0">
            모든 콘텐츠(기사)는 저작권법의 보호를 받으며, 무단 전재/복사/배포
            등을 금합니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
