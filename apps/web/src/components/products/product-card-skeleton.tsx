import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <Card className="bg-white border-0 shadow-md overflow-hidden">
      <div className="aspect-square">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
