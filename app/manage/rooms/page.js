"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import RoomModal from "../components/RoomModal";
import TenantModal from "../components/TenantModal";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [tenantRoom, setTenantRoom] = useState(null); // room to register tenant

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    setLoading(true);
    const { data } = await supabase
      .from("rooms")
      .select("*, tenants(*)")
      .order("room_number");
    setRooms(data || []);
    setLoading(false);
  }

  async function handleSaveRoom(form) {
    if (editRoom) {
      await supabase
        .from("rooms")
        .update({
          floor: form.floor ? Number(form.floor) : null,
          area: form.area ? Number(form.area) : null,
          memo: form.memo,
        })
        .eq("id", editRoom.id);
    } else {
      const { error } = await supabase.from("rooms").insert({
        room_number: form.room_number,
        floor: form.floor ? Number(form.floor) : null,
        area: form.area ? Number(form.area) : null,
        memo: form.memo,
      });
      if (error) return alert("호수가 중복되었거나 오류가 발생했습니다.");
    }
    setShowRoomModal(false);
    setEditRoom(null);
    fetchRooms();
  }

  async function handleDeleteRoom(room) {
    if (room.is_occupied)
      return alert("입주자가 있는 방은 삭제할 수 없습니다.");
    if (!confirm(`${room.room_number}호를 삭제하시겠습니까?`)) return;
    await supabase.from("rooms").delete().eq("id", room.id);
    fetchRooms();
  }

  async function handleRegisterTenant(form) {
    // Create tenant
    const { data: tenant, error } = await supabase
      .from("tenants")
      .insert({
        ...form,
        monthly_rent: Number(form.monthly_rent),
        deposit: Number(form.deposit) || 0,
        people_count: Number(form.people_count) || 1,
        rent_due_day: Number(form.rent_due_day),
        electric_due_day: form.electric_due_day
          ? Number(form.electric_due_day)
          : null,
        is_active: true,
      })
      .select()
      .single();
    if (error) return alert("등록 중 오류가 발생했습니다.");

    // Mark room as occupied
    await supabase
      .from("rooms")
      .update({ is_occupied: true })
      .eq("id", form.room_id);

    // Create rent payment record for current month
    const now = new Date();
    await supabase.from("rent_payments").insert({
      tenant_id: tenant.id,
      room_number: form.room_number,
      tenant_name: form.name,
      payment_year: now.getFullYear(),
      payment_month: now.getMonth() + 1,
      amount: Number(form.monthly_rent),
      is_paid: false,
      payment_type: "rent",
    });

    setTenantRoom(null);
    fetchRooms();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            방 관리
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            전체 {rooms.length}개 · 입주{" "}
            {rooms.filter((r) => r.is_occupied).length}개 · 공실{" "}
            {rooms.filter((r) => !r.is_occupied).length}개
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditRoom(null);
            setShowRoomModal(true);
          }}
        >
          + 방 추가
        </button>
      </div>

      {loading ? (
        <div
          className="text-center py-20"
          style={{ color: "var(--text-muted)" }}
        >
          불러오는 중...
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {rooms.map((room) => {
            const activeTenant = room.tenants?.find((t) => t.is_active);
            return (
              <div key={room.id} className="card p-5">
                {/* Room header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div
                      className="text-2xl font-bold font-mono"
                      style={{ color: "var(--accent)" }}
                    >
                      {room.room_number}호
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {room.floor ? `${room.floor}층` : ""}
                      {room.area ? ` · ${room.area}㎡` : ""}
                    </div>
                  </div>
                  <span
                    className={`badge ${room.is_occupied ? "badge-green" : "badge-yellow"}`}
                  >
                    {room.is_occupied ? "입주 중" : "공실"}
                  </span>
                </div>

                {/* Tenant info */}
                {activeTenant ? (
                  <div
                    className="rounded-lg p-3 mb-3 text-sm"
                    style={{ background: "var(--surface-2)" }}
                  >
                    <div
                      className="font-semibold mb-1"
                      style={{ color: "var(--text)" }}
                    >
                      {activeTenant.name}
                    </div>
                    <div style={{ color: "var(--text-muted)" }}>
                      {activeTenant.phone}
                    </div>
                    <div
                      className="mt-1 font-mono text-xs"
                      style={{ color: "var(--accent)" }}
                    >
                      {activeTenant.monthly_rent?.toLocaleString()}원 / 월
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-lg p-3 mb-3 text-sm text-center"
                    style={{
                      background: "var(--surface-2)",
                      color: "var(--text-muted)",
                    }}
                  >
                    공실
                  </div>
                )}

                {room.memo && (
                  <div
                    className="text-xs mb-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    📝 {room.memo}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {!room.is_occupied && (
                    <button
                      className="btn btn-success flex-1 text-xs"
                      onClick={() => setTenantRoom(room)}
                    >
                      입주 등록
                    </button>
                  )}
                  <button
                    className="btn btn-ghost text-xs"
                    onClick={() => {
                      setEditRoom(room);
                      setShowRoomModal(true);
                    }}
                  >
                    편집
                  </button>
                  {!room.is_occupied && (
                    <button
                      className="btn btn-danger text-xs"
                      onClick={() => handleDeleteRoom(room)}
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showRoomModal && (
        <RoomModal
          room={editRoom}
          onClose={() => {
            setShowRoomModal(false);
            setEditRoom(null);
          }}
          onSave={handleSaveRoom}
        />
      )}

      {tenantRoom && (
        <TenantModal
          room={tenantRoom}
          onClose={() => setTenantRoom(null)}
          onSave={handleRegisterTenant}
        />
      )}
    </div>
  );
}
