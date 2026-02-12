"use client";

import { useAuth } from "@/providers/AuthProvider";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useState, useEffect, useCallback } from "react";

/** 아이콘 컴포넌트들 (SVG - 라이트 테마용 굵기 조정) */
const Icons = {
  Reply: () => (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
    </svg>
  ),
  Edit: () => (
    <svg
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  ThumbsUp: ({ filled }) => (
    <svg
      width="15"
      height="15"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  ),
  ThumbsDown: ({ filled }) => (
    <svg
      width="15"
      height="15"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </svg>
  ),
  Flag: () => (
    <svg
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
};

const formatRelativeTime = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);
  if (diffInSeconds < 60) return "방금 전";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  return past.toLocaleDateString();
};

export default function CommentSection({ articleId }) {
  const supabase = createBrowserSupabaseClient();
  const [comments, setComments] = useState([]);
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  const buildCommentTree = useCallback((flatComments, currentUser) => {
    const map = {};
    const roots = [];

    flatComments.forEach((c) => {
      map[c.id] = {
        ...c,
        children: [],
        likes: c.comment_votes?.filter((v) => v.vote_type === 1).length || 0,
        dislikes:
          c.comment_votes?.filter((v) => v.vote_type === -1).length || 0,
        myVote: currentUser
          ? c.comment_votes?.find((v) => v.user_id === currentUser.id)
              ?.vote_type || 0
          : 0,
      };
    });

    flatComments.forEach((c) => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  }, []);

  const fetchComments = useCallback(
    async (currentUser) => {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `*, profiles ( display_name, avatar_url ), comment_votes ( user_id, vote_type )`,
        )
        .eq("article_id", articleId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setComments(buildCommentTree(data, currentUser));
      }
      setLoading(false);
    },
    [articleId, buildCommentTree, supabase],
  );

  useEffect(() => {
    if (!authLoading) fetchComments(user);
  }, [articleId, authLoading, user, fetchComments]);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    const { error } = await supabase
      .from("comments")
      .insert({ article_id: articleId, user_id: user.id, content: newComment });
    if (!error) {
      setNewComment("");
      fetchComments(user);
    }
  };

  const totalCount = comments.reduce((acc, c) => {
    const countSub = (item) =>
      1 +
      (item.children?.reduce((subAcc, sub) => subAcc + countSub(sub), 0) || 0);
    return acc + countSub(c);
  }, 0);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-400 animate-pulse">
        댓글을 불러오는 중...
      </div>
    );

  return (
    <div className="w-full bg-white mt-12 border-t-2 border-gray-900 pb-20">
      <h3 className="text-[19px] font-black text-gray-900 mb-8 mt-8 flex items-center gap-2">
        댓글 <span className="text-blue-600">{totalCount}</span>
      </h3>

      {user ? (
        <form
          onSubmit={handleCreateComment}
          className="mb-10 bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="비방이나 욕설은 삼가주세요. 여러분의 소중한 의견을 남겨주세요."
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-[15px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none h-28"
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-sm"
            >
              의견 등록하기
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
          <p className="text-gray-500 text-sm">
            로그인 후 댓글 작성이 가능합니다.
          </p>
          <button className="mt-3 text-blue-600 font-bold text-sm hover:underline">
            로그인 하러가기
          </button>
        </div>
      )}

      <div className="space-y-2">
        {comments.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Icons.Reply />
            </div>
            <p className="text-gray-400 text-sm">첫 번째 의견을 남겨주세요.</p>
          </div>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            user={user}
            supabase={supabase}
            refresh={() => fetchComments(user)}
            articleId={articleId}
          />
        ))}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  user,
  supabase,
  refresh,
  articleId,
  isReply = false,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);

  const isMyComment = user && user.id === comment.user_id;

  const handleVote = async (type) => {
    if (!user) return alert("로그인이 필요합니다.");
    if (comment.myVote === type) {
      await supabase
        .from("comment_votes")
        .delete()
        .match({ comment_id: comment.id, user_id: user.id });
    } else {
      await supabase
        .from("comment_votes")
        .upsert(
          { comment_id: comment.id, user_id: user.id, vote_type: type },
          { onConflict: "comment_id, user_id" },
        );
    }
    refresh();
  };

  const handleDelete = async () => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", comment.id);
      if (!error) refresh();
    }
  };

  return (
    <div
      className={`py-6 ${isReply ? "pl-6 border-l-2 border-gray-100 ml-2" : "border-b border-gray-50"}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[14px] text-gray-900">
            {comment.profiles?.display_name || "익명"}
          </span>
          <span className="text-[12px] text-gray-400">
            {formatRelativeTime(comment.created_at)}
          </span>
          {comment.updated_at && (
            <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded italic">
              수정됨
            </span>
          )}
        </div>
        <button
          onClick={() => {
            /* handleReport */
          }}
          className="text-gray-300 hover:text-red-500 transition-colors p-1"
          title="신고"
        >
          <Icons.Flag />
        </button>
      </div>

      <div className="mb-4">
        {isEditing ? (
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <textarea
              className="w-full bg-white border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  await supabase
                    .from("comments")
                    .update({
                      content: editContent,
                      updated_at: new Date().toISOString(),
                    })
                    .eq("id", comment.id);
                  setIsEditing(false);
                  refresh();
                }}
                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold"
              >
                수정 완료
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        )}
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center bg-gray-50 rounded-full px-3 py-1 gap-3">
          <button
            onClick={() => handleVote(1)}
            className={`flex items-center gap-1.5 text-[12px] transition-colors ${comment.myVote === 1 ? "text-blue-600 font-bold" : "text-gray-500 hover:text-blue-600"}`}
          >
            <Icons.ThumbsUp filled={comment.myVote === 1} />{" "}
            <span>{comment.likes}</span>
          </button>
          <div className="w-[1px] h-3 bg-gray-200" />
          <button
            onClick={() => handleVote(-1)}
            className={`flex items-center gap-1.5 text-[12px] transition-colors ${comment.myVote === -1 ? "text-red-600 font-bold" : "text-gray-500 hover:text-red-600"}`}
          >
            <Icons.ThumbsDown filled={comment.myVote === -1} />{" "}
            <span>{comment.dislikes}</span>
          </button>
        </div>

        <button
          onClick={() => setIsReplying(!isReplying)}
          className="text-[12px] font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
        >
          <Icons.Reply /> 답글달기
        </button>

        {isMyComment && (
          <div className="ml-auto flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="text-[12px] text-gray-400 hover:text-blue-600 flex items-center gap-1"
            >
              <Icons.Edit /> 수정
            </button>
            <button
              onClick={handleDelete}
              className="text-[12px] text-gray-400 hover:text-red-600 flex items-center gap-1"
            >
              <Icons.Trash /> 삭제
            </button>
          </div>
        )}
      </div>

      {isReplying && (
        <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요..."
            className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none h-20 resize-none"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setIsReplying(false)}
              className="text-xs px-3 py-1.5 text-gray-500"
            >
              취소
            </button>
            <button
              onClick={async () => {
                if (!replyContent.trim()) return;
                await supabase
                  .from("comments")
                  .insert({
                    article_id: articleId,
                    user_id: user.id,
                    content: replyContent,
                    parent_id: comment.id,
                  });
                setIsReplying(false);
                setReplyContent("");
                refresh();
              }}
              className="px-4 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-lg"
            >
              답글 등록
            </button>
          </div>
        </div>
      )}

      {comment.children?.map((child) => (
        <CommentItem
          key={child.id}
          comment={child}
          user={user}
          supabase={supabase}
          refresh={refresh}
          articleId={articleId}
          isReply={true}
        />
      ))}
    </div>
  );
}
