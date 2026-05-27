import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-44 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* Metric cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 gap-0">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Appointments + Chart skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Appointments list skeleton */}
        <div className="lg:col-span-8">
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-52" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-28 rounded-lg" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="py-4 flex justify-between items-center border-b border-border last:border-0"
                >
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3.5 w-64" />
                    <Skeleton className="h-3.5 w-48" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-xl" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Movement chart skeleton */}
        <div className="lg:col-span-4">
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
