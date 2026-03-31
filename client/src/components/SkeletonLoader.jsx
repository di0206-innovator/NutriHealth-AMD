export default function SkeletonLoader({ type = 'result', count = 1 }) {
  if (type === 'result') {
    return (
      <div className="skeleton-result glass-panel" aria-hidden="true">
        <div className="skeleton-header">
          <div className="skeleton-line wide" />
          <div className="skeleton-line medium" />
        </div>
        <div className="skeleton-block" style={{ height: '140px', borderRadius: 'var(--radius-lg)' }} />
        <div className="skeleton-line full" />
        <div className="skeleton-line full" />
        <div className="skeleton-line medium" />
      </div>
    );
  }
  if (type === 'list') {
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-card glass-panel" aria-hidden="true">
        <div className="skeleton-line wide mb-sm" />
        <div className="skeleton-line medium" />
      </div>
    ));
  }
  if (type === 'app') {
    return (
      <div className="skeleton-app-launch">
         <div className="skeleton-logo shimmer" />
      </div>
    );
  }
  return <div className="skeleton-block full-height" aria-hidden="true" />;
}
