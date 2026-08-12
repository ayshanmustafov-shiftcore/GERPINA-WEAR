import { Suspense } from 'react';
import ShopExperience from '@/components/ShopExperience';
export default function ShopPage() { return <Suspense fallback={<div className="page-loading">Loading…</div>}><ShopExperience /></Suspense>; }
