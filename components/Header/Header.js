import Image from "next/image";
import HeaderClient from "./HeaderClient";
import NavList from "./NavList";
import { getCategories } from "@/utils/supabase/getCategories";
import Link from "next/link";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export default async function Header({ scrolled, hasH1 }) {
  const supabase = await createServerSupabaseClient();
  const categories = await getCategories();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isSignedIn = !!session;

  // 로고 섹션 분리 (가독성 및 SEO)
  const Logo = () => (
    <Link
      href="/"
      title="홈으로 이동"
      className="relative w-[120px] h-[40px] md:w-[160px] md:h-[45px] block"
    >
      <Image
        src="/images/logo.png" // 블랙 로고로 변경 권장
        alt="뉴스 로고"
        fill
        className="object-contain"
        priority
      />
    </Link>
  );

  return (
    <HeaderClient
      scrolled={scrolled}
      categories={categories}
      isSignedIn={isSignedIn}
    >
      <div className="flex items-center gap-8">
        {hasH1 ? (
          <h1 className="flex items-center">
            <Logo />
          </h1>
        ) : (
          <div className="flex items-center">
            <Logo />
          </div>
        )}
        {/* 데스크탑 네비게이션을 로고 옆으로 배치 (구조 변경) */}
        <div className="hidden lg:block">
          <NavList />
        </div>
      </div>
    </HeaderClient>
  );
}
