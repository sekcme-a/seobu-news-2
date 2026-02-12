"use client";

const providerMap = { github: "GitHub", google: "Google", kakao: "카카오톡" };

export default function SocialConnectSection({
  socialProviders,
  totalLoginMethods,
}) {
  return (
    <div className="space-y-3">
      {socialProviders.length > 0 ? (
        socialProviders.map((provider) => (
          <div
            key={provider}
            className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center text-[10px] font-bold">
                {provider.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-gray-800">
                {providerMap[provider] || provider}
              </span>
              <span className="text-[12px] text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                연결됨
              </span>
            </div>
            {/* <button
              onClick={() => alert("연결 해제는 고객센터를 통해 문의해주세요.")}
              className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              연결 해제
            </button> */}
          </div>
        ))
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm">연결된 소셜 계정이 없습니다.</p>
        </div>
      )}
      <p className="text-[12px] text-gray-400 mt-4 px-2">
        * 보안을 위해 최소 하나 이상의 로그인 수단이 유지되어야 합니다.
      </p>
    </div>
  );
}
