"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import TenantModal from "./components/TenantModal";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function RoomManager() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // 클릭된 방 정보
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    // 방 목록과 해당 방의 '현재 입주자' 정보를 Join해서 가져옵니다.
    const { data, error } = await supabase
      .from("rooms")
      .select(
        `
        *,
        tenants (*)
      `,
      )
      .order("display_order", { ascending: true });

    if (!error) setRooms(data);
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">객실 현황</h2>
        <button
          onClick={async () => {
            const num = prompt("추가할 방 번호를 입력하세요 (예: 105호)");
            if (num) {
              await supabase
                .from("rooms")
                .insert([{ room_number: num, display_order: rooms.length }]);
              fetchRooms();
            }
          }}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm"
        >
          + 방 추가
        </button>
      </div>

      {/* 방 그리드 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleRoomClick(room)}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all hover:shadow-md ${
              room.tenants.length > 0
                ? "border-blue-100 bg-blue-50"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className="text-sm font-semibold text-gray-400 mb-1">
              {room.display_order + 1}
            </div>
            <div className="text-xl font-bold text-slate-700">
              {room.room_number}
            </div>
            <div className="mt-4">
              {room.tenants.length > 0 ? (
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {room.tenants[0].name} 입주 중
                </span>
              ) : (
                <span className="text-xs text-gray-400">공실</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 입주/퇴실 관리 모달 */}
      {isModalOpen && (
        <TenantModal
          room={selectedRoom}
          onClose={() => {
            setIsModalOpen(false);
            fetchRooms(); // 상태 업데이트 후 재조회
          }}
        />
      )}
    </div>
  );
}
