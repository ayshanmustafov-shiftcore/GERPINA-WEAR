'use client';

import ShopExperience from '@/components/ShopExperience';

export default function CategoryPage({ category }) {
  return <ShopExperience fixedAudience={category} />;
}
