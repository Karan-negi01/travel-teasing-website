import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4 pt-20">
      <div>
        <div className="text-6xl mb-6">🏔️</div>
        <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-primary">Go Back Home</Link>
      </div>
    </div>
  );
}
