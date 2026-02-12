import Skeleton from "@/components/Skeleton";

export default async function SkeletonCategory({ variant }) {
  const bg = "bg-gray-100 rounded-lg";

  if (variant === "Headline")
    return (
      <div className="grid md:grid-cols-5 gap-8 p-8 bg-gray-50 rounded-3xl border border-gray-100">
        <div className="md:col-span-3 space-y-4">
          <Skeleton className={`h-8 w-full ${bg}`} />
          <Skeleton className={`h-8 w-2/3 ${bg}`} />
          <div className="pt-4 space-y-2">
            <Skeleton className={`h-4 w-full ${bg}`} />
            <Skeleton className={`h-4 w-full ${bg}`} />
            <Skeleton className={`h-4 w-1/2 ${bg}`} />
          </div>
        </div>
        <Skeleton
          variant="square"
          className={`md:col-span-2 aspect-[4/3] ${bg}`}
        />
      </div>
    );

  if (variant === "ArticleList")
    return (
      <div className="mt-10 space-y-8">
        {[0, 1, 2, 3].map((i) => (
          <div className="flex gap-6 items-center" key={i}>
            <Skeleton variant="square" className={`w-32 h-24 ${bg}`} />
            <div className="flex-1 space-y-3">
              <Skeleton className={`h-5 w-full ${bg}`} />
              <Skeleton className={`h-4 w-2/3 ${bg}`} />
            </div>
          </div>
        ))}
      </div>
    );

  if (variant === "HeadlineList")
    return (
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
        <Skeleton className={`w-24 h-6 ${bg}`} />
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="flex gap-4" key={i}>
            <div className="flex-1 space-y-2">
              <Skeleton className={`h-4 w-full ${bg}`} />
              <Skeleton className={`h-4 w-3/4 ${bg}`} />
            </div>
            <Skeleton className={`w-14 h-14 ${bg}`} />
          </div>
        ))}
      </div>
    );
}
