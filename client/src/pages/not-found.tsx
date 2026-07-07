import "./portfolio.css";

export default function NotFound() {
  return (
    <div className="portfolio-skin not-found">
      <div className="not-found-inner">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-text">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <a href="/" className="not-found-link">← Back home</a>
      </div>
    </div>
  );
}
