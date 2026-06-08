'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar({ onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcement_dismissed');
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    sessionStorage.setItem('announcement_dismissed', 'true');
    setVisible(false);
    onDismiss?.();
  }

  if (!visible) return null;

  return (
    <div className="bg-[#1a1a1a] text-[#f2f2f2] text-xs py-2 px-4 text-center relative">
      <span>
        🏔️ New Batch: Spiti Valley July 2025 — Limited Seats |{' '}
        <a
          href="https://wa.me/916396464369?text=Hi, I'm interested in the Spiti Valley July batch"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-[#5bc1d5] hover:text-[#5bc1d5]/80"
        >
          WhatsApp Us Now
        </a>
      </span>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f2f2f2]/60 hover:text-[#f2f2f2] p-1"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
