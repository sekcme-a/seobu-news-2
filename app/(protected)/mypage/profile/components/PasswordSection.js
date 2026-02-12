"use client";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export default function PasswordSection({ email, emailVerified }) {
  const supabase = createBrowserSupabaseClient();

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert(error.message);
    else alert("재설정 이메일을 보냈습니다.");
  };

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row items-start">
        <span className="text-gray-400 font-semibold w-full md:w-1/3 text-sm uppercase tracking-wider">
          비밀번호
        </span>
        <div className="flex-1 w-full mt-2 md:mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-[14px] text-gray-600 leading-snug">
              {emailVerified
                ? "주기적인 비밀번호 변경으로 소중한 정보를 보호하세요."
                : "비밀번호를 설정하여 이메일 로그인을 활성화하세요."}
            </p>
            <button
              onClick={handlePasswordReset}
              className="px-5 py-2 text-sm font-bold bg-white border border-gray-200 text-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm shrink-0 cursor-pointer"
            >
              {emailVerified ? "비밀번호 변경" : "비밀번호 설정"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
