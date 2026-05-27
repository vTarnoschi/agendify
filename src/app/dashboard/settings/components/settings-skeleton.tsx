import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Title & Description Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-6 border-b border-border pb-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-40" />
      </div>

      {/* Content Form Skeleton */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-col gap-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Form items mockup */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl w-full" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border pt-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>

          {/* Action button skeleton */}
          <div className="flex items-center justify-between border-t border-border pt-6">
            <div />
            <Skeleton className="h-12 w-48 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
