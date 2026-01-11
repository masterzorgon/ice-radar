'use client';

import { useState, useEffect, useCallback } from 'react';

const DONATION_POPUP_DISMISSED_KEY = 'ice-tracker-donation-popup-dismissed';
const DONATION_POPUP_SNOOZED_KEY = 'ice-tracker-donation-popup-snoozed';
const INITIAL_DELAY_MS = 90000; // 90 seconds
const SNOOZE_DELAY_MS = 20 * 60 * 1000; // 20 minutes

export function useDonationPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if permanently dismissed
    const permanentlyDismissed = localStorage.getItem(DONATION_POPUP_DISMISSED_KEY);
    if (permanentlyDismissed === 'true') return;

    // Check if snoozed and calculate remaining time
    const snoozedUntil = localStorage.getItem(DONATION_POPUP_SNOOZED_KEY);
    let delay = INITIAL_DELAY_MS;

    if (snoozedUntil) {
      const snoozedUntilTime = parseInt(snoozedUntil, 10);
      const now = Date.now();

      if (now < snoozedUntilTime) {
        // Still in snooze period, wait until snooze expires
        delay = snoozedUntilTime - now;
      } else {
        // Snooze expired, clear it and show after initial delay
        localStorage.removeItem(DONATION_POPUP_SNOOZED_KEY);
      }
    }

    // Start the timer
    const timerId = setTimeout(() => {
      setIsPopupOpen(true);
    }, delay);

    return () => clearTimeout(timerId);
  }, []);

  const dismissForSession = useCallback(() => {
    setIsPopupOpen(false);
    // Store the time when the popup should reappear (20 minutes from now)
    const snoozedUntil = Date.now() + SNOOZE_DELAY_MS;
    localStorage.setItem(DONATION_POPUP_SNOOZED_KEY, snoozedUntil.toString());
  }, []);

  const dismissPermanently = useCallback(() => {
    setIsPopupOpen(false);
    localStorage.setItem(DONATION_POPUP_DISMISSED_KEY, 'true');
    localStorage.removeItem(DONATION_POPUP_SNOOZED_KEY);
  }, []);

  return {
    isPopupOpen,
    dismissForSession,
    dismissPermanently,
  };
}
