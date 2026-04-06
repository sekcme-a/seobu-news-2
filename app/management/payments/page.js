"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function RentManagementPage() {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  ); // YYYY-MM
  const [loading, setLoading] = useState(true);

  // 2. 데이터 가져오기 로직
  const fetchData = async () => {
    setLoading(true);
    try {
      // 세입자 정보 가져오기
      const { data: tenantsData, error: tError } = await supabase
        .from("tenants")
        .select("*")
        .order("room_number", { ascending: true });

      if (tError) throw tError;

      // 해당 월의 결제 정보 가져오기
      const { data: paymentsData, error: pError } = await supabase
        .from("payments")
        .select("*")
        .filter("billing_month", "gte", `${selectedMonth}-01`)
        .filter("billing_month", "lte", `${selectedMonth}-31`);

      if (pError) throw pError;

      setTenants(tenantsData);
      setPayments(paymentsData);
    } catch (error) {
      console.error("데이터 로드 실패:", error.message);
      alert("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  // 3. 상태 계산 로직 (화면 표시용)
  const displayList = useMemo(() => {
    return tenants.map((tenant) => {
      const startDate = new Date(tenant.start_date);
      const [year, month] = selectedMonth.split("-").map(Number);
      const targetMonthStart = new Date(year, month - 1, 1);

      // 첫 납부일 계산: 입주일 + 1개월
      const firstPaymentMonth = new Date(startDate);
      firstPaymentMonth.setMonth(firstPaymentMonth.getMonth() + 1);
      const isTarget =
        targetMonthStart >=
        new Date(
          firstPaymentMonth.getFullYear(),
          firstPaymentMonth.getMonth(),
          1,
        );

      if (!isTarget)
        return { ...tenant, status: "대상아님", paymentRecord: null };

      // DB에 저장된 결제 레코드 찾기
      const record = payments.find(
        (p) => p.tenant_id === tenant.id && p.payment_type === "월세",
      );

      let status = "미납";
      if (record) {
        status = record.is_paid ? "입금됨" : "입금대기";
      }

      return { ...tenant, status, paymentRecord: record };
    });
  }, [tenants, payments, selectedMonth]);

  // 4. 상태 변경 액션 (DB 연동)
  const handleStatusAction = async (tenant) => {
    const { status, paymentRecord } = tenant;

    try {
      if (status === "미납") {
        // 미납 -> 입금대기 (레코드 생성)
        const { error } = await supabase.from("payments").insert([
          {
            tenant_id: tenant.id,
            room_id: tenant.room_id,
            room_number: tenant.room_number,
            tenant_name: tenant.name,
            amount: tenant.monthly_rent,
            billing_month: `${selectedMonth}-01`,
            payment_type: "월세",
            is_paid: false,
          },
        ]);
        if (error) throw error;
      } else if (status === "입금대기") {
        // 입금대기 -> 입금됨 (Update)
        const { error } = await supabase
          .from("payments")
          .update({ is_paid: true, paid_at: new Date().toISOString() })
          .eq("id", paymentRecord.id);
        if (error) throw error;
      } else if (status === "입금됨") {
        // 입금됨 -> 삭제 (초기화)
        const { error } = await supabase
          .from("payments")
          .delete()
          .eq("id", paymentRecord.id);
        if (error) throw error;
      }

      // 처리 후 데이터 갱신
      fetchData();
    } catch (error) {
      alert("처리 중 오류 발생: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Rent Manager</h1>
            <p className="text-slate-500 font-medium">
              실시간 월세 수납 관리 시스템
            </p>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border flex items-center gap-3">
            <span className="pl-2 font-bold text-slate-600">조회 월</span>
            <input
              type="month"
              className="bg-white border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-800 text-white text-sm uppercase">
                <tr>
                  <th className="p-5 font-bold">호수</th>
                  <th className="p-5 font-bold">세입자명</th>
                  <th className="p-5 font-bold text-center">납기일</th>
                  <th className="p-5 font-bold">월세 금액</th>
                  <th className="p-5 font-bold">상태</th>
                  <th className="p-5 font-bold text-center">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-5">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-black text-sm">
                        {item.room_number}호
                      </span>
                    </td>
                    <td className="p-5 text-gray-700 font-semibold">
                      {item.name}
                    </td>
                    <td className="p-5 text-center text-gray-500 font-mono">
                      매달 {item.rent_due_day}일
                    </td>
                    <td className="p-5 font-bold text-slate-800">
                      {item.monthly_rent?.toLocaleString()}원
                    </td>
                    <td className="p-5">
                      <StatusTag status={item.status} />
                    </td>
                    <td className="p-5 text-center">
                      {item.status !== "대상아님" && (
                        <button
                          onClick={() => handleStatusAction(item)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 ${
                            item.status === "미납"
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : item.status === "입금대기"
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {item.status === "미납"
                            ? "입금 확인"
                            : item.status === "입금대기"
                              ? "완납 처리"
                              : "기록 취소"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusTag({ status }) {
  const themes = {
    미납: "bg-red-100 text-red-700 border-red-200",
    입금대기: "bg-amber-100 text-amber-700 border-amber-200",
    입금됨: "bg-emerald-100 text-emerald-700 border-emerald-200",
    대상아님: "bg-gray-100 text-gray-400 border-gray-200",
  };
  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider ${themes[status]}`}
    >
      {status}
    </span>
  );
}
