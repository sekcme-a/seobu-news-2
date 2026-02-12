"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function NicknameSection({ currentNickname, onUpdate }) {
  const supabase = createBrowserSupabaseClient();
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(currentNickname);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateNickname = async () => {
    if (!newNickname || newNickname === currentNickname) {
      setIsEditing(false);
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { display_name: newNickname },
    });
    await supabase
      .from("profiles")
      .update({ display_name: newNickname })
      .eq("id", (await supabase.auth.getUser()).data.user.id);
    setIsLoading(false);

    if (error) alert(`오류: ${error.message}`);
    else {
      onUpdate(newNickname);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-gray-50 group">
      <span className="text-gray-400 font-semibold w-full md:w-1/3 text-sm uppercase tracking-wider">
        닉네임
      </span>
      <div className="flex-1 flex items-center justify-between mt-2 md:mt-0">
        {isEditing ? (
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            className="flex-1 border-2 border-blue-500 rounded-xl px-3 py-1.5 text-md font-bold focus:outline-none"
            autoFocus
          />
        ) : (
          <span className="text-gray-900 font-bold text-md">
            {currentNickname}
          </span>
        )}

        <div className="flex gap-2 ml-4">
          <button
            onClick={
              isEditing ? handleUpdateNickname : () => setIsEditing(true)
            }
            className="px-4 py-1.5 text-sm font-bold rounded-lg bg-gray-900 text-white hover:bg-blue-600 transition-colors cursor-pointer"
          >
            {isEditing ? "저장" : "변경"}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setNewNickname(currentNickname);
              }}
              className="px-4 py-1.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
