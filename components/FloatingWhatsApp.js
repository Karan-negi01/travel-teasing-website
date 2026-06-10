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
        <svg viewBox="0 0 48 48" className="w-8 h-8 relative z-10" xmlns="http://www.w3.org/2000/svg">
          <path fill="white" d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17.2 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4z"/>
          <path fill="#25D366" d="M24 7.5c-9.1 0-16.5 7.4-16.5 16.5 0 3.1.9 6.1 2.5 8.6l.4.6-1.6 5.8 6-1.6.6.4c2.4 1.4 5.1 2.2 8 2.2 9.1 0 16.5-7.4 16.5-16.5S33.1 7.5 24 7.5z"/>
          <path fill="white" d="M18.3 15.3c-.4-.9-.8-.9-1.1-.9h-.9c-.3 0-.9.1-1.3.6-.5.5-1.8 1.8-1.8 4.3s1.8 5 2.1 5.3c.3.4 3.5 5.6 8.6 7.6 4.3 1.7 5.1 1.3 6 1.3s2.9-1.2 3.3-2.3c.4-1.2.4-2.2.3-2.4-.1-.2-.5-.4-1-.6-.5-.3-3-1.5-3.4-1.6-.5-.2-.8-.3-1.1.3-.4.5-1.3 1.6-1.6 2-.3.3-.6.4-1.1.1-.5-.3-2.2-.8-4.1-2.6-1.5-1.4-2.5-3-2.8-3.5-.3-.5 0-.8.2-1 .2-.2.5-.6.8-.9.3-.3.4-.5.5-.9.2-.3.1-.7-.1-.9-.1-.3-1.1-2.8-1.5-3.8z"/>
        </svg>
      </a>
    </div>
  );
}
