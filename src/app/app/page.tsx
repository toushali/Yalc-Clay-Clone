/**
 * Placeholder workspace canvas.
 * The real app shell (sidebar + top bar + grid) is built in session S4.
 * This exists now only so S0's `/app` boot target resolves cleanly.
 */
export default function AppPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-bg">
      <div className="text-center">
        <p className="text-sm font-medium text-text">Yalc</p>
        <p className="mt-1 text-sm text-text-muted">
          Workspace shell arrives in S4.
        </p>
      </div>
    </main>
  );
}
