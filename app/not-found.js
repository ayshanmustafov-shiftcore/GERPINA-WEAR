import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found shell">
      <span>404</span>
      <h1>Page not found</h1>
      <Link href="/" className="button button-dark">GERPINA Wear</Link>
    </main>
  );
}
