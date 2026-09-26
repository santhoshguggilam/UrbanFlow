import React, { useState } from 'react';
import { CrewTelemetry, TicketSummary } from '../../types';
import { IMAGES } from '../../data/mockData';

interface TruckCorridorScreenProps {
  telemetry: CrewTelemetry;
  ticket: TicketSummary;
  onOpenRepairModal: () => void;
  onOpenNotifyModal: () => void;
  onBackToGis: () => void;
}

export const TruckCorridorScreen: React.FC<TruckCorridorScreenProps> = ({
  telemetry,
  ticket,
  onOpenRepairModal,
  onOpenNotifyModal,
  onBackToGis
}) => {
  const [radioActive, setRadioActive] = useState(false);
  const [commsInput, setCommsInput] = useState('');
  const [commsFeed, setCommsFeed] = useState([
    {
      sender: 'CivicAgent AI',
      time: '07:29:12',
      text: 'Target crater geometry updated via citizen LiDAR ping. Surface cavity expanded 2cm. Maintain IR pre-heating to 165°C.'
    },
    {
      sender: 'Sundaram (Lead)',
      time: '07:31:04',
      text: 'Roger CivicAgent. Infrared box is prepped. Arrow board deployed at 45-degree diversion ready for Lane 2 block.'
    },
    {
      sender: 'CivicAgent AI',
      time: '07:33:48',
      text: 'Police Cruiser C-09 notified. They will slow median traffic 400m upstream at 07:44. Proceed on schedule.'
    }
  ]);
  const [activeLayer, setActiveLayer] = useState<'traffic' | 'cameras' | 'radar'>('traffic');

  const handleSendComms = () => {
    if (!commsInput.trim()) return;
    const newMsg = {
      sender: 'Off. R. Sundaram (MDT)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: commsInput
    };
    setCommsFeed((prev) => [...prev, newMsg]);
    setCommsInput('');

    setTimeout(() => {
      setCommsFeed((prev) => [
        ...prev,
        {
          sender: 'CivicAgent AI',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          text: 'Acknowledged. Telemetry confirmed on LoRa Gateway #KTR-09. All field parameters nominal.'
        }
      ]);
    }, 700);
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-12 text-on-surface">
      {/* Top Breadcrumb & Status Ribbon */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low shadow-md relative overflow-hidden border border-surface-variant/40">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary-container/5 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 font-label-code text-xs text-on-surface-variant uppercase tracking-wider flex-wrap">
            <button onClick={onBackToGis} className="hover:text-primary transition-colors">
              Ops Command
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Field Crews & Fleet</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>PWD Highways</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary font-semibold">{telemetry.truckId} (Taskforce #4)</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-headline-md text-xl sm:text-2xl text-primary tracking-tight font-bold flex items-center gap-2">
              <span>Truck T-18 Dispatch Corridor</span>
              <span className="font-label-code text-xs px-2 py-0.5 rounded bg-surface-container-highest text-secondary uppercase font-semibold border border-surface-variant/40">
                {telemetry.callsign}
              </span>
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/15 shadow-[0_0_12px_rgba(0,255,157,0.2)] border border-primary-container/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
              </span>
              <span className="font-label-code text-xs text-primary-fixed-dim uppercase tracking-wider font-semibold">
                En Route :: Ticket {ticket.code}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setRadioActive(!radioActive)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-label-telemetry text-xs font-semibold border ${
              radioActive
                ? 'bg-secondary text-surface border-secondary shadow-[0_0_12px_rgba(76,215,246,0.4)]'
                : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border-surface-variant/40'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">radio</span>
            <span>{radioActive ? 'Radio ON' : 'Radio CH-4'}</span>
          </button>
          <button
            onClick={() => alert("Auto-reroute verified via Chengalpattu bypass: Current GST corridor is fastest.")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-all font-label-telemetry text-xs border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-secondary text-[18px]">alt_route</span>
            <span>Reroute</span>
          </button>
          <button
            onClick={() => alert("Police Cruiser C-09 alerted for traffic escort at Guduvanchery.")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-error-container/30 text-error hover:bg-error-container/50 transition-all font-label-telemetry text-xs border border-error/30"
          >
            <span className="material-symbols-outlined text-[18px]">local_police</span>
            <span>Escort Req</span>
          </button>
          <button
            onClick={() => alert("MDT Work Order #WO-8819 opened on vehicle terminal.")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary-fixed transition-all font-label-code text-xs uppercase tracking-wider font-bold shadow-[0_0_16px_rgba(0,255,157,0.3)]"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Work Order</span>
          </button>
          <button
            onClick={onOpenRepairModal}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-primary-container/50 text-primary-container transition-all font-label-code text-xs uppercase tracking-wider font-bold shadow-[0_0_12px_rgba(0,255,157,0.25)]"
          >
            <span className="material-symbols-outlined text-primary-container text-[18px]">verified</span>
            <span>Inspect Repair</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
            </span>
          </button>
          <button
            onClick={onOpenNotifyModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary-container/20 border border-secondary text-secondary hover:bg-secondary hover:text-on-secondary transition-all font-label-code text-xs uppercase tracking-wider font-bold shadow-[0_0_12px_rgba(76,215,246,0.2)]"
          >
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            <span>Citizen Alert</span>
            <span className="px-1.5 py-0.2 rounded bg-secondary text-on-secondary text-[10px] font-bold">38</span>
          </button>
        </div>
      </section>

      {/* Main Operational Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 w-full">
        {/* LEFT COLUMN: CREW, TELEMETRY, INVENTORY (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-5 min-w-0">
          {/* Incident Briefing Hero Tile */}
          <section className="p-4 sm:p-5 rounded-2xl bg-surface-container-low shadow-md relative overflow-hidden flex flex-col gap-3.5 border border-surface-variant/40">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-error via-secondary to-primary-container"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-error/20 text-error font-label-code text-[11px] uppercase font-bold tracking-wider border border-error/30">
                  P1 CRITICAL HAZARD
                </span>
                <span className="font-label-telemetry text-xs text-on-surface-variant font-mono">
                  Ticket {ticket.code}
                </span>
              </div>
              <div className="flex items-center gap-1 font-label-code text-xs text-secondary font-semibold">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                <span>SLA ACTIVE</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-headline-sm text-lg text-primary font-bold tracking-tight">
                GST Road KM 32.4 — Potheri Down-Ramp
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Severe asphalt crater (14cm depth) located in high-speed Lane 2 adjacent to median barrier. High rollover and two-wheeler crash hazard under peak transit load.
              </p>
            </div>

            {/* Metric Strips */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-surface-container border border-surface-variant/30 text-center">
              <div className="flex flex-col gap-0.5">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">ETA To Site</span>
                <span className="font-headline-sm text-sm sm:text-base text-primary-container font-bold">11 min</span>
                <span className="font-label-telemetry text-[10px] text-on-surface-variant">4.2 km remaining</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Target SLA</span>
                <span className="font-headline-sm text-sm sm:text-base text-secondary font-bold">21h 14m</span>
                <span className="font-label-telemetry text-[10px] text-on-surface-variant">24h Max Limit</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Repair Est</span>
                <span className="font-headline-sm text-sm sm:text-base text-on-surface font-bold">45 min</span>
                <span className="font-label-telemetry text-[10px] text-on-surface-variant">IR Compaction</span>
              </div>
            </div>
          </section>

          {/* Crew & Vehicle Spec Card */}
          <section className="p-4 sm:p-5 rounded-2xl bg-surface-container-low shadow-md flex flex-col gap-3.5 border border-surface-variant/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[22px]">engineering</span>
                <h2 className="font-headline-sm text-base text-primary font-bold">Field Unit Composition</h2>
              </div>
              <span className="font-label-code text-xs text-secondary uppercase font-semibold">
                CALLSIGN: {telemetry.callsign}
              </span>
            </div>

            {/* Vehicle Asset Row */}
            <div className="p-3 rounded-xl bg-surface-container flex flex-col sm:flex-row items-start sm:items-center gap-3 border border-surface-variant/30">
              <img
                alt="Heavy municipal road repair truck"
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-surface-variant/40"
                src={IMAGES.truckFront}
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-sm text-on-surface font-bold truncate">
                    Tata Prima 2830.K Heavy Utility
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-primary-container/20 text-primary-container font-label-code text-[10px] font-bold">
                    T-18
                  </span>
                </div>
                <span className="font-body-sm text-[11px] text-on-surface-variant">
                  Cold-Patch Road Surfacing Carrier • Dept Plate: TN-09-PWD-8831
                </span>
                <div className="flex items-center gap-2 mt-1 font-label-telemetry text-[10px] text-secondary">
                  <span>Dual Hydraulic Tampers</span>
                  <span>•</span>
                  <span>180° Arrow Bar Active</span>
                </div>
              </div>
            </div>

            {/* Crew Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-surface-container flex items-center gap-2.5 border border-surface-variant/30">
                <img
                  alt="Senior highway engineer portrait"
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-surface-variant/40"
                  src={IMAGES.officerSundaram}
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-body-md text-xs text-on-surface font-semibold truncate">
                      {telemetry.driverName}
                    </span>
                    <span className="material-symbols-outlined text-primary-container text-[14px]">verified</span>
                  </div>
                  <span className="font-label-code text-[10px] text-on-surface-variant">
                    {telemetry.badge} • Lead
                  </span>
                  <span className="font-label-telemetry text-[10px] text-primary-fixed-dim font-bold">
                    Rating: {telemetry.driverRating}/5.0
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container flex flex-col justify-between border border-surface-variant/30">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                  Active Crew Complement
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-headline-sm text-sm text-on-surface font-bold">
                    {telemetry.techsCount} Techs
                  </span>
                  <span className="font-label-telemetry text-[10px] text-secondary">1 Driver, 1 Op, 2 Crew</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-primary-container h-full w-full"></div>
                </div>
              </div>
            </div>

            {/* Equipment Sub-Systems Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <div className="p-2 rounded-lg bg-surface-container flex flex-col gap-0.5 border border-surface-variant/30 text-center">
                <span className="font-label-code text-[9px] text-on-surface-variant truncate">Hydraulic Tampers</span>
                <span className="font-label-telemetry text-[11px] text-primary-container font-semibold">ONLINE</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container flex flex-col gap-0.5 border border-surface-variant/30 text-center">
                <span className="font-label-code text-[9px] text-on-surface-variant truncate">IR Heater</span>
                <span className="font-label-telemetry text-[11px] text-secondary font-semibold">165°C HEAT</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container flex flex-col gap-0.5 border border-surface-variant/30 text-center">
                <span className="font-label-code text-[9px] text-on-surface-variant truncate">Hot-Box Storage</span>
                <span className="font-label-telemetry text-[11px] text-primary-fixed-dim font-semibold">82% NOM</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container flex flex-col gap-0.5 border border-surface-variant/30 text-center">
                <span className="font-label-code text-[9px] text-on-surface-variant truncate">Arrow Beacon</span>
                <span className="font-label-telemetry text-[11px] text-primary-container font-semibold">FLASHING</span>
              </div>
            </div>
          </section>

          {/* Live Telemetry Gauges */}
          <section className="p-4 sm:p-5 rounded-2xl bg-surface-container-low shadow-md flex flex-col gap-3.5 border border-surface-variant/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">speed</span>
                <h2 className="font-headline-sm text-base text-primary font-bold">Vehicle Telemetry</h2>
              </div>
              <span className="font-label-telemetry text-xs text-on-surface-variant font-mono">NavIC + LoRa 24ms</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-surface-container flex flex-col justify-between border border-surface-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Current Speed</span>
                  <span className="font-label-code text-[10px] text-secondary">LIMIT 50</span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="font-headline-lg text-2xl text-primary font-bold">{telemetry.speedKmH}</span>
                  <span className="font-label-telemetry text-xs text-on-surface-variant">km/h</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full w-[84%]"></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container flex flex-col justify-between border border-surface-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Hybrid Energy</span>
                  <span className="font-label-code text-[10px] text-primary-container">{telemetry.hybridRangeKm} KM</span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="font-headline-lg text-2xl text-primary font-bold">{telemetry.hybridEnergyPct}</span>
                  <span className="font-label-telemetry text-xs text-on-surface-variant">%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-[78%]"></div>
                </div>
              </div>
            </div>

            {/* Cold-patch payload */}
            <div className="p-3 rounded-xl bg-surface-container flex flex-col gap-1.5 border border-surface-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Cold-Patch Compound</span>
                <span className="font-label-telemetry text-xs text-primary-container font-semibold">
                  {telemetry.coldPatchCurrentTons} / {telemetry.coldPatchCapacityTons} TONS (75.5%)
                </span>
              </div>
              <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full w-[75.5%] shadow-[0_0_8px_rgba(0,255,157,0.4)]"></div>
              </div>
              <div className="flex items-center justify-between font-label-telemetry text-[10px] text-on-surface-variant pt-0.5">
                <span>Capacity for ~12 craters</span>
                <span className="text-secondary">Depot Refuel: 14:00</span>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: GIS MAP, TURN-BY-TURN & DASHCAM (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-5 min-w-0">
          {/* Tactical GIS Feed */}
          <section className="rounded-2xl bg-surface-container-low shadow-md overflow-hidden flex flex-col relative border border-surface-variant/40">
            <div className="px-4 py-3 bg-surface-container flex items-center justify-between z-10 border-b border-surface-variant/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
                <span className="font-headline-sm text-sm sm:text-base text-on-surface font-bold">
                  GST Corridor Tactical GIS Feed
                </span>
                <span className="hidden sm:inline-block font-label-code text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-primary-container font-semibold">
                  DUAL GPS L1/L5
                </span>
              </div>
              <div className="flex items-center gap-1">
                {(['traffic', 'cameras', 'radar'] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveLayer(layer)}
                    className={`px-2 py-1 rounded-lg font-label-code text-[10px] uppercase transition-all ${
                      activeLayer === layer
                        ? 'bg-primary-container text-on-primary-container font-bold'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>

            {/* Tactical Vector Route Map */}
            <div className="relative w-full h-[360px] md:h-[400px] bg-surface-container-lowest overflow-hidden">
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(circle, #4cd7f6 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              ></div>

              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 400">
                <defs>
                  <filter id="corridorGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Road Arterials */}
                <path d="M 40,30 L 680,120" stroke="#1c2028" strokeWidth="8" strokeLinecap="round" />
                <path d="M 120,380 L 340,20" stroke="#1c2028" strokeWidth="6" strokeLinecap="round" />
                <path d="M 520,380 L 650,40" stroke="#1c2028" strokeWidth="6" strokeLinecap="round" />

                {/* GST Road Baseline */}
                <path d="M 50,80 Q 220,110 320,180 T 520,290 L 650,340" fill="none" stroke="#262a33" strokeWidth="12" strokeLinecap="round" />

                {/* Traffic colors */}
                <path d="M 50,80 Q 220,110 320,180" fill="none" stroke="#00ff9d" strokeWidth="6" opacity="0.4" strokeLinecap="round" />
                <path d="M 320,180 T 420,230" fill="none" stroke="#f59e0b" strokeWidth="6" opacity="0.6" strokeLinecap="round" />
                <path d="M 420,230 T 520,290 L 650,340" fill="none" stroke="#00ff9d" strokeWidth="6" opacity="0.5" strokeLinecap="round" />

                {/* Active Dispatched Path */}
                <path d="M 50,80 Q 220,110 320,180 T 440,245" fill="none" stroke="#4cd7f6" strokeWidth="4" strokeDasharray="6 2" filter="url(#corridorGlow)" />
                <path d="M 440,245 T 520,290 L 600,325" fill="none" stroke="#00ff9d" strokeWidth="3" strokeDasharray="4 4" opacity="0.7" />

                {/* Nodes */}
                <circle cx="50" cy="80" r="6" fill="#4cd7f6" />
                <text x="60" y="75" fill="#dfe2ee" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600">
                  TAMBARAM DEPOT (DEP: 07:15)
                </text>

                <circle cx="320" cy="180" r="5" fill="#4cd7f6" />
                <text x="330" y="175" fill="#b9cbbc" fontFamily="JetBrains Mono" fontSize="10">
                  VANDALUR FLYOVER (07:28)
                </text>

                {/* Police Patrol */}
                <g transform="translate(480, 200)">
                  <circle cx="0" cy="0" r="4" fill="#acedff" className="animate-pulse" />
                  <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="#acedff" strokeWidth="1" opacity="0.5" />
                  <text x="12" y="4" fill="#acedff" fontFamily="JetBrains Mono" fontSize="10">
                    PATROL C-09 (TRAFFIC HOLD)
                  </text>
                </g>

                {/* Target Incident Pothole */}
                <g transform="translate(600, 325)">
                  <circle cx="0" cy="0" r="24" fill="#ef4444" opacity="0.15" className="animate-ping" />
                  <circle cx="0" cy="0" r="12" fill="#ef4444" opacity="0.3" />
                  <circle cx="0" cy="0" r="5" fill="#ef4444" />
                  <text x="-90" y="-14" fill="#ffb4ab" fontFamily="Space Grotesk" fontSize="11" fontWeight="700">
                    INCIDENT #UF-2026-1042
                  </text>
                  <text x="-90" y="-2" fill="#ffdad6" fontFamily="JetBrains Mono" fontSize="9">
                    CRATER 14cm DEPTH (LANE 2)
                  </text>
                </g>

                {/* Active Truck T-18 */}
                <g transform="translate(440, 245)">
                  <circle cx="0" cy="0" r="18" fill="#4cd7f6" opacity="0.2" className="animate-ping" />
                  <circle cx="0" cy="0" r="8" fill="#0f131c" stroke="#4cd7f6" strokeWidth="3" />
                  <circle cx="0" cy="0" r="3" fill="#00ff9d" />
                  <polygon points="12,0 0,-5 0,5" fill="#00ff9d" transform="rotate(35)" />
                </g>
              </svg>

              {/* Coordinates HUD Card */}
              <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-surface-container/90 backdrop-blur-md shadow-lg border border-surface-variant/40 flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 font-label-code text-[11px] text-secondary font-semibold">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span>TRUCK T-18 ACTIVE BEACON</span>
                </div>
                <span className="font-label-telemetry text-xs text-on-surface font-mono">
                  12.8231° N, 80.0452° E • Heading 204° SSW
                </span>
                <span className="font-label-telemetry text-[11px] text-on-surface-variant">
                  Approaching Guduvanchery Toll Bypass • Speed 42 km/h
                </span>
              </div>
            </div>

            {/* Turn-by-Turn Waypoint Sequence */}
            <div className="p-3.5 bg-surface-container-high flex flex-col gap-2 border-t border-surface-variant/40">
              <div className="flex items-center justify-between">
                <span className="font-label-code text-xs text-on-surface-variant uppercase font-semibold">
                  Turn-by-Turn Waypoint Sequence
                </span>
                <span className="font-label-telemetry text-xs text-primary-container font-mono">
                  Step 3 of 5 In Progress
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {telemetry.waypoints.map((wp, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl flex flex-col gap-0.5 border ${
                      wp.status === 'current'
                        ? 'bg-primary-container/15 border-primary-container/40 shadow-sm'
                        : 'bg-surface-container border-surface-variant/30'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {wp.status === 'complete' && (
                        <span className="material-symbols-outlined text-primary-container text-[14px]">check_circle</span>
                      )}
                      {wp.status === 'current' && (
                        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                      )}
                      {wp.status === 'upcoming' && (
                        <span className="material-symbols-outlined text-on-surface-variant text-[14px]">radio_button_unchecked</span>
                      )}
                      <span className={`font-label-code text-[10px] uppercase font-bold ${
                        wp.status === 'current' ? 'text-primary-container' : 'text-on-surface-variant'
                      }`}>
                        {wp.label}
                      </span>
                    </div>
                    <span className="font-body-sm text-xs text-on-surface font-medium truncate">{wp.name}</span>
                    <span className="font-label-telemetry text-[10px] text-on-surface-variant font-mono">{wp.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Dashcam Stream & CivicAgent Comms */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Live Dashcam Feed (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl bg-surface-container-low shadow-md p-4 flex flex-col gap-2 relative border border-surface-variant/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-label-code text-xs text-on-surface font-bold">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                  <span className="uppercase">CAM-F18 Forward Telemetry Stream</span>
                </div>
                <span className="font-label-telemetry text-xs text-secondary font-mono">30 FPS • 1080p</span>
              </div>
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface-container-lowest border border-surface-variant/30">
                <img
                  alt="Windshield dashcam stream"
                  className="w-full h-full object-cover opacity-85"
                  src={IMAGES.dashcamRoad}
                />
                <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between items-start">
                    <span className="font-label-code text-[10px] px-2 py-0.5 rounded bg-surface-container-lowest/80 text-primary-container backdrop-blur-sm border border-primary-container/30">
                      ROAD QUALITY INDEX: 71.4
                    </span>
                    <span className="font-label-code text-[10px] px-2 py-0.5 rounded bg-surface-container-lowest/80 text-secondary backdrop-blur-sm border border-secondary/30">
                      EDGE NEURAL DETECT: ON
                    </span>
                  </div>
                  <div className="self-center p-2 rounded-xl bg-surface-container-lowest/80 backdrop-blur-sm text-center border border-surface-variant/40">
                    <span className="font-label-code text-[10px] text-on-surface uppercase block font-semibold">
                      Approaching Overhead VMS Signal
                    </span>
                    <span className="font-label-telemetry text-xs text-primary-fixed-dim font-bold">
                      "ROAD WORK AHEAD KM 32 — MERGE LEFT"
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Dispatcher CivicAgent Terminal (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-surface-container-low shadow-md p-4 flex flex-col justify-between gap-3 border border-surface-variant/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-label-code text-xs text-secondary uppercase font-bold">
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  <span>CivicAgent Dispatchex</span>
                </div>
                <span className="font-label-code text-[10px] text-on-surface-variant">AUTO-TRANSCRIPT</span>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto max-h-40 font-body-sm text-xs pr-1 scrollbar-none">
                {commsFeed.map((item, i) => (
                  <div key={i} className="p-2 rounded-xl bg-surface-container border border-surface-variant/30 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between font-label-code text-[10px] text-secondary">
                      <span className="font-bold">{item.sender}</span>
                      <span className="text-on-surface-variant font-mono">{item.time}</span>
                    </div>
                    <span className="text-on-surface text-[11px] leading-tight">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={commsInput}
                  onChange={(e) => setCommsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendComms();
                  }}
                  placeholder="Transmit crew audio/text ping..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-container text-on-surface placeholder:text-on-surface-variant font-body-sm text-xs focus:outline-none border border-surface-variant/40"
                />
                <button
                  onClick={handleSendComms}
                  className="p-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary-fixed transition-colors shrink-0 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
