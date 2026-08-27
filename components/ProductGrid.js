import ProductCard from '@/components/ProductCard';
import { isProductAvailable } from '@/data/products';

export default function ProductGrid({ products }) {
  const visibleProducts = products.filter(isProductAvailable);
  return <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
