"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CheckoutModal from "../components/CheckoutModal";
import Link from "next/link";

export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutTenant, setCheckoutTenant] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTenants();
  }, []);

  async function fetchTenants() {
    setLoading(true);
    const { data } = await supabase
      .from("tenants")
      .select("*")
      .eq("is_active", true)
      .order("room_number");
    setTenants(data || []);
    setLoading(false);
  }

  async function handleCheckout(form) {
    const t = checkoutTenant;
    // Insert checkout history
    await supabase.from("checkout_history").insert({
      tenant_id: t.id,
      room_number: t.room_number,
      name: t.name,
      phone: t.phone,
      people_count: t.people_count,
      monthly_rent: t.monthly_rent,
      rent_start_date: t.rent_start_date,
      checkout_date: form.checkout_date,
      agency_name: t.agency_name,
      deposit: t.deposit,
      deposit_returned: form.deposit_returned,
      tax_invoice: t.tax_invoice,
      rent_due_day: t.rent_due_day,
      electric_due_day: t.electric_due_day,
      electric_invoice: t.electric_invoice,
      memo: t.memo,
      checkout_memo: form.checkout_memo,
    });
    // Mark tenant inactive
    await supabase.from("tenants").update({ is_active: false }).eq("id", t.id);
    // Mark room as empty
    await supabase
      .from("rooms")
      .update({ is_occupied: false })
      .eq("id", t.room_id);
    setCheckoutTenant(null);
    fetchTenants();
  }

  const filtered = tenants.filter(
    (t) =>
      t.name.includes(search) ||
      t.room_number.includes(search) ||
      t.phone.includes(search),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            입주자 관리
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            현재 입주 중 {tenants.length}명
          </p>
        </div>
        <input
          className="input"
          style={{ width: 240 }}
          placeholder="이름, 호수, 전화번호 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div
          className="text-center py-20"
          style={{ color: "var(--text-muted)" }}
        >
          불러오는 중...
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-20 card"
          style={{ color: "var(--text-muted)" }}
        >
          입주자가 없습니다
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: "var(--surface-2)",
                }}
              >
                {[
                  "호수",
                  "성함",
                  "전화번호",
                  "인원",
                  "월세",
                  "시작일",
                  "납부일",
                  "세금계산서",
                  "보증금",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  style={{ borderBottom: "1px solid var(--border)" }}
                  className="hover:bg-opacity-50 transition-colors"
                >
                  <td
                    className="py-3 px-4 font-mono font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    {t.room_number}
                  </td>
                  <td
                    className="py-3 px-4 font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {t.name}
                  </td>
                  <td
                    className="py-3 px-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.phone}
                  </td>
                  <td
                    className="py-3 px-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.people_count}명
                  </td>
                  <td
                    className="py-3 px-4 font-mono"
                    style={{ color: "var(--text)" }}
                  >
                    {t.monthly_rent?.toLocaleString()}원
                  </td>
                  <td
                    className="py-3 px-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.rent_start_date}
                  </td>
                  <td
                    className="py-3 px-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    매월 {t.rent_due_day}일
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge ${t.tax_invoice ? "badge-green" : "badge-blue"}`}
                    >
                      {t.tax_invoice ? "발행" : "미발행"}
                    </span>
                  </td>
                  <td
                    className="py-3 px-4 font-mono text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.deposit?.toLocaleString()}원
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/tenants/${t.id}`}
                        className="btn btn-ghost text-xs"
                      >
                        상세
                      </Link>
                      <button
                        className="btn btn-danger text-xs"
                        onClick={() => setCheckoutTenant(t)}
                      >
                        퇴실
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {checkoutTenant && (
        <CheckoutModal
          tenant={checkoutTenant}
          onClose={() => setCheckoutTenant(null)}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}
