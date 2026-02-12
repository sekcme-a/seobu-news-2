import Skeleton from "@/components/Skeleton";

export default async function SkeletonsBodyOne({ variant }) {
  const baseClass = "bg-gray-100 rounded-md";

  if (variant === "BodyFullArticle")
    return (
      <div className="space-y-4">
        <Skeleton
          variant="square"
          className="w-full h-64 rounded-2xl bg-gray-100"
        />
        <Skeleton className={`w-full h-7 ${baseClass}`} />
        <Skeleton className={`w-[70%] h-7 ${baseClass}`} />
        <Skeleton className={`w-full h-4 mt-4 ${baseClass}`} />
        <Skeleton className={`w-[90%] h-4 ${baseClass}`} />
      </div>
    );

  if (variant === "BodyArticles")
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className={`w-full h-5 ${baseClass}`} />
              <Skeleton className={`w-2/3 h-5 ${baseClass}`} />
              <Skeleton className={`w-full h-3 mt-2 ${baseClass}`} />
            </div>
            <Skeleton className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0" />
          </div>
        ))}
      </div>
    );

  if (variant === "Opinions")
    return (
      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <Skeleton className="h-6 w-24 mb-6 bg-gray-200" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-5 w-full bg-gray-200" />
          ))}
        </div>
      </div>
    );
}
