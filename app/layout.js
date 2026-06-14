import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';

export const metadata = {
  title: { default: "Travel Teasing — India's Trusted Travel Partner", template: '%s | Travel Teasing' },
  description: 'Explore curated group trips, family packages, weekend escapes, and adventure treks across India. 500+ happy travelers. 50+ destinations. 4.9★ rated.',
  keywords: 'travel india, group trips, himachal pradesh, ladakh, weekend escapes, family packages, adventure treks',
  openGraph: {
    title: "Travel Teasing — India's Trusted Travel Partner",
    description: 'Curated group trips, family packages, and adventure treks across India.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
