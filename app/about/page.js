import Image from 'next/image';
import Link from 'next/link';

export const metadata = { title: 'About Us — Travel Teasing' };

const stats = [{ value: '500+', label: 'Happy Travelers' }, { value: '50+', label: 'Destinations' }, { value: '4.9★', label: 'Average Rating' }, { value: '3+', label: 'Years of Experience' }];
const values = [
  { icon: '🤝', title: 'Trust & Transparency', desc: 'No hidden charges, no false promises. We tell you exactly what you get.' },
  { icon: '🌍', title: 'Responsible Travel', desc: 'We work with local vendors and promote sustainable travel practices.' },
  { icon: '❤️', title: 'Traveler First', desc: 'Every decision we make starts with "what\'s best for the traveler?"' },
  { icon: '🏆', title: 'Quality Experiences', desc: 'We visit every destination we sell. We know what works and what doesn\'t.' },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-72 flex items-center">
        <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" alt="About Travel Teasing" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 container-max">
          <h1 className="text-3xl md:text-5xl font-bold text-white">About Travel Teasing</h1>
          <p className="text-white/80 mt-3 max-w-xl">We started as travelers. We became your travel partners.</p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">
            <em className="italic font-normal">Our</em> Story
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Travel Teasing was born from a simple frustration: planning a trip in India was needlessly complicated, expensive, and stressful. Hidden costs, unreliable operators, and zero personalization had become the norm.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            We decided to fix that. Starting with group trips to Kasol and Spiti Valley for friend groups in Delhi, we built a reputation one trip at a time — for honest pricing, safe travel, and genuinely memorable experiences.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Today, Travel Teasing serves travelers across India — from first-time backpackers to families on annual vacations to corporate teams looking for the perfect offsite. But our promise has never changed: every trip should start with a smile.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-[#5bc1d5] mb-1">{s.value}</p>
                <p className="text-white/60 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-[#1a1a2e] mb-10 text-center">
            <em className="italic font-normal">What We</em> Believe In
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {values.map(v => (
              <div key={v.title} className="card p-6 flex items-start gap-4">
                <div className="text-3xl">{v.icon}</div>
                <div>
                  <h3 className="font-bold text-[#1a1a2e] mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white text-center">
        <div className="container-max max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Ready to Travel With Us?</h2>
          <p className="text-gray-500 mb-8">Browse our packages or reach out — we'd love to plan your next adventure.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="btn-primary">Explore Packages</Link>
            <Link href="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
