"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function TenantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tenant, setTenant] = useState(null);
  const [payments, setPayments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);
    const [{ data: t }, { data: p }] = await Promise.all([
      supabase.from("tenants").select("*").eq("id", id).single(),
      supabase
        .from("rent_payments")
        .select("*")
        .eq("tenant_id", id)
        .order("payment_year", { ascending: false })
        .order("payment_month", { ascending: false }),
    ]);
    setTenant(t);
    setForm(t || {});
    setPayments(p || []);
    setLoading(false);
  }

  async function handleSave() {
    await supabase
      .from("tenants")
      .update({
        name: form.name,
        phone: form.phone,
        people_count: Number(form.people_count),
        monthly_rent: Number(form.monthly_rent),
        agency_name: form.agency_name,
        deposit: Number(form.deposit),
        tax_invoice: form.tax_invoice,
        rent_due_day: Number(form.rent_due_day),
        electric_due_day: form.electric_due_day
          ? Number(form.electric_due_day)
          : null,
        electric_invoice: form.electric_invoice,
        memo: form.memo,
      })
      .eq("id", id);
    setEditing(false);
    fetchData();
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  if (loading)
    return (
      <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
        불러오는 중...
      </div>
    );
  if (!tenant)
    return (
      <div className="text-center py-20" style={{ color: "var(--red)" }}>
        입주자를 찾을 수 없습니다.
      </div>
    );

  const fields = [
    { label: "성함", name: "name", type: "text" },
    { label: "전화번호", name: "phone", type: "text" },
    { label: "인원", name: "people_count", type: "number" },
    { label: "월세 (원)", name: "monthly_rent", type: "number" },
    { label: "부동산", name: "agency_name", type: "text" },
    { label: "보증금 (원)", name: "deposit", type: "number" },
    { label: "월세 납부일", name: "rent_due_day", type: "number" },
    { label: "전기세 납부일", name: "electric_due_day", type: "number" },
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button className="btn btn-ghost text-sm" onClick={() => router.back()}>
          ← 뒤로
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            <span style={{ color: "var(--accent)" }}>
              {tenant.room_number}호
            </span>{" "}
            — {tenant.name}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            입주일: {tenant.rent_start_date}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          {editing ? (
            <>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setEditing(false);
                  setForm(tenant);
                }}
              >
                취소
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                저장
              </button>
            </>
          ) : (
            <button className="btn btn-ghost" onClick={() => setEditing(true)}>
              편집
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Info card */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4" style={{ color: "var(--text)" }}>
            기본 정보
          </h2>
          <div className="flex flex-col gap-3">
            {fields.map((f) => (
              <div key={f.name} className="flex items-center justify-between">
                <span
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {f.label}
                </span>
                {editing ? (
                  <input
                    className="input text-right"
                    style={{ width: 180 }}
                    name={f.name}
                    type={f.type}
                    value={form[f.name] || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    {f.name.includes("rent") || f.name === "deposit"
                      ? tenant[f.name]
                        ? `${Number(tenant[f.name]).toLocaleString()}원`
                        : "—"
                      : tenant[f.name] || "—"}
                    {f.name.includes("day") && tenant[f.name] ? "일" : ""}
                  </span>
                )}
              </div>
            ))}
            {/* Checkboxes */}
            {[
              { label: "세금계산서", name: "tax_invoice" },
              { label: "전기세 계산서", name: "electric_invoice" },
            ].map((f) => (
              <div key={f.name} className="flex items-center justify-between">
                <span
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {f.label}
                </span>
                {editing ? (
                  <input
                    type="checkbox"
                    name={f.name}
                    checked={!!form[f.name]}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                ) : (
                  <span
                    className={`badge ${tenant[f.name] ? "badge-green" : "badge-blue"}`}
                  >
                    {tenant[f.name] ? "발행" : "미발행"}
                  </span>
                )}
              </div>
            ))}
            <div className="flex items-start justify-between">
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                메모
              </span>
              {editing ? (
                <textarea
                  className="input text-right"
                  style={{ width: 220 }}
                  name="memo"
                  value={form.memo || ""}
                  onChange={handleChange}
                  rows={2}
                />
              ) : (
                <span
                  className="text-sm text-right"
                  style={{ color: "var(--text)", maxWidth: 220 }}
                >
                  {tenant.memo || "—"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment history */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4" style={{ color: "var(--text)" }}>
            납부 내역
          </h2>
          {payments.length === 0 ? (
            <div
              className="text-center py-8"
              style={{ color: "var(--text-muted)" }}
            >
              납부 내역 없음
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ background: "var(--surface-2)" }}
                >
                  <div className="text-sm">
                    <span
                      className="font-mono"
                      style={{ color: "var(--text)" }}
                    >
                      {p.payment_year}년 {p.payment_month}월
                    </span>
                    <span
                      className="ml-2 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {p.payment_type === "rent" ? "월세" : "전기세"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-sm"
                      style={{ color: "var(--text)" }}
                    >
                      {p.amount?.toLocaleString()}원
                    </span>
                    <span
                      className={`badge ${p.is_paid ? "badge-green" : "badge-red"}`}
                    >
                      {p.is_paid ? `${p.paid_at || "납부완료"}` : "미납"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
