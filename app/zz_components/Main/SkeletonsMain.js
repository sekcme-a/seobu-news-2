import Skeleton from "@/components/Skeleton";

export default async function SkeletonsMain({ variant }) {
  if (variant === "Headline")
    return (
      <div className="space-y-4">
        <Skeleton
          variant="square"
          className="w-full h-[300px] md:h-[450px] rounded-2xl bg-gray-100"
        />
        <Skeleton className="w-3/4 h-8 bg-gray-100" />
        <Skeleton className="w-full h-4 bg-gray-100" />
      </div>
    );
  else if (variant === "MainNews")
    return (
      <div className="space-y-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-full bg-gray-100" />
              <Skeleton className="h-5 w-2/3 bg-gray-100" />
            </div>
            <Skeleton className="w-20 h-20 rounded-lg bg-gray-100" />
          </div>
        ))}
      </div>
    );
  else if (variant === "RecentArticles")
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md bg-gray-50" />
        ))}
      </div>
    );
  return null;
}
