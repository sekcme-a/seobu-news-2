import Skeleton from "@/components/Skeleton";

export default async function SkeletonsBodyTwo({ variant }) {
  const bg = "bg-gray-100 rounded-xl";

  if (variant === "LeftBodyTwo")
    return (
      <div className="space-y-6">
        <Skeleton className={`h-8 w-3/4 ${bg}`} />
        <div className="flex gap-4">
          <Skeleton className={`h-32 w-48 ${bg}`} />
          <div className="flex-1 space-y-3">
            <Skeleton className={`h-4 w-full ${bg}`} />
            <Skeleton className={`h-4 w-full ${bg}`} />
            <Skeleton className={`h-4 w-2/3 ${bg}`} />
          </div>
        </div>
        <div className="space-y-4 mt-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className={`h-6 w-full ${bg}`} />
          ))}
        </div>
      </div>
    );

  if (variant === "RightBodyTwo")
    return (
      <div className="grid grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className={`h-32 w-full ${bg}`} />
            <Skeleton className={`h-5 w-full ${bg}`} />
            <Skeleton className={`h-5 w-2/3 ${bg}`} />
            <hr className="border-gray-50" />
            <Skeleton className={`h-4 w-full ${bg}`} />
            <Skeleton className={`h-4 w-full ${bg}`} />
          </div>
        ))}
      </div>
    );
}
