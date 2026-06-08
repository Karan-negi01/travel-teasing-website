export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center mb-7">
      <div className="flex items-center gap-3 justify-center mb-2">
        <span className="h-[3px] w-7 rounded-full bg-[#5bc1d5]" />
        <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#5bc1d5]">Travel Teasing</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm mt-1.5 max-w-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}
