export default function LegalPage({ eyebrow, title, intro, children, updated = '18.08.2026' }) {
  return (
    <main className="legal-page page-width">
      <header className="legal-hero">
        {eyebrow && <span>{eyebrow}</span>}
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
        <small>Последна актуализация / Last updated: {updated}</small>
      </header>
      <article className="legal-content">{children}</article>
    </main>
  );
}
