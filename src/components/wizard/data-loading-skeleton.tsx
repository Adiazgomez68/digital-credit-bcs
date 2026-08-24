import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DataLoadingSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3.5">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>

        <Skeleton className="h-11 w-full" />

        <div className="grid grid-cols-2 gap-3.5">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>

        <Skeleton className="h-11 w-full" />
      </CardContent>
    </Card>
  );
}
