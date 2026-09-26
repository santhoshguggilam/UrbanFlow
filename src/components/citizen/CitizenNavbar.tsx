import React from 'react';
import { CitizenTab } from '../../types';

interface CitizenNavbarProps {
  activeTab: CitizenTab;
  onSelectTab: (tab: CitizenTab) => void;
  onOpenOps: () => void;
}

export const CitizenNavbar: React.FC<CitizenNavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenOps
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#0f131c]/90 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.65)] border-t border-surface-variant/30">
      <div className="flex items-center justify-around h-16 sm:h-20 px-2 max-w-lg mx-auto">
        {/* Pulse */}
        <button
          onClick={() => onSelectTab('pulse')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-14 sm:h-16 transition-all active:scale-95 ${
            activeTab === 'pulse'
              ? 'text-primary-container scale-105 drop-shadow-[0_0_10px_rgba(0,255,157,0.45)] font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
          <span className="font-label-code text-[10px] tracking-wider uppercase">Pulse</span>
        </button>

        {/* AI Core */}
        <button
          onClick={() => onSelectTab('ai-core')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-14 sm:h-16 transition-all active:scale-95 ${
            activeTab === 'ai-core'
              ? 'text-primary-container scale-105 drop-shadow-[0_0_10px_rgba(0,255,157,0.45)] font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">smart_toy</span>
          <span className="font-label-code text-[10px] tracking-wider uppercase">AI Core</span>
        </button>

        {/* Mobility */}
        <button
          onClick={() => onSelectTab('mobility')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-14 sm:h-16 transition-all active:scale-95 ${
            activeTab === 'mobility'
              ? 'text-primary-container scale-105 drop-shadow-[0_0_10px_rgba(0,255,157,0.45)] font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">alt_route</span>
          <span className="font-label-code text-[10px] tracking-wider uppercase">Mobility</span>
        </button>

        {/* Report */}
        <button
          onClick={() => onSelectTab('report')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-14 sm:h-16 transition-all active:scale-95 ${
            activeTab === 'report'
              ? 'text-primary-container scale-105 drop-shadow-[0_0_10px_rgba(0,255,157,0.45)] font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">document_scanner</span>
          <span className="font-label-code text-[10px] tracking-wider uppercase">Report</span>
        </button>

        {/* Ops Hub */}
        <button
          onClick={onOpenOps}
          className="flex flex-col items-center justify-center gap-1 w-16 h-14 sm:h-16 text-on-surface-variant hover:text-secondary transition-all active:scale-95 group"
          title="Open City Ops Hub"
        >
          <span className="material-symbols-outlined text-[24px] group-hover:text-secondary">hub</span>
          <span className="font-label-code text-[10px] tracking-wider uppercase group-hover:text-secondary">Ops Hub</span>
        </button>
      </div>
    </nav>
  );
};
