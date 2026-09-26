import React, { useState } from 'react';
import { OpsNavTab, TicketSummary } from '../../types';
import { IMAGES } from '../../data/mockData';
import { GisMap } from './GisMap';

interface CityOpsDashboardProps {
  tickets: TicketSummary[];
  activeNavTab: OpsNavTab;
  onSelectNavTab: (tab: OpsNavTab) => void;
  onOpenVisionModal: (ticket: TicketSummary) => void;
  onOpenNotifyModal: (ticket: TicketSummary) => void;
  onNavigateToTruckCorridor: () => void;
  onMarkResolved: (ticketId: string) => void;
}

export const CityOpsDashboard: React.FC<CityOpsDashboardProps> = ({
  tickets,
  activeNavTab,
  onSelectNavTab,
  onOpenVisionModal,
  onOpenNotifyModal,
  onNavigateToTruckCorridor,
  onMarkResolved
}) => {
  const [selectedDept, setSelectedDept] = useState('pwd');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'p1' | 'p2' | 'p3'>('p1');
  const [activeMapLayer, setActiveMapLayer] = useState<'heatmap' | 'crews' | 'potholes' | 'elevators'>('heatmap');
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || 't-1042');

  const featuredTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  return (
    <div className="flex flex-col w-full gap-5 pb-16 text-on-surface">
      {/* 1. Top Command Summary Bar */}
      <section className="bg-surface-container-low rounded-2xl p-4 shadow-xl border border-surface-variant/40 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface border border-surface-variant/40">
              <span className="h-2 w-2 rounded-full bg-primary-container animate-pulse"></span>
              <span className="font-label-code text-[11px] text-primary-fixed uppercase tracking-wider font-semibold">
                SEC-04 SOUTH CORRIDOR
              </span>
            </span>
            <span className="font-headline-sm text-base sm:text-lg text-primary font-bold">
              Greater Chennai & Kanchipuram Sub-Nodes
            </span>
            <span className="font-label-telemetry text-xs text-secondary font-bold font-mono">● LIVE MATRIX</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap text-xs font-body-sm text-on-surface-variant">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-secondary">sensors</span>
              <span className="font-label-code text-on-surface">1,420 Nodes</span>
              <span className="text-on-surface-variant">(LoRaWAN / 5G SA)</span>
            </div>
            <div className="h-3 w-px bg-surface-variant"></div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary-container">neurology</span>
              <span className="font-label-code text-primary-fixed">AI Swarm ONLINE</span>
              <span className="font-label-telemetry text-on-surface-variant font-mono">(38ms)</span>
            </div>
            <div className="h-3 w-px bg-surface-variant"></div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-secondary">shield_lock</span>
              <span className="font-label-code text-on-surface-variant uppercase">Sovereign Municipal Mode</span>
            </div>
          </div>
        </div>

        {/* Quick Filters HUD */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-surface-container rounded-xl px-3 py-1.5 shadow-sm border border-surface-variant/40">
            <span className="material-symbols-outlined text-on-surface-variant text-[16px] mr-1.5">apartment</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent font-body-sm text-xs text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-surface-container-high text-on-surface">All Depts (6 Active)</option>
              <option value="pwd" className="bg-surface-container-high text-on-surface">PWD Roadways</option>
              <option value="tneb" className="bg-surface-container-high text-on-surface">TNEB Power & Lighting</option>
              <option value="transit" className="bg-surface-container-high text-on-surface">Metro & Suburban Transit</option>
              <option value="sanitation" className="bg-surface-container-high text-on-surface">GCC Sanitation</option>
              <option value="water" className="bg-surface-container-high text-on-surface">CMWSSB Water Board</option>
            </select>
          </div>

          <div className="flex items-center bg-surface-container rounded-xl p-0.5 shadow-sm border border-surface-variant/40">
            <button
              onClick={() => setSelectedPriority('p1')}
              className={`px-2.5 py-1 rounded-lg font-label-code text-[11px] font-bold transition-all ${
                selectedPriority === 'p1' ? 'bg-error-container text-on-error' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              P1 Critical
            </button>
            <button
              onClick={() => setSelectedPriority('p2')}
              className={`px-2.5 py-1 rounded-lg font-label-code text-[11px] font-bold transition-all ${
                selectedPriority === 'p2' ? 'bg-secondary text-surface' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              P2 High
            </button>
            <button
              onClick={() => setSelectedPriority('p3')}
              className={`px-2.5 py-1 rounded-lg font-label-code text-[11px] font-bold transition-all ${
                selectedPriority === 'p3' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              P3
            </button>
          </div>

          <div className="flex items-center bg-surface-container-high text-secondary px-3 py-1.5 rounded-xl font-label-telemetry text-xs gap-1 border border-surface-variant/40 font-mono">
            <span className="material-symbols-outlined text-[15px]">timer</span>
            <span>24H LIVE STREAM</span>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics & Telemetry KPI Row */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {/* KPI 1 */}
        <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between border border-surface-variant/40">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-secondary via-primary-container to-transparent"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-code text-[11px] uppercase tracking-wider text-on-surface-variant">Active Incidents</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">stream</span>
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold">127</span>
            <span className="font-label-code text-xs text-secondary font-semibold">+14 Today</span>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>62% Vision AI Ingest</span>
            <svg className="w-16 h-5 text-secondary" viewBox="0 0 60 20" fill="none">
              <path d="M1 15 L12 12 L24 16 L36 6 L48 9 L59 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between border border-surface-variant/40">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-secondary"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-code text-[11px] uppercase tracking-wider text-on-surface-variant">Deployed Crews</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">engineering</span>
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold">21</span>
            <span className="font-label-code text-xs text-primary-fixed font-semibold">9 Rapid-patch</span>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>6 Electrical • 6 Drain</span>
            <span className="h-2 w-2 rounded-full bg-primary-container"></span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between border border-surface-variant/40">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary-container"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-code text-[11px] uppercase tracking-wider text-on-surface-variant">Resolved Today</span>
            <span className="material-symbols-outlined text-primary-container text-[18px]">task_alt</span>
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold">74</span>
            <span className="font-label-code text-xs text-primary-fixed font-semibold">+12% Velocity</span>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>Avg SLA: 18.4 hrs</span>
            <svg className="w-16 h-5 text-primary-container" viewBox="0 0 60 20" fill="none">
              <path d="M1 18 L15 14 L30 10 L45 8 L59 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between border border-surface-variant/40">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-error"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-code text-[11px] uppercase tracking-wider text-error font-bold">Critical P1 SLAs</span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-headline-lg text-2xl sm:text-3xl text-error font-bold">8</span>
            <span className="font-label-code text-xs text-on-surface-variant">0 Breached</span>
          </div>
          <div className="flex items-center justify-between text-xs text-error font-semibold">
            <span>2 &lt; 1hr Window</span>
            <span className="font-label-code text-[10px] bg-error-container text-on-error px-1.5 py-0.5 rounded">
              VIGILANT
            </span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between border border-surface-variant/40 col-span-2 md:col-span-1">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-secondary-container"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-code text-[11px] uppercase tracking-wider text-on-surface-variant">Accessibility Uptime</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">accessible</span>
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold">99.4%</span>
            <span className="font-label-code text-xs text-secondary font-semibold">48/48 Lifts</span>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>122 Low-Floor EV Shuttles</span>
            <span className="font-label-telemetry text-[10px] text-primary-fixed font-bold font-mono">NOMINAL</span>
          </div>
        </div>
      </section>

      {/* 3. Main Interactive Grid (7 cols / 5 cols split) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          {/* Live GIS Spatial Matrix */}
          <div className="bg-surface-container-low rounded-2xl shadow-xl overflow-hidden flex flex-col border border-surface-variant/40">
            {/* Map Header Toolbar */}
            <div className="p-3.5 sm:p-4 bg-surface-container flex flex-wrap items-center justify-between gap-3 border-b border-surface-variant/40">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[22px]">explore</span>
                <div>
                  <h2 className="font-headline-sm text-sm sm:text-base text-primary font-bold leading-tight">
                    Live Operations GIS Matrix
                  </h2>
                  <p className="font-label-code text-[11px] text-on-surface-variant font-mono">
                    SRM KTR NODE ⇄ GST ROAD CORRIDOR ⇄ GUINDY
                  </p>
                </div>
              </div>

              {/* Tactical Map Layer Selectors */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setActiveMapLayer('heatmap')}
                  className={`px-2.5 py-1 rounded-lg font-label-code text-[11px] flex items-center gap-1 transition-all ${
                    activeMapLayer === 'heatmap'
                      ? 'bg-secondary/20 text-secondary border border-secondary/40 font-bold'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">layers</span> Heatmap
                </button>
                <button
                  onClick={() => setActiveMapLayer('crews')}
                  className={`px-2.5 py-1 rounded-lg font-label-code text-[11px] flex items-center gap-1 transition-all ${
                    activeMapLayer === 'crews'
                      ? 'bg-secondary/20 text-secondary border border-secondary/40 font-bold'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span> Crews GPS
                </button>
                <button
                  onClick={() => setActiveMapLayer('potholes')}
                  className={`px-2.5 py-1 rounded-lg font-label-code text-[11px] flex items-center gap-1 transition-all ${
                    activeMapLayer === 'potholes'
                      ? 'bg-secondary/20 text-secondary border border-secondary/40 font-bold'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">report_problem</span> Potholes
                </button>
                <button
                  onClick={() => setActiveMapLayer('elevators')}
                  className={`px-2.5 py-1 rounded-lg font-label-code text-[11px] flex items-center gap-1 transition-all ${
                    activeMapLayer === 'elevators'
                      ? 'bg-secondary/20 text-secondary border border-secondary/40 font-bold'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">elevator</span> Elevators
                </button>
              </div>
            </div>

            {/* Interactive Tactical GIS Map Canvas Component */}
            <div className="p-2 sm:p-3">
              <GisMap
                tickets={tickets}
                selectedTicketId={selectedTicketId}
                onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)}
                onOpenVisionModal={onOpenVisionModal}
                onOpenNotifyModal={onOpenNotifyModal}
                onNavigateToTruckCorridor={onNavigateToTruckCorridor}
                activeLayer={activeMapLayer}
                onLayerChange={setActiveMapLayer}
              />
            </div>

            {/* Map Footer Diagnostics */}
            <div className="p-3 bg-surface-container flex items-center justify-between text-xs text-on-surface-variant flex-wrap gap-2 border-t border-surface-variant/40">
              <div className="flex items-center gap-3 font-label-code text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-error"></span> P1 Critical (8)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-secondary"></span> P2 Dispatched (24)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary-container"></span> Resolved 24h (74)
                </span>
              </div>
              <span className="font-label-telemetry text-[11px] text-on-surface-variant font-mono">
                Last AI Sensor Sweep: 8s ago
              </span>
            </div>
          </div>

          {/* Municipal Performance & SLA Chart */}
          <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4 border border-surface-variant/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">bar_chart</span>
                <h3 className="font-headline-sm text-sm sm:text-base text-primary font-bold">
                  Municipal Dept Resolution SLA & Velocity
                </h3>
              </div>
              <span className="font-label-code text-[11px] text-primary-fixed bg-surface-container px-2.5 py-1 rounded-lg border border-primary-container/30">
                Avg Efficiency: +18.4%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Horizontal SLA Bars */}
              <div className="flex flex-col gap-2.5">
                <span className="font-label-code text-xs uppercase text-on-surface-variant tracking-wider">
                  Target vs Actual Compliance
                </span>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-primary font-medium">PWD Highways & Roadways</span>
                    <span className="font-label-telemetry text-primary-fixed font-bold font-mono">94% Compliant</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-primary font-medium">Greater Chennai Corp (GCC)</span>
                    <span className="font-label-telemetry text-primary-fixed font-bold font-mono">98% Compliant</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-primary font-medium">TNEB Electrical Grid</span>
                    <span className="font-label-telemetry text-secondary font-bold font-mono">91% Compliant</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-primary font-medium">MTC Transit & Lifts</span>
                    <span className="font-label-telemetry text-primary-fixed font-bold font-mono">99% Compliant</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full bg-primary-fixed rounded-full" style={{ width: '99%' }}></div>
                  </div>
                </div>
              </div>

              {/* Weekly Velocity Histogram */}
              <div className="flex flex-col justify-between bg-surface-container p-3 rounded-xl border border-surface-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-code text-xs text-on-surface-variant uppercase">Weekly Velocity</span>
                  <span className="font-label-telemetry text-xs text-secondary font-mono">Total: 782</span>
                </div>

                <div className="h-28 w-full flex items-end justify-between pt-4 px-2">
                  {[
                    { day: 'MON', h: 48, active: false },
                    { day: 'TUE', h: 64, active: false },
                    { day: 'WED', h: 52, active: false },
                    { day: 'THU', h: 80, active: false },
                    { day: 'FRI', h: 96, active: true },
                    { day: 'SAT', h: 40, active: false },
                    { day: 'SUN', h: 30, active: false }
                  ].map((bar) => (
                    <div key={bar.day} className="flex flex-col items-center gap-1 w-8">
                      <div
                        className={`w-full rounded-t transition-all ${
                          bar.active
                            ? 'bg-secondary shadow-[0_0_12px_rgba(76,215,246,0.35)]'
                            : 'bg-surface-container-high hover:bg-secondary/60'
                        }`}
                        style={{ height: `${bar.h}px` }}
                      ></div>
                      <span className={`font-label-code text-[10px] ${bar.active ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-variant/30">
                  <span>Peak: Friday (Rain Surge)</span>
                  <span className="text-primary-fixed font-label-code text-xs font-semibold">Resolved: 92.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-5">
          {/* Autonomous AI Triage Queue */}
          <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4 border border-surface-variant/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[20px]">smart_toy</span>
                <h3 className="font-headline-sm text-sm sm:text-base text-primary font-bold">
                  Autonomous AI Triage
                </h3>
              </div>
              <span className="font-label-code text-xs px-2.5 py-0.5 rounded-full bg-surface-container-high text-secondary border border-surface-variant/40">
                4 Queued Items
              </span>
            </div>

            {/* Featured Focus Card: #UF-2026-1042 */}
            <div className="relative bg-surface-container-high rounded-2xl p-4 shadow-2xl flex flex-col gap-3 overflow-hidden border border-primary-container/30">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-error via-secondary to-primary-container"></div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-code text-[10px] font-bold text-error bg-error-container/30 px-1.5 py-0.5 rounded border border-error/30">
                      {featuredTicket.priority}
                    </span>
                    <span className="font-label-telemetry text-xs text-on-surface font-mono font-semibold">
                      {featuredTicket.code}
                    </span>
                  </div>
                  <span className="font-headline-sm text-sm sm:text-base text-primary mt-1 font-bold">
                    {featuredTicket.title}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-label-telemetry text-xs text-primary-fixed font-bold font-mono">
                    {featuredTicket.confidence}% AI CONFIRMED
                  </span>
                  <span className="font-label-code text-[10px] text-on-surface-variant">Citizen Vision Ingest</span>
                </div>
              </div>

              {/* Camera Image Preview (Clickable to open Vision modal) */}
              <div
                onClick={() => onOpenVisionModal(featuredTicket)}
                className="relative w-full h-36 rounded-xl overflow-hidden bg-surface-container-lowest my-0.5 cursor-pointer group/img border border-surface-variant/40"
              >
                <img
                  alt="Asphalt crater scan"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                  src={IMAGES.potholeNightCyber}
                />
                <div className="absolute inset-0 bg-surface/30 flex items-center justify-center p-3">
                  <div className="w-40 h-24 rounded-lg border-2 border-primary-container/80 bg-primary-container/10 flex flex-col justify-between p-1.5 shadow-[0_0_12px_rgba(0,255,157,0.3)]">
                    <span className="font-label-code text-[10px] bg-primary-container text-on-primary-container px-1 py-0.2 rounded font-bold self-start">
                      POTHOLE: 14CM DEPTH
                    </span>
                    <span className="font-label-telemetry text-[9px] text-primary-fixed self-end font-mono">
                      LOC: KM 32.4
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-surface-container-lowest/80 backdrop-blur-sm px-2 py-0.5 rounded font-label-telemetry text-[10px] text-secondary font-mono border border-surface-variant/40">
                  GPS: 12.8231° N, 80.0452° E
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="px-2.5 py-1 rounded-lg bg-secondary text-surface font-label-code text-[11px] font-bold flex items-center gap-1 shadow-lg">
                    <span className="material-symbols-outlined text-[15px]">zoom_in</span> CLICK TO INSPECT HUD
                  </span>
                </div>
              </div>

              {/* Incident Details */}
              <div className="flex flex-col gap-1 text-xs text-on-surface-variant">
                <div className="flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                  <span className="truncate">{featuredTicket.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary-container">local_shipping</span>
                  <span className="text-on-surface">Assigned: {featuredTicket.assignedCrew} ({featuredTicket.assignedVehicle})</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-primary-fixed flex items-center gap-1 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-primary-container animate-ping"></span> Crew En Route (ETA 34 mins)
                  </span>
                  <span className="font-label-code text-on-surface-variant font-mono">
                    SLA: {featuredTicket.slaRemaining}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onOpenVisionModal(featuredTicket)}
                  className="px-3 py-2 rounded-xl bg-primary-container text-on-primary-container font-label-code text-xs font-bold hover:shadow-[0_0_16px_rgba(0,255,157,0.4)] transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span> Inspect Vision AI
                </button>
                <button
                  onClick={onNavigateToTruckCorridor}
                  className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-bright text-on-surface font-label-code text-xs transition-colors flex items-center justify-center gap-1 border border-surface-variant/40"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">local_shipping</span> Track Fleet Unit
                </button>
                <button
                  onClick={() => onOpenNotifyModal(featuredTicket)}
                  className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-bright text-secondary font-label-code text-xs transition-colors flex items-center justify-center gap-1 border border-surface-variant/40"
                >
                  <span className="material-symbols-outlined text-[16px]">send_to_mobile</span> Notify Citizen
                </button>
                <button
                  onClick={() => onMarkResolved(featuredTicket.id)}
                  className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-bright text-primary-fixed font-label-code text-xs transition-colors flex items-center justify-center gap-1 border border-surface-variant/40"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> Mark Resolved
                </button>
              </div>
            </div>

            {/* Secondary Queue Items */}
            <div className="flex flex-col gap-2">
              {tickets.filter((t) => t.id !== featuredTicket.id).map((ticketItem) => (
                <div
                  key={ticketItem.id}
                  onClick={() => setSelectedTicketId(ticketItem.id)}
                  className="bg-surface-container p-3 rounded-xl flex items-center justify-between hover:bg-surface-container-high transition-colors cursor-pointer border border-surface-variant/30 group"
                  title="Click to focus on GIS Map and details"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-1.5 h-8 rounded-full bg-secondary"></div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-label-telemetry text-xs text-on-surface font-semibold font-mono">
                          {ticketItem.code}
                        </span>
                        <span className="font-label-code text-[9px] text-secondary bg-surface-container-highest px-1.5 py-0.2 rounded font-bold">
                          {ticketItem.priority}
                        </span>
                      </div>
                      <span className="font-body-sm text-xs text-on-surface-variant truncate w-48 sm:w-56 group-hover:text-primary transition-colors">
                        {ticketItem.title}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-label-code text-xs text-on-surface">{ticketItem.assignedCrew}</span>
                    <p className="font-label-telemetry text-[11px] text-primary-fixed font-mono">
                      {ticketItem.status === 'ASSIGNED' ? 'Diagnosing' : 'On-site'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Swarm Telemetry Log (Terminal Style) */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xl flex flex-col gap-2 font-label-code text-xs border border-surface-variant/40">
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-2">
              <div className="flex items-center gap-1.5 text-primary-fixed">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                <span className="font-bold tracking-wider">SWARM ORCHESTRATOR TELEMETRY</span>
              </div>
              <span className="text-[10px] text-on-surface-variant animate-pulse">STREAM ACTIVE</span>
            </div>
            <div className="flex flex-col gap-2 pt-1 font-label-telemetry text-xs leading-relaxed max-h-56 overflow-y-auto font-mono scrollbar-none">
              <div className="text-on-surface-variant flex gap-2">
                <span className="text-secondary select-none">07:20:44</span>
                <span>
                  <strong className="text-primary-fixed">[CivicAgent]</strong> PWD Taskforce #4 acknowledged dispatch ticket. Cold-patch unit mobilized.
                </span>
              </div>
              <div className="text-on-surface-variant flex gap-2">
                <span className="text-secondary select-none">07:19:12</span>
                <span>
                  <strong className="text-secondary">[AccessibilityAgent]</strong> Audited Tambaram Platform 1 elevator; step-free clearance verified 100%.
                </span>
              </div>
              <div className="text-on-surface-variant flex gap-2">
                <span className="text-secondary select-none">07:19:05</span>
                <span>
                  <strong className="text-tertiary-fixed-dim">[MobilityAgent]</strong> Re-routed Suburban bus #105 to avoid GST Rd crater lane bottleneck.
                </span>
              </div>
              <div className="text-on-surface-variant flex gap-2">
                <span className="text-secondary select-none">07:19:02</span>
                <span>
                  <strong className="text-primary-container">[VisionAgent]</strong> Ingested user report via Vision AI; generated ticket{' '}
                  <span className="text-error font-bold font-mono">#UF-2026-1042</span> (Confidence: 94.2%).
                </span>
              </div>
              <div className="text-on-surface-variant flex gap-2 opacity-70">
                <span className="text-secondary select-none">07:18:41</span>
                <span>
                  <strong className="text-on-surface-variant">[SensorMesh]</strong> Node #KTR-92 ping response stable at 14ms over LoRa Gateway #3.
                </span>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between text-[11px] text-on-surface-variant border-t border-surface-variant/30">
              <div className="flex items-center gap-1 font-mono">
                <span className="text-primary-container font-bold">$</span>
                <span className="text-on-surface">agent-swarm --status --autonomous-mode</span>
              </div>
              <span className="text-primary-fixed bg-surface-container px-1 rounded font-mono font-bold">200 OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
