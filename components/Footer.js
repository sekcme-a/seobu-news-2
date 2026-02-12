import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  // 텍스트 스타일 통일
  const TEXT_STYLE =
    "text-[13px] text-gray-500 hover:text-gray-800 transition-colors";

  const FOOTER_ONE = [
    "주소 - 경기도 시흥시 장현동 671-5 시티프론트561 더파이브437호",
    "전화 - 031-311-8272",
    "발행인 - 심귀자",
    "편집인 - 심귀자",
    "청소년보호책임자 - 심귀자",
  ];

  const FOOTER_TWO = ["사업자명 - 서부뉴스", "사업자등록번호 - 710-81-02517"];

  return (
    <footer className="w-full bg-gray-50 mt-20 border-t border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 py-12 lg:py-16">
        {/* 상단 로고 및 정책 링크 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-8 border-b border-gray-200 gap-6">
          <Image
            src="/images/logo.png" // 화이트 배경용 블랙 로고로 변경 권장
            alt="뉴스 로고"
            width={140}
            height={32}
            className="object-contain"
          />

          {/* <nav>
            <ul className="flex gap-6 text-[14px] font-bold text-gray-700">
              <li>
                <Link href="/policy/terms" className="hover:text-blue-600">
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/policy/privacy"
                  className="hover:text-blue-600 text-blue-600"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600">
                  기사제보
                </Link>
              </li>
            </ul>
          </nav> */}
        </div>

        {/* 하단 기업 정보 영역 */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <ul className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2">
            {FOOTER_ONE.map((item, index) => (
              <li key={index} className="flex items-center gap-4">
                <span className={TEXT_STYLE}>{item}</span>
                {index !== FOOTER_ONE.length - 1 && (
                  <div className="hidden md:block w-[1px] h-2.5 bg-gray-300" />
                )}
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2">
            {FOOTER_TWO.map((item, index) => (
              <li key={index} className="flex items-center gap-4">
                <span className={TEXT_STYLE}>{item}</span>
                {index !== FOOTER_TWO.length - 1 && (
                  <div className="hidden md:block w-[1px] h-2.5 bg-gray-300" />
                )}
              </li>
            ))}
          </ul>

          {/* 저작권 및 면책 공지 - 박스 디자인 적용 */}
          <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
            <p className="text-[13px] text-gray-400 leading-relaxed">
              본 사이트의 모든 기사와 이미지 등 콘텐츠는 저작권법의 보호를
              받습니다. 무단 전재, 복사, 배포 시 법적 책임을 물을 수 있습니다.
            </p>
            <p className="text-[13px] text-gray-400 font-medium mt-2">
              Copyright ©{" "}
              <span className="text-gray-600 font-bold tracking-tight">
                WESTERN NEWS Co., Ltd.
              </span>{" "}
              All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
