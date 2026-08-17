'use client';

import { useParams } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import { getProductBySlug } from '@/data/products';

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  if (!product) return <main className="simple-state"><h1>Product not found</h1></main>;
  return <ProductDetail product={product} />;
}
