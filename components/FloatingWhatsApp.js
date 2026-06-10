'use client';

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="https://wa.me/916396464369?text=Hi! I'm interested in your travel packages."
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-xl hover:bg-[#1ebe5d] transition-colors"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        {/* Official WhatsApp SVG logo */}
        <svg viewBox="0 0 32 32" className="w-8 h-8 relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.51L4 29l7.695-1.805A11.94 11.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="white"/>
          <path d="M16 5.5C10.753 5.5 6.5 9.753 6.5 15c0 2.05.617 3.96 1.678 5.547l.292.45-.988 3.624 3.72-.974.435.258A9.47 9.47 0 0016 24.5c5.247 0 9.5-4.253 9.5-9.5S21.247 5.5 16 5.5z" fill="#25D366"/>
          <path d="M12.1 10.5c-.3-.7-.6-.7-.9-.71h-.77c-.27 0-.7.1-1.06.5-.37.4-1.4 1.37-1.4 3.33 0 1.97 1.43 3.87 1.63 4.14.2.26 2.77 4.4 6.83 5.98 3.38 1.33 4.07 1.07 4.8 1 .74-.07 2.37-.97 2.7-1.9.34-.94.34-1.74.24-1.9-.1-.17-.37-.27-.77-.47-.4-.2-2.37-1.17-2.74-1.3-.37-.13-.63-.2-.9.2-.27.4-1.03 1.3-1.27 1.57-.23.27-.47.3-.87.1-.4-.2-1.68-.62-3.2-1.97-1.18-1.05-1.98-2.35-2.21-2.75-.23-.4-.02-.62.17-.82.18-.18.4-.47.6-.7.2-.24.27-.4.4-.67.13-.27.07-.5-.03-.7-.1-.2-.87-2.17-1.22-2.97z" fill="white"/>
        </svg>
      </a>
    </div>
  );
}
