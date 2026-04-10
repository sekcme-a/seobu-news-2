"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    emptyRooms: 0,
    totalMonthlyRent: 0,
    unpaidThisMonth: 0,
    paidThisMonth: 0,
  });
  const [recentTenants, setRecentTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    const [{ data: rooms }, { data: tenants }, { data: payments }] =
      await Promise.all([
        supabase.from("rooms").select("*"),
        supabase.from("tenants").select("*").eq("is_active", true),
        supabase
          .from("rent_payments")
          .select("*")
          .eq("payment_year", year)
          .eq("payment_month", month)
          .eq("payment_type", "rent"),
      ]);

    const totalRooms = rooms?.length || 0;
    const occupiedRooms = rooms?.filter((r) => r.is_occupied).length || 0;
    const totalMonthlyRent =
      tenants?.reduce((s, t) => s + (t.monthly_rent || 0), 0) || 0;
    const paidThisMonth = payments?.filter((p) => p.is_paid).length || 0;
    const unpaidThisMonth = payments?.filter((p) => !p.is_paid).length || 0;

    setStats({
      totalRooms,
      occupiedRooms,
      emptyRooms: totalRooms - occupiedRooms,
      totalMonthlyRent,
      paidThisMonth,
      unpaidThisMonth,
    });
    setRecentTenants((tenants || []).slice(0, 5));
    setLoading(false);
  }

  const statCards = [
    {
      label: "전체 방",
      value: stats.totalRooms,
      unit: "개",
      color: "var(--accent)",
      icon: "🏠",
    },
    {
      label: "입주 중",
      value: stats.occupiedRooms,
      unit: "개",
      color: "var(--green)",
      icon: "✅",
    },
    {
      label: "공실",
      value: stats.emptyRooms,
      unit: "개",
      color: "var(--yellow)",
      icon: "🔑",
    },
    {
      label: "이번달 총 월세",
      value: stats.totalMonthlyRent.toLocaleString(),
      unit: "원",
      color: "var(--accent)",
      icon: "💰",
    },
    {
      label: "납부 완료",
      value: stats.paidThisMonth,
      unit: "명",
      color: "var(--green)",
      icon: "✔️",
    },
    {
      label: "미납",
      value: stats.unpaidThisMonth,
      unit: "명",
      color: "var(--red)",
      icon: "⚠️",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          대시보드
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          {year}년 {month}월 현황
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {card.label}
              </span>
              <span className="text-xl">{card.icon}</span>
            </div>
            <div className="flex items-end gap-1">
              <span
                className="text-3xl font-bold font-mono"
                style={{ color: card.color }}
              >
                {loading ? "—" : card.value}
              </span>
              <span
                className="text-sm mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                {card.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link
          href="/rooms"
          className="card p-5 flex items-center gap-4 cursor-pointer no-underline"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: "var(--accent-dim)" }}
          >
            🏠
          </div>
          <div>
            <div className="font-semibold" style={{ color: "var(--text)" }}>
              방 관리
            </div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              방 추가/편집/삭제
            </div>
          </div>
        </Link>
        <Link
          href="/rent"
          className="card p-5 flex items-center gap-4 cursor-pointer no-underline"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: "var(--green-dim)" }}
          >
            💳
          </div>
          <div>
            <div className="font-semibold" style={{ color: "var(--text)" }}>
              월세 관리
            </div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              납부 현황 확인/관리
            </div>
          </div>
        </Link>
      </div>

      {/* Recent tenants */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: "var(--text)" }}>
            현재 입주자
          </h2>
          <Link
            href="/tenants"
            className="text-sm"
            style={{ color: "var(--accent)" }}
          >
            전체 보기 →
          </Link>
        </div>
        {loading ? (
          <div
            className="text-center py-8"
            style={{ color: "var(--text-muted)" }}
          >
            불러오는 중...
          </div>
        ) : recentTenants.length === 0 ? (
          <div
            className="text-center py-8"
            style={{ color: "var(--text-muted)" }}
          >
            입주자가 없습니다
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["호수", "성함", "전화번호", "월세", "납부일"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-2 font-medium"
                    style={{ color: "var(--text-muted)", fontSize: 12 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTenants.map((t) => (
                <tr
                  key={t.id}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td
                    className="py-3 px-2 font-mono font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    {t.room_number}
                  </td>
                  <td className="py-3 px-2" style={{ color: "var(--text)" }}>
                    {t.name}
                  </td>
                  <td
                    className="py-3 px-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.phone}
                  </td>
                  <td
                    className="py-3 px-2 font-mono"
                    style={{ color: "var(--text)" }}
                  >
                    {t.monthly_rent?.toLocaleString()}원
                  </td>
                  <td
                    className="py-3 px-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    매월 {t.rent_due_day}일
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
