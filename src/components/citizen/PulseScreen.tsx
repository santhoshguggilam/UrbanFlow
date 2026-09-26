import React from 'react';
import { TicketSummary } from '../../types';

interface PulseScreenProps {
  onNavigateTab: (tab: 'ai-core' | 'mobility' | 'report') => void;
  onTrackTicket: (code: string) => void;
  tickets: TicketSummary[];
}

export const PulseScreen: React.FC<PulseScreenProps> = ({
  onNavigateTab,
  onTrackTicket,
  tickets
}) => {
  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-24 gap-4 max-w-lg mx-auto text-on-surface">
      {/* Top Pulse Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest p-4 relative overflow-hidden border border-primary-container/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container"></span>
            </span>
            <span className="font-headline-sm text-base text-primary font-bold">Chennai Metro Civic Pulse</span>
          </div>
          <span className="font-label-code text-[10px] text-primary-container bg-primary-container/15 px-2 py-0.5 rounded-full font-bold border border-primary-container/30">
            99.8% HEALTH
          </span>
        </div>
        <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed">
          Kanchipuram & Chennai civic corridor mesh active. 1,420 IoT nodes streaming road telemetry, lift sensors, and autonomous dispatch telemetry.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="bg-surface-container-lowest/80 p-2 rounded-xl border border-surface-variant/30">
            <span className="font-label-code text-[9px] text-on-surface-variant uppercase">Active Transits</span>
            <p className="font-headline-sm text-sm text-primary font-bold">122 Units</p>
          </div>
          <div className="bg-surface-container-lowest/80 p-2 rounded-xl border border-surface-variant/30">
            <span className="font-label-code text-[9px] text-on-surface-variant uppercase">Lifts Verified</span>
            <p className="font-headline-sm text-sm text-primary-container font-bold">48 / 48</p>
          </div>
          <div className="bg-surface-container-lowest/80 p-2 rounded-xl border border-surface-variant/30">
            <span className="font-label-code text-[9px] text-on-surface-variant uppercase">Median SLA</span>
            <p className="font-headline-sm text-sm text-secondary font-bold">1h 14m</p>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onNavigateTab('mobility')}
          className="p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-surface-variant/40 flex flex-col justify-between text-left transition-all active:scale-95 group shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-container/20 text-primary-container flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px]">accessible_forward</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-xs text-primary font-bold">Transit Wayfinder</h3>
            <p className="font-body-sm text-[11px] text-on-surface-variant">Step-free accessible routes</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('report')}
          className="p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-surface-variant/40 flex flex-col justify-between text-left transition-all active:scale-95 group shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-xs text-primary font-bold">Report City Issue</h3>
            <p className="font-body-sm text-[11px] text-on-surface-variant">Vision AI auto-triage</p>
          </div>
        </button>
      </div>

      {/* Live Dispatched Cases List */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-sm text-primary font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-secondary">stream</span>
            Live Municipal Dispatch Feed
          </span>
          <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Real-Time</span>
        </div>

        {tickets.map((t) => (
          <div
            key={t.id}
            onClick={() => onTrackTicket(t.code)}
            className="p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-variant/40 flex flex-col gap-2 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-label-code text-xs text-error font-bold">{t.code}</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-label-code text-[9px] uppercase font-bold ${
                    t.priority.includes('CRITICAL')
                      ? 'bg-error-container text-on-error'
                      : 'bg-surface-container-highest text-secondary'
                  }`}
                >
                  {t.priority}
                </span>
              </div>
              <span className="font-label-telemetry text-[11px] text-primary-container font-semibold">
                {t.confidence}% AI Conf
              </span>
            </div>
            <div>
              <p className="font-body-md text-xs text-primary font-semibold truncate group-hover:text-primary-container transition-colors">
                {t.title}
              </p>
              <p className="font-body-sm text-[11px] text-on-surface-variant truncate mt-0.5">{t.location}</p>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-surface-variant/30 text-[10px] font-label-code text-on-surface-variant">
              <span>{t.assignedCrew}</span>
              <span className="text-secondary font-bold group-hover:underline flex items-center gap-0.5">
                Track Live GPS »
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
