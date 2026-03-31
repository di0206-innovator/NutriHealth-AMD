export default function ErrorState({ error, onRetry }) {
  return (
    <div className="error-state glass-panel fade-in" role="alert" aria-live="assertive">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <div className="error-content">
        <p className="error-message">{error?.message || 'Something went wrong'}</p>
        <p className="error-suggestion">{error?.suggestion || 'Please try again safely.'}</p>
      </div>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry} aria-label="Try again">
          Try again
        </button>
      )}
    </div>
  );
}
