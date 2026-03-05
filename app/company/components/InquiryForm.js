"use client";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function InquiryForm({ category, categoryId }) {
  const supabase = createBrowserSupabaseClient();

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]); // 다중 파일 배열
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 관리

  const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 전체 합계 20MB 제한
  const SUBMIT_DELAY = 60 * 1000; // 도배 방지 간격 (60초)

  // 공통 파일 처리 로직 (용량 체크 및 상태 업데이트)
  const processFiles = (newFiles) => {
    const currentTotalSize = files.reduce((acc, f) => acc + f.size, 0);
    const newFilesSize = newFiles.reduce((acc, f) => acc + f.size, 0);

    if (currentTotalSize + newFilesSize > MAX_TOTAL_SIZE) {
      alert("전체 파일 크기는 20MB를 초과할 수 없습니다.");
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  // 1. 클릭하여 파일 선택 시 핸들러
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
    e.target.value = ""; // 동일 파일 재선택이 가능하도록 입력창 초기화
  };

  // 2. 드래그 앤 드롭 핸들러
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles && droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  // 3. 파일 삭제 핸들러
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 4. 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const lastSubmit = localStorage.getItem(`last_submit_${categoryId}`);
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit) < SUBMIT_DELAY) {
      const remaining = Math.ceil(
        (SUBMIT_DELAY - (now - parseInt(lastSubmit))) / 1000,
      );
      alert(
        `과도한 연속 접수를 방지하기 위해 ${remaining}초 후 다시 시도해주세요.`,
      );
      return;
    }

    if (!agreed) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const name = formData.get("name");
      const email = formData.get("email");
      const phone = formData.get("phone");
      const company = formData.get("company");
      const title = formData.get("title");
      const content = formData.get("content");

      let fileUrls = [];

      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${categoryId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("inquiry_files")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("inquiry_files").getPublicUrl(filePath);
        fileUrls.push(publicUrl);
      }

      const { error: dbError } = await supabase.from("inquiries").insert([
        {
          category,
          name,
          email,
          phone,
          company,
          title,
          content,
          file_urls: fileUrls,
        },
      ]);

      if (dbError) throw dbError;

      localStorage.setItem(`last_submit_${categoryId}`, Date.now().toString());
      alert(`[${category}] 접수가 성공적으로 완료되었습니다.`);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-200 mt-8"
    >
      {/* 개인정보 동의 영역 */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-left">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          개인정보보호를 위한 이용자 동의사항
        </h3>
        <div className="h-32 overflow-y-auto bg-white p-4 border border-gray-200 text-sm text-gray-600 mb-4 leading-relaxed">
          - 수집항목: 이름, 연락처, 이메일, 회사명, 첨부파일
          <br />- 수집목적: {category} 내용 확인 및 처리 결과 회신
          <br />- 보유기간: 목적 달성 후 3개월
        </div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-700 border-gray-300 rounded focus:ring-blue-600"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="text-sm font-bold text-gray-800 tracking-tight">
            위 내용을 확인하였으며, 개인정보 수집에 동의합니다. (필수)
          </span>
        </label>
      </div>

      {/* 입력 필드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            이름 *
          </label>
          <input
            name="name"
            type="text"
            required
            className="input-field"
            placeholder="실명을 입력해주세요"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            회사명/소속
          </label>
          <input
            name="company"
            type="text"
            className="input-field"
            placeholder="소속 기관명"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            연락처 *
          </label>
          <input
            name="phone"
            type="tel"
            required
            className="input-field"
            placeholder="010-0000-0000"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            이메일 *
          </label>
          <input
            name="email"
            type="email"
            required
            className="input-field"
            placeholder="example@domain.com"
          />
        </div>
      </div>

      <div className="text-left">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          제목 *
        </label>
        <input
          name="title"
          type="text"
          required
          className="input-field"
          placeholder="문의 제목을 입력해주세요"
        />
      </div>

      <div className="text-left">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          내용 *
        </label>
        <textarea
          name="content"
          required
          rows="6"
          className="input-field resize-none"
          placeholder="상세 내용을 적어주세요."
        ></textarea>
      </div>

      {/* 파일 첨부 영역 (드래그 앤 드롭 적용) */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
          파일 첨부 (전체 최대 20MB)
        </label>
        <div className="flex items-center justify-center w-full mb-4">
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 
              ${
                isDragging
                  ? "border-blue-500 bg-blue-50 scale-[1.01]"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className={`w-8 h-8 mb-3 transition-colors ${isDragging ? "text-blue-500" : "text-gray-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 font-semibold text-center">
                {isDragging
                  ? "여기에 파일을 놓으세요"
                  : "클릭하거나 파일을 드래그하여 추가"}
              </p>
              <p className="text-xs text-gray-400">
                PDF, JPG, PNG, DOCX, ZIP (총합 20MB 이내)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".jpg,.png,.pdf,.docx,.zip"
              multiple
            />
          </label>
        </div>

        {/* 선택된 파일 목록 */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <span className="flex-shrink-0 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded capitalize">
                    {(f.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <span className="text-sm text-gray-700 truncate">
                    {f.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0 text-red-500 hover:text-red-700 font-bold text-xs ml-4"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-auto px-20 py-4 rounded-lg font-bold text-white text-lg shadow-lg transition transform active:scale-95 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-900 hover:bg-blue-800"
          }`}
        >
          {loading ? "처리 중..." : "문의하기"}
        </button>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          outline: none;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </form>
  );
}
