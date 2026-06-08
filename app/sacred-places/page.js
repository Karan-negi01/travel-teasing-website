import Image from 'next/image';
import Link from 'next/link';
import PackagesGrid from '@/components/PackagesGrid';

export const metadata = { title: 'Sacred Places — Spiritual Journeys Across India' };

const places = [
  { name: 'Varanasi', state: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1561361058-c24e022cefa6?w=600', desc: 'The eternal city on the Ganges' },
  { name: 'Kedarnath', state: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600', desc: 'Shiva\'s seat in the Himalayas' },
  { name: 'Char Dham', state: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=600', desc: 'The four divine abodes' },
  { name: 'Golden Temple', state: 'Punjab', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', desc: 'The spiritual crown of Sikhism' },
  { name: 'Tirupati', state: 'Andhra Pradesh', image: 'https://images.unsplash.com/photo-1477587458883-47145ed68a2c?w=600', desc: 'The abode of Lord Venkateswara' },
  { name: 'Shirdi', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=600', desc: 'Home of Sai Baba' },
];

export default function SacredPlacesPage() {
  return (
    <div>
      <section className="relative h-72 md:h-96 flex items-center">
        <Image src="https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=1200" alt="Sacred Journeys" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 container-max text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Sacred Journeys</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">Embark on a journey of faith, peace and self-discovery across India's holiest destinations</p>
        </div>
      </section>

      <section className="section-padding bg-[#fdf8f0]">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {places.map(place => (
              <Link key={place.name} href={`/packages?search=${place.name}`} className="group relative rounded-2xl overflow-hidden aspect-[3/2] block">
                <Image src={place.image} alt={place.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="400px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="font-bold text-xl">{place.name}</h3>
                  <p className="text-sm text-white/70">{place.state}</p>
                  <p className="text-xs text-white/60 mt-1">{place.desc}</p>
                  <span className="text-[#E8651A] text-sm font-semibold mt-2 inline-block">View Packages →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8 text-center">
            <em className="italic font-normal">Our </em>Sacred Packages
          </h2>
          <PackagesGrid category="sacred" />
        </div>
      </section>

      <section className="py-12 bg-[#fdf8f0]">
        <div className="container-max max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="text-4xl mb-4">🛕</div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Planning a Large Yatra Group?</h3>
            <p className="text-gray-500 mb-5">Contact us for special group arrangements — dedicated transport, accommodation blocks, and special darshan facilitation for groups of 25+.</p>
            <a href="https://wa.me/916396464369?text=Hi! I'm planning a large yatra group and need special arrangements." target="_blank" rel="noopener noreferrer" className="btn-primary">WhatsApp for Group Yatra</a>
          </div>
        </div>
      </section>
    </div>
  );
}
