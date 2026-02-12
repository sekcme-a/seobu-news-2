import Image from "next/image";
import Link from "next/link";

export default function ArticleSmallThumbnail({ article }) {
  const isSpecialColumn =
    article.title?.includes("덕암") && article.title?.includes("칼럼");

  return (
    <li className="group py-4 border-b border-gray-50 last:border-0">
      <Link
        href={`/article/${article.id}`}
        aria-label="기사로 이동"
        className="block"
      >
        <article className="flex items-start justify-between gap-x-4">
          {/* 텍스트 영역 */}
          <div className="flex-1 min-w-0">
            <h5 className="text-[15px] font-semibold text-gray-700 group-hover:text-black line-clamp-2 leading-snug transition-colors">
              {article.title}
            </h5>
          </div>

          {/* 작은 썸네일 */}
          <div className="relative w-16 h-16 md:w-20 md:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
            <Image
              src={
                article.thumbnail_image
                  ? article.thumbnail_image
                  : isSpecialColumn
                    ? "/images/kyunsik.png"
                    : (article.images_bodo?.[0] ?? "/images/og_logo.png")
              }
              alt={article.title}
              fill
              className={`transition-transform duration-500 group-hover:scale-105 ${
                isSpecialColumn ? "object-contain" : "object-cover"
              }`}
            />
          </div>
        </article>
      </Link>
    </li>
  );
}
