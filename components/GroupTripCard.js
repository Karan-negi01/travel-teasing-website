import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users } from 'lucide-react';

const vibeBg = { Chill: 'bg-blue-100 text-blue-700', Adventure: 'bg-orange-100 text-orange-700', Cultural: 'bg-purple-100 text-purple-700', Spiritual: 'bg-yellow-100 text-yellow-700' };

export default function GroupTripCard({ trip }) {
  const filled = trip.filled_spots || 1;
  const total = trip.total_spots || 10;
  const pct = Math.round((filled / total) * 100);
  const creatorFirst = (trip.creator_name || '').split(' ')[0];

  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={trip.packages?.cover_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'}
          alt={trip.package_title || 'Group Trip'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-gray-400 text-xs flex items-center gap-1 mb-1">
          <MapPin size={12} />
          {trip.package_title}
        </p>
        <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
          <Calendar size={12} />
          {trip.trip_dates_from ? new Date(trip.trip_dates_from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'}
          {' — '}
          {trip.trip_dates_to ? new Date(trip.trip_dates_to).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
        </div>
        {trip.departure_city && (
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full mb-2 w-fit">
            From {trip.departure_city}
          </span>
        )}

        {/* Vibe tags */}
        {trip.vibe_tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {trip.vibe_tags.map((v) => (
              <span key={v} className={`text-xs px-2 py-0.5 rounded-full font-medium ${vibeBg[v] || 'bg-gray-100 text-gray-600'}`}>
                {v}
              </span>
            ))}
          </div>
        )}

        {/* Spots progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1"><Users size={12} /> {filled} / {total} spots filled</span>
            <span>{total - filled} left</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#E8651A] h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <p className="text-[#E8651A] font-bold text-lg mb-1">
          ₹{trip.price_per_person?.toLocaleString('en-IN')}/person
        </p>
        <p className="text-gray-400 text-xs mb-4">{creatorFirst} is organizing this trip</p>

        <Link
          href={`/group-trips/${trip.id}`}
          className="mt-auto btn-primary text-sm py-2 text-center justify-center"
        >
          View & Join
        </Link>
      </div>
    </div>
  );
}
