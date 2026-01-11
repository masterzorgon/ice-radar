'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { US_STATES } from '@/data/states';
import Button from '@/components/ui/Button';

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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStates = (states: string[]) => {
    return states.length > 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-background border-2 border-accent w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden flex flex-col crt-overlay">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-accent-dim bg-accent-dim">
          <div className="flex items-center gap-2">
            <span className="text-accent text-[10px]">[*]</span>
            <span className="text-accent text-[8px] tracking-wider glow-text">{t.subscribe?.title || '[ALERTS]'}</span>
            <span className="text-accent-muted text-[8px] tracking-wider">{t.subscribe?.subtitle || 'EMAIL NOTIFICATIONS'}</span>
          </div>
          <Button
            onClick={handleClose}
            variant="icon"
            size="sm"
            className="text-[10px]"
          >
            [X]
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="text-accent text-[24px] mb-4 glow-text">[OK]</div>
              <h3 className="text-accent text-[10px] tracking-wider mb-2 glow-text">
                {t.subscribe?.successTitle || 'Check Your Email'}
              </h3>
              <p className="text-[8px] text-accent-muted tracking-wider">
                {t.subscribe?.successMessage || 'We sent you a verification link. Click it to activate your alerts.'}
              </p>
              <Button
                onClick={handleClose}
                variant="primary"
                className="mt-6"
              >
                {t.subscribe?.close || 'CLOSE'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Description */}
              <p className="text-[8px] text-accent-muted tracking-wider mb-4">
                {t.subscribe?.description || 'Get notified when new ICE sightings are reported in your selected states. Your email is only used for alerts.'}
              </p>

              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-[8px] text-accent-muted mb-2 tracking-wider">
                  {t.subscribe?.emailLabel || 'EMAIL ADDRESS'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border-2 border-accent-dim px-3 py-2 text-[10px] text-accent placeholder:text-accent-muted/50 focus:border-accent focus:outline-none tracking-wider"
                  placeholder={t.subscribe?.emailPlaceholder || 'your@email.com'}
                />
              </div>

              {/* State Selection */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[8px] text-accent-muted tracking-wider flex items-center gap-2">
                    {t.subscribe?.statesLabel || 'SELECT STATES'}
                    {selectedStates.length > 0 && (
                      <>
                        <span>|</span>
                        <span className="text-accent">
                          {selectedStates.length} {selectedStates.length === 1 ? 'state' : 'states'} selected
                        </span>
                      </>
                    )}
                  </label>
                  <Button
                    type="button"
                    onClick={handleSelectAll}
                    variant="ghost"
                    size="sm"
                  >
                    [{selectedStates.length === US_STATES.length
                      ? (t.subscribe?.deselectAll || 'Deselect All')
                      : (t.subscribe?.selectAll || 'Select All')}]
                  </Button>
                </div>
                <div className="bg-background border-2 border-accent-dim p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-1">
                    {US_STATES.map((state) => (
                      <label
                        key={state.code}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-accent/10 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStates.includes(state.code)}
                          onChange={() => handleStateToggle(state.code)}
                          className="w-4 h-4"
                        />
                        <span className="text-[8px] text-accent tracking-wider">
                          {state.code} - {state.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="text-[8px] text-danger tracking-wider bg-background border-2 border-danger p-3 mb-4">
                  [ERROR] {errorMessage}
                </div>
              )}

              {/* Privacy Notice */}
              <div className="text-[8px] text-accent tracking-wider bg-background border-2 border-accent p-3 mb-4 flex items-center gap-2">
                <span>[#]</span>
                <span>{t.subscribe?.privacyNotice || 'Your email is stored securely and only used for alerts. Unsubscribe anytime.'}</span>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting || (!validateEmail(email) || !validateStates(selectedStates))}
                variant="primary"
                fullWidth
              >
                {isSubmitting
                  ? `[${t.subscribe?.submitting || 'SUBSCRIBING...'}]`
                  : `[${t.subscribe?.submit || 'SUBSCRIBE TO ALERTS'}]`}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
