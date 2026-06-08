'use client';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [tooltip, setTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {tooltip && (
        <div className="bg-white shadow-lg rounded-xl px-4 py-2 text-sm text-gray-700 max-w-[200px] text-right relative">
          <button
            onClick={() => setTooltip(false)}
            className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-0.5"
          >
            <X size={12} />
          </button>
          Chat with us on WhatsApp!
        </div>
      )}
      <a
        href="https://wa.me/916396464369?text=Hi! I'm interested in your travel packages."
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setTooltip(false)}
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-xl hover:bg-green-500 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <MessageCircle size={28} className="text-white relative z-10" />
      </a>
    </div>
  );
}
