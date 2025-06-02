export const EmptyBoxAnimation = () => {
  return (
    <div
      className="empty-box mx-auto mb-4 opacity-70"
      role="img"
      aria-label="Порожньо"
      style={{ width: 256, height: 256 }}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full animate-pulse"
        xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="16" width="48" height="32" rx="4" ry="4" />
        <line x1="8" y1="16" x2="32" y2="4" />
        <line x1="56" y1="16" x2="32" y2="4" />
        <line x1="32" y1="4" x2="32" y2="36" />
      </svg>
    </div>
  );
}
