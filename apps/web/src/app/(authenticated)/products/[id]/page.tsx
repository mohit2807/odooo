'use client'

import { ProductDetail } from '@/components/products/product-detail'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetail productId={params.id} />
}
