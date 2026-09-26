import React, { useState } from 'react';
import { TicketSummary } from '../../types';
import { IMAGES } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

interface ReportScreenProps {
  ticket: TicketSummary;
  onTrackWorkcrew: () => void;
  onViewResolutionDossier?: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  ticket,
  onTrackWorkcrew,
  onViewResolutionDossier
}) => {
  const { tickets: cloudTickets, upvoteTicketInCloud, createTicketInCloud, updateUserKarma, user } = useAuth();
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(ticket.upvotes || 38);
  const [selectedCategory, setSelectedCategory] = useState('Pothole / Road Surface Fracture (PWD)');
  const [descIndex, setDescIndex] = useState(0);
  const [scanningNext, setScanningNext] = useState(false);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCategory, setNewCategory] = useState('Pothole / Road Surface (PWD)');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccessToast, setReportSuccessToast] = useState<string | null>(null);

  const [customDescription, setCustomDescription] = useState(
    'Deep hazardous pothole on right lane towards Chengalpattu causing severe traffic bottleneck and high accident risk for two-wheelers during peak rain hours.'
  );

  const descriptions = [
    'Deep hazardous pothole on right lane towards Chengalpattu causing severe traffic bottleneck and high accident risk for two-wheelers during peak rain hours.',
    'Severe 14cm crater pothole on northern arterial lane towards Chengalpattu. Substantial hydroplaning risk and shock absorber damage risk for transit buses.',
    'Road fracture located 50m north of Potheri flyover ramp. High risk of two-wheeler skidding. Edge telemetry indicates aggregate degradation.'
  ];

  const handleRegenerateDesc = () => {
    const nextIdx = (descIndex + 1) % descriptions.length;
    setDescIndex(nextIdx);
    setCustomDescription(descriptions[nextIdx]);
  };

  const handleUpvote = () => {
    if (!upvoted) {
      setUpvoteCount(upvoteCount + 1);
      setUpvoted(true);
      upvoteTicketInCloud(ticket.id);
    } else {
      setUpvoteCount(upvoteCount - 1);
      setUpvoted(false);
    }
  };

  const handleScanNext = () => {
    setShowNewReportModal(true);
  };

  const handleCreateNewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmittingReport(true);
    try {
      const codeNum = Math.floor(1000 + Math.random() * 9000);
      await createTicketInCloud({
        code: `#UF-2026-${codeNum}`,
        title: newTitle,
        category: newCategory,
        location: newLocation || 'GST Road KM 34.1, Chengalpattu',
        coordinates: { lat: 12.8231, lng: 80.0442 },
        priority: 'P2 HIGH',
        confidence: 96,
        status: 'SUBMITTED',
        assignedCrew: 'Standby Triage Swarm',
        assignedVehicle: 'Truck Unit T-09',
        timestamp: 'Just now',
        slaLimit: '2h 00m',
        slaRemaining: '1h 59m',
        upvotes: 1,
        depthCm: 11,
        proofHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`
      });
      await updateUserKarma(25);
      setReportSuccessToast(`Report #UF-2026-${codeNum} submitted & synced to City Ops! +25 Karma awarded.`);
      setShowNewReportModal(false);
      setNewTitle('');
      setNewLocation('');
      setTimeout(() => setReportSuccessToast(null), 4000);
    } catch {
      // Handled
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-24 gap-5 max-w-lg mx-auto text-on-surface">
      {/* Header Title & AI Status Pill */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-md text-xl text-primary font-bold tracking-tight">Report a City Issue</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-primary-container font-label-code text-xs shadow-sm border border-surface-variant/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
            </span>
            Vision AI v3.1
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-secondary-container/20 text-secondary font-label-code text-[10px] uppercase tracking-wider font-semibold border border-secondary/30">
            Auto-Triage Active
          </span>
          <span className="text-on-surface-variant font-body-sm text-xs truncate">
            Real-time edge neural inference for municipal routing
          </span>
        </div>
      </div>

      {/* AI Computer Vision Inspection Frame */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container-low shadow-xl border border-surface-variant/40">
        <div className="relative w-full h-72">
          <img
            alt="AI computer vision asphalt crater scan"
            className="w-full h-full object-cover brightness-95"
            src={IMAGES.potholeCamera}
          />
          {/* Ambient Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-black/40"></div>

          {/* Live Scanline HUD Pulse Effect */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-75 shadow-[0_0_12px_#00ff9d] animate-pulse"></div>

          {/* Top Overlay Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-container-lowest/80 backdrop-blur-md text-secondary font-label-code text-[11px] border border-surface-variant/40">
              <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
              FRAME #AI-88392-NEURAL
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-container text-on-primary-container font-label-code text-[11px] font-bold shadow-md">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              94% CONFIDENCE
            </span>
          </div>

          {/* Computer Vision Bounding Box Targeting Reticle */}
          <div className="absolute top-[28%] left-[16%] right-[18%] bottom-[24%] pointer-events-none flex flex-col justify-between p-1.5 rounded-xl bg-primary-container/10 border border-primary-container/40 shadow-[0_0_20px_rgba(0,255,157,0.25)]">
            {/* Reticle Corner Indicators */}
            <div className="flex justify-between items-start">
              <span className="w-3 h-3 border-t-2 border-l-2 border-primary-container -mt-1 -ml-1"></span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest/90 text-primary-container font-label-code text-[10px] tracking-tight border border-primary-container/30">
                ROAD_SURFACE_CRATER_SEVERE
              </span>
              <span className="w-3 h-3 border-t-2 border-r-2 border-primary-container -mt-1 -mr-1"></span>
            </div>
            {/* Live Center Reticle Cross */}
            <div className="self-center flex items-center justify-center opacity-80">
              <span className="material-symbols-outlined text-primary-container text-[24px]">filter_center_focus</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="w-3 h-3 border-b-2 border-l-2 border-primary-container -mb-1 -ml-1"></span>
              <span className="px-1.5 py-0.5 rounded bg-error-container/80 text-on-error font-label-code text-[10px] font-bold">
                EST. IMPACT: 14CM DEPTH
              </span>
              <span className="w-3 h-3 border-b-2 border-r-2 border-primary-container -mb-1 -mr-1"></span>
            </div>
          </div>

          {/* Quick Telemetry Readout Strip at Bottom of Image */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high/90 backdrop-blur-md border border-surface-variant/40">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-error text-[18px] shrink-0">crisis_alert</span>
              <span className="font-label-code text-xs text-on-surface truncate">
                Hazard Class: High (Two-Wheeler Rollover Risk)
              </span>
            </div>
            <span className="font-label-code text-[11px] text-secondary shrink-0 font-semibold">Tire Loss Lv4</span>
          </div>
        </div>

        {/* AI Classification Breakdown Matrix */}
        <div className="p-3.5 flex flex-col gap-2.5 bg-surface-container-low">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">psychology</span>
              Automated Neural Classification
            </span>
            <span className="font-label-code text-[10px] text-primary-container bg-primary-container/10 px-2 py-0.5 rounded border border-primary-container/20">
              SLA Guaranteed
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-surface-container flex flex-col gap-0.5 border border-surface-variant/30">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Detected Category</span>
              <span className="font-headline-sm text-xs text-on-surface font-semibold truncate">Severe Road Pothole</span>
              <span className="font-label-code text-[10px] text-primary-container">ISO Infra Code #402-B</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container flex flex-col gap-0.5 border border-surface-variant/30">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Auto Priority</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                <span className="font-headline-sm text-xs text-error font-semibold">CRITICAL (24h SLA)</span>
              </div>
              <span className="font-label-code text-[10px] text-on-surface-variant">Rapid Dispatch Queue</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container flex items-center justify-between gap-2 border border-surface-variant/30">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">account_balance</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Assigned Authority</span>
                <span className="font-body-sm text-xs text-on-surface font-medium truncate">
                  Greater Chennai Corp & PWD Highways
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span>
          </div>
          {/* Spatial Positioning Readout */}
          <div className="p-2.5 rounded-xl bg-surface-container flex items-center justify-between gap-2 border border-surface-variant/30">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">my_location</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                  Autonomous Telemetry Coordinates
                </span>
                <span className="font-body-sm text-xs text-on-surface font-medium truncate">
                  GST Rd KM 32.4, near Potheri Junction
                </span>
                <span className="font-label-code text-[10px] text-secondary">
                  Lat: 12.8231° N • Long: 80.0452° E
                </span>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-surface-container-high text-primary-container font-label-code text-[10px] border border-surface-variant/40">
              ±1.2m
            </span>
          </div>
        </div>
      </div>

      {/* Editable Citizen AI Form */}
      <div className="rounded-2xl bg-surface-container-low p-4 flex flex-col gap-3.5 shadow-md border border-surface-variant/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary-container text-[20px]">edit_note</span>
            <h2 className="font-headline-sm text-base text-primary font-bold">Citizen Verification Form</h2>
          </div>
          <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
            AI Pre-filled
          </span>
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-code text-xs text-on-surface-variant uppercase">Municipal Category</label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-11 px-3 bg-surface-container rounded-xl text-on-surface font-body-md text-xs appearance-none focus:outline-none focus:ring-1 focus:ring-primary-container border border-surface-variant/40"
            >
              <option>Pothole / Road Surface Fracture (PWD)</option>
              <option>Streetlight Outage / Electrical Line Down (TNEB)</option>
              <option>Water Main Rupture / Drainage Clog (CMWSSB)</option>
              <option>Illegal Garbage Dumping / Biohazard (GCC Waste)</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-on-surface-variant text-[20px]">
              expand_more
            </span>
          </div>
        </div>

        {/* Description Area */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-code text-xs text-on-surface-variant uppercase">Field Description</label>
            <button
              onClick={handleRegenerateDesc}
              className="text-primary-container hover:text-primary font-label-code text-[11px] flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
              Regenerate Description
            </button>
          </div>
          <textarea
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            rows={3}
            className="w-full p-3 bg-surface-container rounded-xl text-on-surface font-body-md text-xs focus:outline-none focus:ring-1 focus:ring-primary-container resize-none border border-surface-variant/40"
          />
        </div>

        {/* Satellite GPS Confirmation Location Tile */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-code text-xs text-on-surface-variant uppercase">Verified Spatial Pin</label>
          <div
            className="w-full h-28 bg-cover bg-center rounded-xl relative overflow-hidden flex items-end p-2.5 shadow-inner border border-surface-variant/40"
            style={{ backgroundImage: `url('${IMAGES.mapSatPotheri}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container shadow-[0_0_8px_#00ff9d]"></span>
                <span className="font-label-code text-[11px] text-on-surface font-medium truncate">
                  Potheri Flyover Down-Ramp
                </span>
              </div>
              <button
                onClick={() => alert("Spatial Pin synchronized at 12.8231° N, 80.0452° E with RTK high-precision precision.")}
                className="px-2 py-1 rounded-lg bg-surface-container-high/90 backdrop-blur-sm text-secondary font-label-code text-[10px] flex items-center gap-1 border border-surface-variant/40"
              >
                <span className="material-symbols-outlined text-[12px]">tune</span>
                Fine-Tune Pin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Submitted Ticket Card / Success State */}
      <div className="rounded-2xl bg-surface-container-high p-4 flex flex-col gap-3.5 shadow-xl relative overflow-hidden border border-primary-container/30">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary-container/15 via-transparent to-transparent pointer-events-none"></div>
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-label-code text-[10px] text-primary-container uppercase font-bold tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Verified Ledger Ticket
            </span>
            <h3 className="font-headline-sm text-lg text-primary tracking-tight font-bold">{ticket.code}</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-code text-xs font-bold shadow-sm">
            {ticket.status}
          </span>
        </div>

        {/* Triage Timeline Progress Bar */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between text-center">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[11px] shadow-[0_0_10px_#00ff9d]">
                ✓
              </div>
              <span className="font-label-code text-[9px] text-primary font-bold uppercase">Submitted</span>
            </div>
            <div className="h-0.5 flex-1 bg-primary-container -mt-4"></div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[11px] shadow-[0_0_10px_#03b5d3]">
                2
              </div>
              <span className="font-label-code text-[9px] text-secondary font-bold uppercase">Assigned</span>
            </div>
            <div className="h-0.5 flex-1 bg-primary-container -mt-4"></div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-6 h-6 rounded-full bg-primary-container/30 text-primary-container flex items-center justify-center text-[11px] font-bold border border-primary-container">
                3
              </div>
              <span className="font-label-code text-[9px] text-primary-container uppercase font-bold">In Repair</span>
            </div>
            <div className="h-0.5 flex-1 bg-surface-container-highest -mt-4"></div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-[11px]">
                4
              </div>
              <span className="font-label-code text-[9px] text-on-surface-variant uppercase">Resolved</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center gap-2 border border-surface-variant/30">
            <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">engineering</span>
            <span className="font-body-sm text-xs text-on-surface truncate">
              Assigned to: <strong className="text-secondary">{ticket.assignedCrew} ({ticket.assignedVehicle})</strong>
            </span>
          </div>
        </div>

        {/* Cryptographic Proof Hash Stamp */}
        <div className="p-2 rounded-xl bg-surface-container-lowest flex items-center justify-between gap-1 font-label-code text-[10px] text-on-surface-variant border border-surface-variant/30">
          <span className="truncate">Proof Hash: {ticket.proofHash}</span>
          <span className="text-primary-container shrink-0 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[12px]">fingerprint</span>
            Tamper-proof
          </span>
        </div>

        {/* Ticket Interaction Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={onTrackWorkcrew}
            className="w-full h-11 rounded-xl bg-primary-container text-on-primary-container font-label-code text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,255,157,0.3)] hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">near_me</span>
            Track Live Workcrew GPS (Truck T-18)
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleUpvote}
              className={`h-11 rounded-xl font-label-code text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] border border-surface-variant/40 ${
                upvoted
                  ? 'bg-secondary-container/20 text-secondary border-secondary/40 font-bold'
                  : 'bg-surface-container text-on-surface hover:text-primary-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">thumb_up</span>
              <span>{upvoted ? `Upvoted (${upvoteCount})` : `Upvote (${upvoteCount} Affected)`}</span>
            </button>
            <button
              onClick={handleScanNext}
              className="h-11 rounded-xl bg-surface-container text-on-surface hover:text-secondary font-label-code text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] border border-surface-variant/40"
            >
              <span className={`material-symbols-outlined text-[18px] ${scanningNext ? 'animate-spin' : ''}`}>
                {scanningNext ? 'sync' : 'add_a_photo'}
              </span>
              <span>{scanningNext ? 'Scanning...' : 'Scan Next Issue'}</span>
            </button>
          </div>

          {/* Quick jump to Resolution Dossier if viewable */}
          {onViewResolutionDossier && (
            <button
              onClick={onViewResolutionDossier}
              className="w-full h-9 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary-fixed font-label-code text-[11px] flex items-center justify-center gap-1.5 border border-primary-container/30 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-primary-container">verified</span>
              <span>View Verified Resolution & Citizen Karma Audit</span>
            </button>
          )}
        </div>
      </div>

      {/* Citizen History / My Active Reports Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">history_edu</span>
            <h3 className="font-headline-sm text-base text-primary font-bold">My Active Reports</h3>
          </div>
          <span className="font-label-code text-xs text-on-surface-variant">
            {cloudTickets.length} Synchronized Tickets
          </span>
        </div>

        {/* Dynamically Rendered Cloud Synced Tickets */}
        {cloudTickets.slice(0, 4).map((t) => (
          <div
            key={t.id}
            className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-3 shadow-sm hover:bg-surface-container transition-all border border-surface-variant/30"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container shrink-0 border border-surface-variant/40">
                <span className="material-symbols-outlined text-[20px]">
                  {t.category.includes('Drain') ? 'water_damage' : t.category.includes('Light') ? 'wb_incandescent' : 'pothole'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-xs text-on-surface font-semibold truncate">
                    {t.title}
                  </span>
                  <span className="font-label-code text-[9px] px-1 py-0.5 rounded bg-primary-container/10 text-primary-container">
                    {t.code}
                  </span>
                </div>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                  {t.location} • SLA: {t.slaRemaining}
                </span>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded font-label-code text-[10px] font-bold shrink-0 border ${
                t.status === 'RESOLVED'
                  ? 'bg-primary-container/20 text-primary-container border-primary-container/30'
                  : t.status === 'IN REPAIR'
                  ? 'bg-secondary-container/20 text-secondary border-secondary/30'
                  : 'bg-surface-bright text-on-surface-variant border-surface-variant/40'
              }`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-high border border-surface-variant/50 p-5 shadow-2xl flex flex-col gap-3 text-on-surface animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[22px]">add_location_alt</span>
                <h3 className="font-headline-sm text-base text-primary font-bold">File New Hazard Report</h3>
              </div>
              <button
                onClick={() => setShowNewReportModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateNewReport} className="flex flex-col gap-3 pt-1">
              <div className="flex flex-col gap-1">
                <label className="font-label-code text-[11px] text-on-surface-variant uppercase">Hazard Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Deep Pothole Near Velachery Bus Stop"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container border border-surface-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-code text-[11px] text-on-surface-variant uppercase">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container border border-surface-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary-container"
                >
                  <option value="Pothole / Road Surface (PWD)">Pothole / Road Surface (PWD)</option>
                  <option value="Waterlogged Drainage (GCC)">Waterlogged Drainage (GCC)</option>
                  <option value="High-Mast Light Failure (TNEB)">High-Mast Light Failure (TNEB)</option>
                  <option value="Sidewalk Ramp Obstruction">Sidewalk Ramp Obstruction</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-code text-[11px] text-on-surface-variant uppercase">Location / Landmark</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. GST Road KM 34.1 Chengalpattu"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container border border-surface-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary-container"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReport}
                className="w-full h-11 mt-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary-fixed font-label-code text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_16px_rgba(0,255,157,0.35)] flex items-center justify-center gap-1.5"
              >
                <span className={`material-symbols-outlined text-[18px] ${submittingReport ? 'animate-spin' : ''}`}>
                  {submittingReport ? 'sync' : 'cloud_upload'}
                </span>
                <span>{submittingReport ? 'Syncing to Cloud...' : 'Submit Report & Award +25 Karma'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification Toast */}
      {reportSuccessToast && (
        <div className="fixed bottom-24 inset-x-4 max-w-sm mx-auto z-50 bg-surface-container-highest border border-primary-container/50 p-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <span className="font-label-code text-xs text-primary font-bold">{reportSuccessToast}</span>
        </div>
      )}
    </div>
  );
};
