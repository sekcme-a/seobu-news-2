import Image from "next/image";
import Link from "next/link";

export default function MyPageNavbar({ selectedMenu }) {
  const item = [
    { name: "내 댓글", link: "/mypage/comments" },
    { name: "북마크", link: "/mypage/bookmarks" },
    { name: "프로필", link: "/mypage/profile" },
  ];

  return (
    <div className="flex py-6 justify-between items-center border-b-2 border-gray-900 mb-10">
      <div className="flex items-center gap-4">
        <Link href="/" className="relative w-[120px] h-[40px] block">
          <Image
            src="/images/logo.png" // 블랙 로고 사용
            alt="홈으로"
            fill
            className="object-contain"
            priority
          />
        </Link>
        <div className="w-[1px] h-4 bg-gray-300 mx-2 hidden md:block" />
        <h1 className="text-xl font-black text-gray-900 hidden md:block">
          마이페이지
        </h1>
      </div>

      <ul className="flex gap-x-6 md:gap-x-8">
        {item.map((menu) => {
          const isActive = selectedMenu === menu.name;
          return (
            <li key={menu.name}>
              <Link
                href={menu.link}
                className={`text-[15px] md:text-base transition-all pb-1 ${
                  isActive
                    ? "font-black text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400 font-medium hover:text-gray-600"
                }`}
              >
                {menu.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
