'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { US_STATES } from '@/data/states';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleStateToggle = (stateCode: string) => {
    setSelectedStates((prev) =>
      prev.includes(stateCode)
        ? prev.filter((s) => s !== stateCode)
        : [...prev, stateCode]
    );
  };

  const handleSelectAll = () => {
    if (selectedStates.length === US_STATES.length) {
      setSelectedStates([]);
    } else {
      setSelectedStates(US_STATES.map((s) => s.code));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, states: selectedStates }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setEmail('');
        setSelectedStates([]);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to subscribe');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-black/95 border border-accent-dim/50 w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-accent-dim/30 bg-black/50">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="text-accent text-xs">{t.subscribe?.title || '[ALERTS]'}</span>
            <span className="text-accent-dim text-xs">{t.subscribe?.subtitle || 'EMAIL NOTIFICATIONS'}</span>
          </div>
          <button
            onClick={handleClose}
            className="text-foreground/50 hover:text-foreground text-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="text-accent text-4xl mb-4">✓</div>
              <h3 className="text-accent text-sm font-bold mb-2">
                {t.subscribe?.successTitle || 'Check Your Email'}
              </h3>
              <p className="text-xs text-foreground/60">
                {t.subscribe?.successMessage || 'We sent you a verification link. Click it to activate your alerts.'}
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2 bg-accent/10 border border-accent/30 text-accent text-xs hover:bg-accent/20 transition-colors cursor-pointer"
              >
                {t.subscribe?.close || '[CLOSE]'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Description */}
              <p className="text-xs text-foreground/60 mb-4">
                {t.subscribe?.description || 'Get notified when new ICE sightings are reported in your selected states. Your email is only used for alerts.'}
              </p>

              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-xs text-accent-dim mb-2">
                  {t.subscribe?.emailLabel || 'EMAIL ADDRESS'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-accent-dim/30 px-3 py-2 text-xs text-foreground placeholder:text-foreground/30 focus:border-accent/50 focus:outline-none"
                  placeholder={t.subscribe?.emailPlaceholder || 'your@email.com'}
                />
              </div>

              {/* State Selection */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-accent-dim">
                    {t.subscribe?.statesLabel || 'SELECT STATES'}
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-accent hover:text-accent/80 transition-colors"
                  >
                    {selectedStates.length === US_STATES.length
                      ? (t.subscribe?.deselectAll || 'Deselect All')
                      : (t.subscribe?.selectAll || 'Select All')}
                  </button>
                </div>
                <div className="bg-black/50 border border-accent-dim/30 p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-1">
                    {US_STATES.map((state) => (
                      <label
                        key={state.code}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-accent/10 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStates.includes(state.code)}
                          onChange={() => handleStateToggle(state.code)}
                          className="w-3 h-3 accent-accent"
                        />
                        <span className="text-xs text-foreground/70">
                          {state.code} - {state.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                {selectedStates.length > 0 && (
                  <p className="text-xs text-accent mt-2">
                    {selectedStates.length} {selectedStates.length === 1 ? 'state' : 'states'} selected
                  </p>
                )}
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="text-xs text-danger bg-danger/10 border border-danger/30 p-3 mb-4">
                  {errorMessage}
                </div>
              )}

              {/* Privacy Notice */}
              <div className="text-xs text-accent bg-accent/10 border border-accent/30 p-3 mb-4 flex items-center gap-2">
                <span>🔒</span>
                <span>{t.subscribe?.privacyNotice || 'Your email is stored securely and only used for alerts. Unsubscribe anytime.'}</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || selectedStates.length === 0}
                className="w-full px-4 py-2 bg-accent/20 border border-accent/50 text-accent text-xs hover:bg-accent/30 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? (t.subscribe?.submitting || 'SUBSCRIBING...')
                  : (t.subscribe?.submit || '[SUBSCRIBE TO ALERTS]')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
