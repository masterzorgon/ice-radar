'use client';

import { useState, useMemo } from 'react';
import { ReportType, Report } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReportFormData) => void;
  reports: Report[];
  onVerifyExisting: (reportId: string) => void;
}

export interface ReportFormData {
  type: ReportType;
  city: string;
  state: string;
  address: string;
  description: string;
  coordinates?: [number, number];
}

const REPORT_TYPES: ReportType[] = [
  'RAID',
  'CHECKPOINT',
  'PATROL',
  'DETENTION',
  'SURVEILLANCE',
];

const US_STATES: { code: string; name: string }[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

// Capitalize city name properly (e.g., "los angeles" -> "Los Angeles", "new york" -> "New York")
const capitalizeCity = (city: string): string => {
  return city
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Calculate distance between two coordinates in miles
const getDistanceMiles = (
  coords1: [number, number],
  coords2: [number, number]
): number => {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const VERIFIED_REPORTS_KEY = 'ice-tracker-verified-reports';

export default function ReportModal({ isOpen, onClose, onSubmit, reports, onVerifyExisting }: ReportModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ReportFormData>({
    type: 'RAID',
    city: '',
    state: '',
    address: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [verifiedInModal, setVerifiedInModal] = useState<Set<string>>(new Set());

  // Find nearby recent incidents when user has coordinates
  const nearbyIncidents = useMemo(() => {
    if (!formData.coordinates) return [];

    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // Check localStorage for already verified reports
    const verified = localStorage.getItem(VERIFIED_REPORTS_KEY);
    const verifiedIds: string[] = verified ? JSON.parse(verified) : [];

    return reports
      .filter((report) => {
        // Only show active or unverified reports from the last 2 hours
        if (report.status === 'RESOLVED') return false;
        if (new Date(report.timestamp) < twoHoursAgo) return false;

        // Calculate distance
        const distance = getDistanceMiles(
          formData.coordinates!,
          report.location.coordinates
        );

        // Within 5 miles
        return distance <= 5;
      })
      .map((report) => ({
        ...report,
        distance: getDistanceMiles(formData.coordinates!, report.location.coordinates),
        alreadyVerified: verifiedIds.includes(report.id) || verifiedInModal.has(report.id),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5); // Show max 5 nearby incidents
  }, [formData.coordinates, reports, verifiedInModal]);

  if (!isOpen) return null;

  const handleVerifyInModal = (reportId: string) => {
    // Save to localStorage
    const verified = localStorage.getItem(VERIFIED_REPORTS_KEY);
    const verifiedIds: string[] = verified ? JSON.parse(verified) : [];
    if (!verifiedIds.includes(reportId)) {
      verifiedIds.push(reportId);
      localStorage.setItem(VERIFIED_REPORTS_KEY, JSON.stringify(verifiedIds));
    }

    // Update local state
    setVerifiedInModal((prev) => new Set([...prev, reportId]));

    // Call parent handler
    onVerifyExisting(reportId);
  };

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError(t.reportModal.locationErrors.notSupported);
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use reverse geocoding to get city/state from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'ICE-Tracker-App',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const address = data.address || {};

            // Extract city (could be city, town, village, etc.)
            const city = address.city || address.town || address.village || address.municipality || address.county || '';

            // Extract state abbreviation
            const stateCode = address['ISO3166-2-lvl4']?.split('-')[1] || '';

            // Extract street address
            const streetAddress = [address.house_number, address.road].filter(Boolean).join(' ');

            setFormData((prev) => ({
              ...prev,
              city: city,
              state: US_STATES.some(s => s.code === stateCode) ? stateCode : prev.state,
              address: streetAddress || `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              coordinates: [longitude, latitude],
            }));
          } else {
            // If reverse geocoding fails, just set coordinates
            setFormData((prev) => ({
              ...prev,
              address: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              coordinates: [longitude, latitude],
            }));
          }
        } catch {
          // If API fails, just set coordinates
          setFormData((prev) => ({
            ...prev,
            address: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            coordinates: [longitude, latitude],
          }));
        }

        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(t.reportModal.locationErrors.denied);
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(t.reportModal.locationErrors.unavailable);
            break;
          case error.TIMEOUT:
            setLocationError(t.reportModal.locationErrors.timeout);
            break;
          default:
            setLocationError(t.reportModal.locationErrors.default);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSubmit({
      ...formData,
      city: capitalizeCity(formData.city),
    });
    setIsSubmitting(false);
    setFormData({
      type: 'RAID',
      city: '',
      state: '',
      address: '',
      description: '',
    });
    setLocationError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-black/95 border border-accent-dim/50 w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-accent-dim/30 bg-black/50">
          <div className="flex items-center gap-2">
            <span className="text-danger text-lg">▲</span>
            <span className="text-accent text-xs">{t.reportModal.title}</span>
            <span className="text-accent-dim text-xs">{t.reportModal.subtitle}</span>
          </div>
          <button
            onClick={onClose}
            className="text-foreground/50 hover:text-foreground text-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Report Type */}
          <div>
            <label className="block text-xs text-accent-dim mb-2">
              {t.reportModal.incidentType}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {REPORT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`
                    px-2 py-2 text-xs transition-colors border
                    ${formData.type === type
                      ? 'bg-accent/20 text-accent border-accent/50'
                      : 'bg-black/50 text-foreground/50 border-accent-dim/30 hover:border-accent-dim/50'
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Use My Location Button */}
          <div>
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="w-full px-4 py-2 bg-accent/10 border border-accent/30 text-accent text-xs hover:bg-accent/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLocating ? (
                <>
                  <span className="animate-pulse">◎</span>
                  <span>{t.reportModal.detectingLocation}</span>
                </>
              ) : (
                <>
                  <span>◎</span>
                  <span>{t.reportModal.useLocation}</span>
                </>
              )}
            </button>
            {locationError && (
              <div className="mt-2 text-xs text-danger">{locationError}</div>
            )}
            {formData.coordinates && (
              <div className="mt-2 text-xs text-accent-dim">
                {t.reportModal.locationDetected} {formData.coordinates[1].toFixed(4)}, {formData.coordinates[0].toFixed(4)}
              </div>
            )}
          </div>

          {/* Nearby Incidents */}
          {nearbyIncidents.length > 0 && (
            <div className="bg-warning/10 border border-warning/30 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-warning">⚠</span>
                <span className="text-warning text-xs font-bold">{t.reportModal.nearbyIncidents}</span>
              </div>
              <p className="text-xs text-foreground/60 mb-3">
                {t.reportModal.nearbyDescription
                  .replace('{count}', String(nearbyIncidents.length))
                  .replace('{plural}', nearbyIncidents.length > 1 ? 's' : '')}
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {nearbyIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="bg-black/30 border border-accent-dim/20 p-2 flex items-start justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-1.5 py-0.5 border ${
                          incident.status === 'ACTIVE'
                            ? 'bg-danger/20 border-danger/50 text-danger'
                            : 'bg-warning/20 border-warning/50 text-warning'
                        }`}>
                          {incident.type}
                        </span>
                        <span className="text-xs text-foreground/40">
                          {incident.distance.toFixed(1)} {t.reportModal.milesAway}
                        </span>
                      </div>
                      <div className="text-xs text-foreground/70 truncate">
                        {incident.location.city}, {incident.location.state}
                        {incident.location.address && ` - ${incident.location.address}`}
                      </div>
                      <div className="text-xs text-foreground/50 truncate mt-0.5">
                        {incident.description}
                      </div>
                      <div className="text-xs text-foreground/30 mt-1">
                        {formatDistanceToNow(incident.timestamp, { addSuffix: true })} · {incident.verifiedCount} {t.feed.verified}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVerifyInModal(incident.id)}
                      disabled={incident.alreadyVerified}
                      className={`shrink-0 px-2 py-1 text-xs transition-colors cursor-pointer ${
                        incident.alreadyVerified
                          ? 'bg-accent/10 border border-accent/30 text-accent/70 cursor-not-allowed'
                          : 'bg-accent/20 border border-accent/50 text-accent hover:bg-accent/30'
                      }`}
                    >
                      {incident.alreadyVerified ? `${t.reportModal.verifiedButton} ✓` : t.reportModal.verifyButton}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-warning/20 text-xs text-foreground/40 text-center">
                {t.reportModal.continueNew}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-accent-dim mb-2">
                {t.reportModal.city}
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-black/50 border border-accent-dim/30 px-3 py-2 text-xs text-foreground placeholder:text-foreground/30 focus:border-accent/50 focus:outline-none"
                placeholder={t.reportModal.cityPlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs text-accent-dim mb-2">
                {t.reportModal.state}
              </label>
              <select
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-black/50 border border-accent-dim/30 px-3 py-2 text-xs text-foreground focus:border-accent/50 focus:outline-none"
              >
                <option value="">{t.reportModal.statePlaceholder}</option>
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs text-accent-dim mb-2">
              {t.reportModal.address}
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-black/50 border border-accent-dim/30 px-3 py-2 text-xs text-foreground placeholder:text-foreground/30 focus:border-accent/50 focus:outline-none"
              placeholder={t.reportModal.addressPlaceholder}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-accent-dim mb-2">
              {t.reportModal.description}
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/50 border border-accent-dim/30 px-3 py-2 text-xs text-foreground placeholder:text-foreground/30 focus:border-accent/50 focus:outline-none resize-none"
              placeholder={t.reportModal.descriptionPlaceholder}
            />
          </div>

          {/* Warning */}
          <div className="text-xs text-warning bg-warning/10 border border-warning/30 p-3">
            ⚠ {t.reportModal.safetyWarning}
          </div>

          {/* Anonymous Notice */}
          <div className="text-xs text-accent bg-accent/10 border border-accent/30 p-3 flex items-center gap-2">
            <span>🔒</span>
            <span>{t.reportModal.anonymousNotice}</span>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-accent-dim/30 text-foreground/50 text-xs hover:bg-accent/10 hover:text-foreground transition-colors"
            >
              {t.reportModal.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-danger/20 border border-danger/50 text-danger text-xs hover:bg-danger/30 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? t.reportModal.submitting : t.reportModal.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
