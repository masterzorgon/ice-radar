'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ReportType, Report } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddressSuggestion {
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    'ISO3166-2-lvl4'?: string;
  };
  lat: string;
  lon: string;
}

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

  // Address autocomplete state
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Search for address suggestions using Nominatim
  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&addressdetails=1&limit=5`,
        {
          headers: {
            'User-Agent': 'ICE-Tracker-App',
          },
        }
      );

      if (response.ok) {
        const data: AddressSuggestion[] = await response.json();
        setAddressSuggestions(data);
        setShowSuggestions(data.length > 0);
      }
    } catch {
      setAddressSuggestions([]);
    } finally {
      setIsSearchingAddress(false);
    }
  }, []);

  // Handle address input change with debouncing
  const handleAddressChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, address: value }));

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      searchAddress(value);
    }, 300);
  }, [searchAddress]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: AddressSuggestion) => {
    const addr = suggestion.address;

    // Extract city
    const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';

    // Extract state code from ISO3166-2-lvl4 (e.g., "US-CA" -> "CA")
    const stateCode = addr['ISO3166-2-lvl4']?.split('-')[1] || '';

    // Extract street address
    const streetAddress = [addr.house_number, addr.road].filter(Boolean).join(' ');

    setFormData(prev => ({
      ...prev,
      address: streetAddress || suggestion.display_name.split(',')[0],
      city: city,
      state: US_STATES.some(s => s.code === stateCode) ? stateCode : prev.state,
      coordinates: [parseFloat(suggestion.lon), parseFloat(suggestion.lat)],
    }));

    setShowSuggestions(false);
    setAddressSuggestions([]);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
        className="absolute inset-0 bg-black/95 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background border-2 border-accent w-full max-w-lg mx-4 crt-overlay">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-accent-dim bg-accent-dim">
          <div className="flex items-center gap-2">
            <span className="text-danger text-[10px] glow-danger">[!]</span>
            <span className="text-accent text-[8px] tracking-wider glow-text">{t.reportModal.title}</span>
            <span className="text-accent-dim text-[8px] tracking-wider">{t.reportModal.subtitle}</span>
          </div>
          <button
            onClick={onClose}
            className="text-accent-dim hover:text-accent text-[10px] px-2 py-1 border-2 border-transparent hover:border-accent"
          >
            [X]
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Report Type */}
          <div>
            <label className="block text-[8px] text-accent-dim mb-2 tracking-wider">
              {t.reportModal.incidentType}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {REPORT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`
                    px-2 py-2 text-[8px] tracking-wider border-2
                    ${formData.type === type
                      ? 'bg-accent text-background border-accent'
                      : 'bg-transparent text-accent-dim border-accent-dim hover:border-accent hover:text-accent'
                    }
                  `}
                >
                  [{type}]
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
              className="w-full px-4 py-2 bg-transparent border-2 border-accent text-accent text-[8px] tracking-wider hover:bg-accent hover:text-background disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLocating ? (
                <>
                  <span className="pixel-pulse">[*]</span>
                  <span>{t.reportModal.detectingLocation}</span>
                </>
              ) : (
                <>
                  <span>[*]</span>
                  <span>{t.reportModal.useLocation}</span>
                </>
              )}
            </button>
            {locationError && (
              <div className="mt-2 text-[8px] text-danger tracking-wider">{locationError}</div>
            )}
            {formData.coordinates && (
              <div className="mt-2 text-[8px] text-accent-dim tracking-wider">
                {t.reportModal.locationDetected} {formData.coordinates[1].toFixed(4)}, {formData.coordinates[0].toFixed(4)}
              </div>
            )}
          </div>

          {/* Nearby Incidents */}
          {nearbyIncidents.length > 0 && (
            <div className="bg-background border-2 border-warning p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-warning text-[10px]">[!]</span>
                <span className="text-warning text-[8px] tracking-wider glow-warning">{t.reportModal.nearbyIncidents}</span>
              </div>
              <p className="text-[8px] text-accent-dim tracking-wider mb-3">
                {t.reportModal.nearbyDescription
                  .replace('{count}', String(nearbyIncidents.length))
                  .replace('{plural}', nearbyIncidents.length > 1 ? 's' : '')}
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {nearbyIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="bg-background border-2 border-accent-dim p-2 flex items-start justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[8px] px-2 py-1 border-2 tracking-wider ${
                          incident.status === 'ACTIVE'
                            ? 'border-danger text-danger'
                            : 'border-warning text-warning'
                        }`}>
                          [{incident.type}]
                        </span>
                        <span className="text-[8px] text-accent-dim tracking-wider">
                          {incident.distance.toFixed(1)} {t.reportModal.milesAway}
                        </span>
                      </div>
                      <div className="text-[8px] text-accent tracking-wider truncate">
                        {incident.location.city}, {incident.location.state}
                        {incident.location.address && ` - ${incident.location.address}`}
                      </div>
                      <div className="text-[8px] text-accent-dim tracking-wider truncate mt-0.5">
                        {incident.description}
                      </div>
                      <div className="text-[8px] text-accent-dim/50 tracking-wider mt-1">
                        {formatDistanceToNow(incident.timestamp, { addSuffix: true })} · {incident.verifiedCount} {t.feed.verified}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVerifyInModal(incident.id)}
                      disabled={incident.alreadyVerified}
                      className={`shrink-0 px-2 py-1 text-[8px] tracking-wider border-2 cursor-pointer ${
                        incident.alreadyVerified
                          ? 'border-accent-dim text-accent-dim cursor-not-allowed'
                          : 'border-accent text-accent hover:bg-accent hover:text-background'
                      }`}
                    >
                      {incident.alreadyVerified ? `[${t.reportModal.verifiedButton}]` : `[${t.reportModal.verifyButton}]`}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t-2 border-warning/30 text-[8px] text-accent-dim tracking-wider text-center">
                {t.reportModal.continueNew}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[8px] text-accent-dim mb-2 tracking-wider">
                {t.reportModal.city}
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-background border-2 border-accent-dim px-3 py-2 text-[10px] text-accent placeholder:text-accent-dim/50 focus:border-accent focus:outline-none tracking-wider"
                placeholder={t.reportModal.cityPlaceholder}
              />
            </div>
            <div>
              <label className="block text-[8px] text-accent-dim mb-2 tracking-wider">
                {t.reportModal.state}
              </label>
              <select
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-background border-2 border-accent-dim px-3 py-2 text-[10px] text-accent focus:border-accent focus:outline-none tracking-wider"
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

          {/* Address with Autocomplete */}
          <div className="relative">
            <label className="block text-[8px] text-accent-dim mb-2 tracking-wider">
              {t.reportModal.address}
            </label>
            <div className="relative">
              <input
                ref={addressInputRef}
                type="text"
                value={formData.address}
                onChange={(e) => handleAddressChange(e.target.value)}
                onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                className="w-full bg-background border-2 border-accent-dim px-3 py-2 text-[10px] text-accent placeholder:text-accent-dim/50 focus:border-accent focus:outline-none tracking-wider"
                placeholder={t.reportModal.addressPlaceholder}
                autoComplete="off"
              />
              {isSearchingAddress && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-accent-dim text-[8px] loading-dots"></span>
                </div>
              )}
            </div>

            {/* Address Suggestions Dropdown */}
            {showSuggestions && addressSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-background border-2 border-accent max-h-48 overflow-y-auto"
              >
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full px-3 py-2 text-left text-[8px] text-accent tracking-wider hover:bg-accent hover:text-background border-b-2 border-accent-dim last:border-b-0"
                  >
                    {suggestion.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[8px] text-accent-dim mb-2 tracking-wider">
              {t.reportModal.description}
            </label>
            <textarea
              required
              rows={3}
              maxLength={500}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-background border-2 border-accent-dim px-3 py-2 text-[10px] text-accent placeholder:text-accent-dim/50 focus:border-accent focus:outline-none resize-none tracking-wider"
              placeholder={t.reportModal.descriptionPlaceholder}
            />
          </div>

          {/* Warning */}
          <div className="text-[8px] text-warning tracking-wider bg-background border-2 border-warning p-3">
            [!] {t.reportModal.safetyWarning}
          </div>

          {/* Anonymous Notice */}
          <div className="text-[8px] text-accent tracking-wider bg-background border-2 border-accent p-3 flex items-center gap-2">
            <span>[#]</span>
            <span>{t.reportModal.anonymousNotice}</span>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-accent-dim text-accent-dim text-[8px] tracking-wider hover:border-accent hover:text-accent"
            >
              [{t.reportModal.cancel}]
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-transparent border-2 border-danger text-danger text-[8px] tracking-wider hover:bg-danger hover:text-background disabled:opacity-50"
            >
              {isSubmitting ? `[${t.reportModal.submitting}]` : `[${t.reportModal.submit}]`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
