"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function TenantHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("tenant_history")
      .select("*")
      .order("end_date", { ascending: false }); // 최근 퇴실순

    if (!error) setHistory(data);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">퇴실 기록 관리</h2>
          <p className="text-sm text-slate-500 mt-1">
            과거 입주자들의 정보를 확인하고 관리합니다.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
        >
          ← 객실 현황으로 돌아가기
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                퇴실일
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                호수
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                성함
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                연락처
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                보증금/월세
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                입주 기간
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                메모
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-slate-400">
                  데이터를 불러오는 중...
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-slate-400">
                  퇴실 기록이 없습니다.
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-slate-700">
                    {new Date(item.end_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm font-bold text-blue-600">
                    {item.room_number}
                  </td>
                  <td className="p-4 text-sm font-semibold text-slate-800">
                    {item.name}
                  </td>
                  <td className="p-4 text-sm text-slate-600">{item.phone}</td>
                  <td className="p-4 text-sm text-slate-600">
                    {Number(item.deposit).toLocaleString()} /{" "}
                    {Number(item.monthly_rent).toLocaleString()}
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    {item.start_date} ~{" "}
                    {new Date(item.end_date).toISOString().split("T")[0]}
                  </td>
                  <td
                    className="p-4 text-sm text-slate-500 truncate max-w-[200px]"
                    title={item.memo}
                  >
                    {item.memo}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
