'use client';

import { useEffect } from 'react';

/**
 * JSON-LD Structured Data Component
 * Injects structured data into the document head
 * Renders null to avoid hydration mismatches
 */
export default function JsonLd({ data, key }) {
  useEffect(() => {
    if (!data) return;

    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(data);
    script.setAttribute('data-jsonld-key', key || '');

    document.head.appendChild(script);

    return () => {
      if (script.parentNode === document.head) {
        document.head.removeChild(script);
      }
    };
  }, [data, key]);

  // Render nothing to avoid hydration mismatch
  // The script is injected into <head> via useEffect
  return null;
}