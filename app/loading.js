// Route-transition loader: shown by Next.js while a page's data streams in.
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5" aria-busy="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" style={{ width: 120, animation: 'ttLogoFloat 1.8s ease-in-out infinite' }} />
      <div className="w-28 h-[3px] rounded-full overflow-hidden bg-gray-100">
        <div className="h-full rounded-full" style={{ width: '40%', background: 'linear-gradient(90deg,#5bc1d5,#1f77a3)', animation: 'ttBar 1.1s ease-in-out infinite' }} />
      </div>
    </div>
  );
}
