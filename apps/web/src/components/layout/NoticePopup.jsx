'use client';

import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { apiRequest } from '../../lib/api/client.js';

const STORAGE_KEY = 'relief-nepal-notice-popup-seen';

export default function NoticePopup() {
  const [notice, setNotice] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    // Check if popup was already shown this session
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) {
      setLoading(false);
      return;
    }

    // Fetch the latest notice with an image
    fetchLatestNotice();
  }, []);

  const fetchLatestNotice = async () => {
    try {
      const data = await apiRequest('/notices');
      if (Array.isArray(data) && data.length > 0) {
        // Find the first notice with an image
        const noticeWithImage = data.find((n) => n.image_url);
        if (noticeWithImage) {
          setNotice(noticeWithImage);
          setIsOpen(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notice for popup:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
      // Trap focus within dialog
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus the close button when dialog opens
    const closeButton = dialogRef.current?.querySelector('button');
    closeButton?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (loading || !isOpen || !notice) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      onClick={handleOverlayClick}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-popup-title"
      >
        <button
          type="button"
          className="absolute top-3 right-3 z-10 rounded-full p-1 text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
          onClick={handleClose}
          aria-label="Close notice popup"
        >
          <X size={24} />
        </button>
        <div className="relative aspect-video">
          <img
            src={notice.image_url}
            alt={notice.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/90 to-transparent">
          <h2 id="notice-popup-title" className="text-lg font-bold text-white">
            {notice.title}
          </h2>
          {notice.body && (
            <p className="mt-2 text-sm text-white/80 line-clamp-3">{notice.body}</p>
          )}
          <a
            href={`/notice/${encodeURIComponent(notice.slug)}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200"
            onClick={handleClose}
          >
            Read full notice
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}