import React, { useState } from 'react';
import { INITIAL_ROUTE_RECOMMENDATION, STANDARD_BARRIER_ROUTE } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

interface MobilityScreenProps {
  onStartNav?: () => void;
}

export const MobilityScreen: React.FC<MobilityScreenProps> = ({ onStartNav }) => {
  const { preferences, updateUserPreferences, saveRouteToCloud, user } = useAuth();
  const [accessModeActive, setAccessModeActive] = useState(preferences?.accessibilityMode ?? true);
  const [selectedCriteria, setSelectedCriteria] = useState<'fastest' | 'least-walking' | 'lowest-cost' | 'max-accessible'>(
    preferences?.preferredRouting || 'least-walking'
  );
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [departureTime, setDepartureTime] = useState('08:00 AM');
  const [isNavigating, setIsNavigating] = useState(false);
  const [savingRoute, setSavingRoute] = useState(false);

  const triggerToast = (title: string, subtitle: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleToggleAccessMode = (checked: boolean) => {
    setAccessModeActive(checked);
    updateUserPreferences({ accessibilityMode: checked });
  };

  const handleToggleConstraint = (key: 'elevatorVital' | 'lowFloorBus' | 'max3PctIncline' | 'sensoryCues') => {
    const current = preferences ? preferences[key] : true;
    updateUserPreferences({ [key]: !current });
    triggerToast(
      'Preference Synced to Cloud',
      `${key} profile updated and saved to your account.`
    );
  };

  const handleSaveRoute = async () => {
    setSavingRoute(true);
    try {
      if (user) {
        await saveRouteToCloud({
          name: INITIAL_ROUTE_RECOMMENDATION.name,
          origin: 'Tambaram Junction',
          destination: 'SRM University (KTR Campus)',
          time: INITIAL_ROUTE_RECOMMENDATION.time,
          cost: INITIAL_ROUTE_RECOMMENDATION.cost
        });
        triggerToast('Route Saved to Cloud', 'Synchronized across all your signed-in devices!');
      } else {
        triggerToast('Route Saved Locally', 'Sign in to sync saved routes across devices.');
      }
    } catch {
      triggerToast('Save Error', 'Could not sync route to cloud.');
    } finally {
      setSavingRoute(false);
    }
  };

  const handleStartNav = () => {
    setIsNavigating(true);
    triggerToast(
      'Accessible Journey Active',
      'Tambaram Platform 1 Elevator reserved. Real-time GPS & step-free sensors online.'
    );
    if (onStartNav) onStartNav();
  };

  const handleShareTrack = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    triggerToast(
      'Live Telemetry Link Copied',
      'Encrypted SOS & Family monitor feed ready for sharing.'
    );
  };

  const handleAudioAssistant = () => {
    triggerToast(
      'Vocal Navigation Enabled',
      'Spoken audio cues primed for Platform 1 ramp & coach wheelchair locks.'
    );
  };

  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-24 gap-5 max-w-lg mx-auto text-on-surface">
      {/* Dynamic Route Status Strip */}
      <div className="flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-xl border border-surface-variant/40 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
          </span>
          <span className="font-label-code text-[11px] text-primary-container uppercase tracking-wider truncate">
            Kanchipuram-Chennai Civic Corridor Live
          </span>
        </div>
        <span className="font-label-code text-[10px] text-on-surface-variant shrink-0 bg-surface-container-high px-1.5 py-0.5 rounded">
          ETA SYNCED
        </span>
      </div>

      {/* Journey Search Matrix Bento */}
      <div className="flex flex-col bg-surface-container rounded-2xl p-4 shadow-xl relative overflow-hidden border border-surface-variant/40">
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-secondary-container/10 blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">route</span>
            <span className="font-headline-sm text-[17px] text-primary font-bold">Transit Wayfinder</span>
          </div>
          <span className="font-label-code text-[10px] px-2 py-0.5 rounded-full bg-surface-bright text-on-surface-variant font-bold border border-surface-variant/30">
            GRID-AI v4.2
          </span>
        </div>

        {/* From / To Input Nodes */}
        <div className="space-y-2 relative">
          {/* Origin */}
          <div className="flex items-center gap-3 bg-surface-container-lowest px-3 py-2.5 rounded-xl border border-surface-variant/30 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0 text-primary-container">
              <span className="material-symbols-outlined text-[18px]">trip_origin</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Origin Station Hub</span>
              <span className="font-body-md text-sm text-primary font-medium truncate">
                Tambaram Junction (TBM) - Station Hub
              </span>
            </div>
            <span className="material-symbols-outlined text-primary-container text-[18px]">verified</span>
          </div>

          {/* Connector Dot Line */}
          <div className="flex items-center pl-6 py-0.5">
            <div className="w-0.5 h-3 bg-outline-variant"></div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-3 bg-surface-container-lowest px-3 py-2.5 rounded-xl border border-surface-variant/30 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0 text-secondary">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Target Campus</span>
              <span className="font-body-md text-sm text-primary font-medium truncate">
                SRM Institute of Science & Technology (KTR)
              </span>
            </div>
            <span className="material-symbols-outlined text-primary-container text-[18px]">accessible_forward</span>
          </div>
        </div>

        {/* Departure Meta */}
        <div className="flex items-center justify-between mt-3 pt-3 bg-surface-container-high/40 px-3 py-2 rounded-xl border border-surface-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">schedule</span>
            {isEditingSchedule ? (
              <input
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                onBlur={() => setIsEditingSchedule(false)}
                autoFocus
                className="bg-surface-container-lowest text-primary px-2 py-0.5 rounded font-label-code text-xs outline-none w-28"
              />
            ) : (
              <span className="font-label-code text-xs text-on-surface">
                {departureTime} • Peak Civic Transit
              </span>
            )}
          </div>
          <button
            onClick={() => setIsEditingSchedule(!isEditingSchedule)}
            className="font-label-code text-xs text-secondary font-bold uppercase tracking-wider active:scale-95 transition-transform"
          >
            {isEditingSchedule ? 'Save' : 'Edit Schedule'}
          </button>
        </div>

        {/* Routing Criteria Pills */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          <button
            onClick={() => setSelectedCriteria('fastest')}
            className={`px-3 py-2 rounded-full font-label-code text-xs shrink-0 active:scale-95 transition-all flex items-center gap-1.5 border border-surface-variant/40 ${
              selectedCriteria === 'fastest'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(0,255,157,0.35)]'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">bolt</span> Fastest
          </button>
          <button
            onClick={() => setSelectedCriteria('least-walking')}
            className={`px-3 py-2 rounded-full font-label-code text-xs shrink-0 active:scale-95 transition-all flex items-center gap-1.5 border border-surface-variant/40 ${
              selectedCriteria === 'least-walking'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(0,255,157,0.35)]'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">directions_walk</span> Least Walking
          </button>
          <button
            onClick={() => setSelectedCriteria('lowest-cost')}
            className={`px-3 py-2 rounded-full font-label-code text-xs shrink-0 active:scale-95 transition-all flex items-center gap-1.5 border border-surface-variant/40 ${
              selectedCriteria === 'lowest-cost'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(0,255,157,0.35)]'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">payments</span> Lowest Cost
          </button>
          <button
            onClick={() => setSelectedCriteria('max-accessible')}
            className={`px-3 py-2 rounded-full font-label-code text-xs shrink-0 active:scale-95 transition-all flex items-center gap-1.5 border border-surface-variant/40 ${
              selectedCriteria === 'max-accessible'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(0,255,157,0.35)]'
                : 'bg-surface-container-high text-secondary-fixed-dim hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">accessible</span> Max Accessible
          </button>
        </div>
      </div>

      {/* Dedicated Accessibility Mode Panel */}
      <div className="bg-surface-container-high rounded-2xl p-4 relative overflow-hidden shadow-2xl border border-primary-container/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary-container/25 flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[20px]">accessible_forward</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-base text-primary font-bold">UrbanFlow Access™</span>
              <span className="font-label-code text-[10px] text-primary-container font-semibold uppercase tracking-wider">
                Audit Profile: Zero-Barrier {accessModeActive ? 'Active' : 'Paused'}
              </span>
            </div>
          </div>
          {/* Custom Animated Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={accessModeActive}
              onChange={(e) => handleToggleAccessMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-7 bg-surface-container-lowest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-container after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-primary-container after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-container/40 shadow-inner"></div>
          </label>
        </div>

        {/* Active Constraints Grid - Click to toggle & persist */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleToggleConstraint('elevatorVital')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
              (preferences?.elevatorVital ?? true)
                ? 'bg-surface-container-lowest border-primary-container/50 text-primary'
                : 'bg-surface-container-lowest/40 border-surface-variant/20 opacity-60 text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-primary-container text-[18px]">elevator</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-code text-xs font-semibold leading-tight">Elevator Vital</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                {(preferences?.elevatorVital ?? true) ? 'Forced' : 'Disabled'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleToggleConstraint('lowFloorBus')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
              (preferences?.lowFloorBus ?? true)
                ? 'bg-surface-container-lowest border-primary-container/50 text-primary'
                : 'bg-surface-container-lowest/40 border-surface-variant/20 opacity-60 text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-primary-container text-[18px]">directions_bus</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-code text-xs font-semibold leading-tight">Low-Floor Bus</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                {(preferences?.lowFloorBus ?? true) ? 'Ramp on' : 'Disabled'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleToggleConstraint('max3PctIncline')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
              (preferences?.max3PctIncline ?? true)
                ? 'bg-surface-container-lowest border-primary-container/50 text-primary'
                : 'bg-surface-container-lowest/40 border-surface-variant/20 opacity-60 text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-primary-container text-[18px]">landscape</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-code text-xs font-semibold leading-tight">Max 3% Incline</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                {(preferences?.max3PctIncline ?? true) ? 'Checked' : 'Disabled'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleToggleConstraint('sensoryCues')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
              (preferences?.sensoryCues ?? true)
                ? 'bg-surface-container-lowest border-primary-container/50 text-primary'
                : 'bg-surface-container-lowest/40 border-surface-variant/20 opacity-60 text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-primary-container text-[18px]">hearing</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-code text-xs font-semibold leading-tight">Sensory Cues</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                {(preferences?.sensoryCues ?? true) ? 'Active' : 'Disabled'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Map View (Corridor Telemetry) */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container-lowest shadow-2xl flex flex-col border border-surface-variant/40">
        <div className="relative w-full h-56 bg-surface-container-lowest overflow-hidden">
          {/* Dark stylized vector transit grid */}
          <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
              <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff9d" />
                <stop offset="50%" stopColor="#4cd7f6" />
                <stop offset="100%" stopColor="#00ff9d" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Standard road grid traces */}
            <path d="M-20,120 Q120,100 240,160 T460,90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
            <path d="M60,-20 L90,260" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
            <path d="M280,-20 L270,260" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
            {/* Inaccessible Route (Warning Dotted Path) */}
            <path
              d="M 40,80 C 110,60 170,140 230,120 S 330,80 340,150"
              fill="none"
              opacity="0.6"
              stroke="#ffb4ab"
              strokeDasharray="3,3"
              strokeWidth="2"
            />
            {/* Recommended Accessible Green Corridor Path */}
            <path
              d="M 40,90 C 100,120 180,95 240,140 S 310,130 340,150"
              fill="none"
              stroke="url(#routeGlow)"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>

          {/* Pin: Tambaram Junction */}
          <div className="absolute top-[65px] left-[24px] flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-[0_0_14px_#00ff9d] animate-pulse">
              <span className="material-symbols-outlined text-[16px]">train</span>
            </div>
            <span className="font-label-code text-[9px] bg-surface-container-high/90 text-primary px-1.5 py-0.5 rounded mt-1 whitespace-nowrap shadow-md border border-surface-variant/40">
              Tambaram TBM
            </span>
          </div>

          {/* Live GPS Marker: Guduvanchery Intermediate Pulse */}
          <div className="absolute top-[82px] left-[175px] flex flex-col items-center">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-80"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary text-[9px] text-on-secondary font-bold items-center justify-center">
                ●
              </span>
            </span>
            <span className="font-label-code text-[8px] bg-surface-container-lowest/90 text-secondary px-1 py-0.2 rounded mt-0.5 border border-secondary/30">
              Suburban Bay #2
            </span>
          </div>

          {/* Pin: Potheri Station & Ramp */}
          <div className="absolute top-[125px] left-[235px] flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center shadow-[0_0_10px_#03b5d3]">
              <span className="material-symbols-outlined text-[14px]">elevator</span>
            </div>
            <span className="font-label-code text-[9px] bg-surface-container-high/90 text-on-surface px-1.5 py-0.5 rounded mt-0.5 whitespace-nowrap border border-surface-variant/40">
              Potheri Ramp
            </span>
          </div>

          {/* Pin: SRM Destination */}
          <div className="absolute top-[135px] right-[24px] flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-[0_0_16px_#56ffa8]">
              <span className="material-symbols-outlined text-[16px]">school</span>
            </div>
            <span className="font-label-code text-[9px] bg-surface-container-high/90 text-primary-fixed px-1.5 py-0.5 rounded mt-1 whitespace-nowrap font-bold border border-primary-fixed/30">
              SRM KTR Campus
            </span>
          </div>

          {/* Floating Map Legend Overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-surface-container-lowest/90 px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md border border-surface-variant/40">
            <div className="w-2.5 h-2.5 rounded-full bg-primary-container"></div>
            <span className="font-label-code text-[10px] text-primary">Elevator Verified Corridor</span>
          </div>
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-surface-container-high/80 px-2 py-1 rounded-lg backdrop-blur-md border border-surface-variant/40">
            <span className="material-symbols-outlined text-secondary text-[14px]">radar</span>
            <span className="font-label-code text-[10px] text-on-surface">3 Active Transits In-Range</span>
          </div>
        </div>
      </div>

      {/* Audited Route Matrix */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-base text-primary font-bold">Audited Route Matrix</span>
          <span className="font-label-code text-[11px] text-on-surface-variant uppercase">
            Spatial Intelligence AI
          </span>
        </div>

        {/* 1. RECOMMENDED ACCESSIBLE ROUTE */}
        <div className="bg-surface-container rounded-2xl p-4 shadow-[0_0_24px_rgba(0,255,157,0.15)] relative overflow-hidden flex flex-col gap-3 border border-primary-container/30">
          <div className="absolute top-0 inset-x-0 h-1 bg-primary-container shadow-[0_0_8px_#00ff9d]"></div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-code text-[10px] uppercase font-bold tracking-wider">
                  Recommended Zero-Stair
                </span>
                <span className="px-1.5 py-0.5 rounded bg-surface-bright text-primary-container font-label-code text-[10px] font-bold border border-primary-container/30">
                  98% Fit
                </span>
              </div>
              <span className="font-headline-sm text-base text-primary font-bold">
                {INITIAL_ROUTE_RECOMMENDATION.name}
              </span>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="font-headline-lg-mobile text-2xl text-primary font-bold tracking-tight">
                48 <span className="font-body-sm text-xs text-on-surface-variant font-normal">min</span>
              </span>
              <span className="font-label-code text-xs text-primary-container font-bold">
                {INITIAL_ROUTE_RECOMMENDATION.cost}
              </span>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-2 rounded-xl text-center border border-surface-variant/30">
            <div className="flex flex-col">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Walking Distance</span>
              <span className="font-label-telemetry text-xs text-primary font-bold">220m Total</span>
              <span className="font-body-sm text-[10px] text-primary-container">Flat Grade 0.4%</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Vertical Lift</span>
              <span className="font-label-telemetry text-xs text-primary-container font-bold">2 Elevators</span>
              <span className="font-body-sm text-[10px] text-primary-container">🟢 Online Now</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Transit Mode</span>
              <span className="font-label-telemetry text-xs text-secondary font-bold">Dedicated Bay</span>
              <span className="font-body-sm text-[10px] text-on-surface-variant">Wheelchair Space</span>
            </div>
          </div>

          {/* Turn-by-Turn Accessible Milestones */}
          <div className="flex flex-col gap-2.5 pt-1">
            {INITIAL_ROUTE_RECOMMENDATION.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-primary-container shrink-0 mt-0.5 border border-surface-variant/40">
                  <span className="material-symbols-outlined text-[15px]">{step.icon}</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-body-md text-primary font-medium text-xs">{step.title}</span>
                    <span className="font-label-code text-[10px] text-primary-container bg-primary-container/10 px-1 rounded">
                      {step.time}
                    </span>
                  </div>
                  <span className="font-body-sm text-on-surface-variant text-[11px] leading-tight mt-0.5">
                    {step.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. STANDARD ROUTE (Highlighting Urban Barriers) */}
        <div className="bg-surface-container-low rounded-2xl p-4 shadow-md opacity-90 relative overflow-hidden flex flex-col gap-3 border border-error/30">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded bg-error-container text-on-error font-label-code text-[10px] uppercase font-bold tracking-wider">
                  {STANDARD_BARRIER_ROUTE.badge}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-surface-bright text-error font-label-code text-[10px] font-bold border border-error/30">
                  {STANDARD_BARRIER_ROUTE.score}
                </span>
              </div>
              <span className="font-headline-sm text-base text-on-surface font-semibold">
                {STANDARD_BARRIER_ROUTE.name}
              </span>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="font-headline-lg-mobile text-2xl text-on-surface font-bold tracking-tight">
                {STANDARD_BARRIER_ROUTE.time}
              </span>
              <span className="font-label-code text-xs text-on-surface-variant">
                {STANDARD_BARRIER_ROUTE.cost}
              </span>
            </div>
          </div>

          {/* Warning Matrix */}
          <div className="bg-error-container/20 rounded-xl p-2.5 flex items-start gap-2.5 border border-error/30">
            <span className="material-symbols-outlined text-error text-[22px] shrink-0 mt-0.5">warning</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-code text-[10px] text-error font-bold uppercase">
                Critical Inaccessibility Alerts
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
                {STANDARD_BARRIER_ROUTE.warning}
              </span>
            </div>
          </div>

          {/* Metrics Breakdown */}
          <div className="grid grid-cols-3 gap-2 bg-surface-container-lowest p-2 rounded-xl text-center border border-surface-variant/30">
            <div className="flex flex-col">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Walk Length</span>
              <span className="font-label-telemetry text-xs text-error font-bold">850 meters</span>
              <span className="font-body-sm text-[10px] text-error">Uneven flagstones</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Physical Obstacle</span>
              <span className="font-label-telemetry text-xs text-error font-bold">64 Stairs</span>
              <span className="font-body-sm text-[10px] text-error">No Ramp Present</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Vehicle Type</span>
              <span className="font-label-telemetry text-xs text-on-surface-variant font-bold">High Floor</span>
              <span className="font-body-sm text-[10px] text-error">3 Stiff Bus Steps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Call To Action Suite */}
      <div className="flex flex-col gap-2.5 pt-2">
        <button
          onClick={handleStartNav}
          className="w-full h-14 rounded-2xl bg-primary-container text-on-primary-container font-label-code text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.4)] active:scale-[0.98] transition-all hover:brightness-105"
        >
          <span className="material-symbols-outlined text-[22px]">navigation</span>
          <span>{isNavigating ? 'Navigating: Platform 1 Ramp Next' : 'Start Accessible Turn-By-Turn'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleShareTrack}
            className="h-11 rounded-xl bg-surface-container-high text-secondary hover:bg-surface-bright font-label-code text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[18px]">share_location</span>
            <span>Share Live Track</span>
          </button>
          <button
            onClick={handleAudioAssistant}
            className="h-11 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-bright font-label-code text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[18px] text-primary-container">volume_up</span>
            <span>Audio Assistant</span>
          </button>
        </div>

        {/* Cloud Sync Saved Route Button */}
        <button
          onClick={handleSaveRoute}
          disabled={savingRoute}
          className="w-full h-11 rounded-xl bg-surface-container-high hover:bg-surface-bright text-primary font-label-code text-xs flex items-center justify-center gap-2 transition-all border border-primary-container/30 active:scale-98 shadow-sm"
        >
          <span className={`material-symbols-outlined text-[18px] text-primary-container ${savingRoute ? 'animate-spin' : ''}`}>
            {savingRoute ? 'sync' : 'bookmark_add'}
          </span>
          <span>{savingRoute ? 'Saving Route to Cloud...' : 'Save & Sync Accessible Route'}</span>
        </button>
      </div>

      {/* Sensory Feedback Notification Pill Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 inset-x-4 max-w-sm mx-auto z-50 bg-surface-container-highest border border-primary-container/50 p-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-label-code text-xs text-primary font-bold">{toastMessage.title}</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant truncate">{toastMessage.subtitle}</span>
          </div>
        </div>
      )}
    </div>
  );
};
