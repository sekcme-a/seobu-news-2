"use client";

import { useState } from "react";
import NicknameSection from "./components/NicknameSection";
import PasswordSection from "./components/PasswordSection";
import SocialConnectSection from "./components/SocialConnectSection";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export default function MyPageClient({ initialUserData }) {
  const [userData, setUserData] = useState(initialUserData);
  const hasEmailProvider = userData.providers.includes("email");
  const socialProviders = userData.providers.filter((p) => p !== "email");

  const handleNicknameUpdate = (newNickname) => {
    setUserData((prev) => ({ ...prev, nickname: newNickname }));
  };

  return (
    <div className="l mx-auto space-y-12 pb-20">
      {/* 1. 가입 정보 섹션 */}
      <section className="bg-white rounded-3xl border border-gray-300 p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">가입 정보</h2>
          <p className="text-gray-500 text-sm mt-1">
            계정의 기본 정보를 관리합니다.
          </p>
        </div>

        <div className="space-y-1">
          {/* 이메일 행 */}
          <div className="flex flex-col md:flex-row md:items-center py-5 border-b border-gray-50">
            <span className="text-gray-400 font-semibold w-full md:w-1/3 text-sm uppercase tracking-wider">
              이메일 계정
            </span>
            <span className="text-gray-900 font-medium text-lg mt-1 md:mt-0">
              {userData.email}
            </span>
          </div>

          <NicknameSection
            currentNickname={userData.nickname}
            onUpdate={handleNicknameUpdate}
          />

          <PasswordSection
            email={userData.email}
            hasPasswordSet={hasEmailProvider}
            emailVerified={userData.emailVerified}
          />
        </div>
      </section>

      {/* 2. 소셜 로그인 섹션 */}
      <section className="bg-white rounded-3xl border border-gray-300 p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">연결된 서비스</h2>
          <p className="text-gray-500 text-sm mt-1">
            소셜 계정을 통해 간편하게 로그인하세요.
          </p>
        </div>
        <SocialConnectSection
          socialProviders={socialProviders}
          totalLoginMethods={userData.providers.length}
        />
      </section>

      <div className="flex justify-center pt-4">
        <button
          onClick={async () => {
            const supabase = createBrowserSupabaseClient();
            await supabase.auth.signOut();
            window.location.href = "/auth/login";
          }}
          className="text-gray-400 hover:text-red-500 text-sm font-medium underline underline-offset-4 transition-colors cursor-pointer"
        >
          안전하게 로그아웃
        </button>
      </div>
    </div>
  );
}
