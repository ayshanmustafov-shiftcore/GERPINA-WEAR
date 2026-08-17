import { Suspense } from 'react';
import ShopExperience from '@/components/ShopExperience';
export default function KidsPage() { return <Suspense fallback={<div className="page-loading">Loading…</div>}><ShopExperience fixedAudience="kids" /></Suspense>; }
