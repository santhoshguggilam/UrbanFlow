import React from 'react';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStep: (stepNumber: number) => void;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  onSelectStep
}) => {
  if (!isOpen) return null;

  const demoSteps = [
    {
      num: 1,
      title: 'Accessible Wayfinding (AI Core & Mobility)',
      badge: 'Zero-Barrier Routing',
      desc: 'Wheelchair passenger seeks step-free route from Tambaram to SRM KTR. Multi-agents coordinate elevator verification and low-floor shuttle.',
      icon: 'accessible_forward',
      color: 'text-primary-container',
      actionText: 'Launch Step 1'
    },
    {
      num: 2,
      title: 'Citizen Edge Vision Pothole Report',
      badge: 'Vision AI v3.1',
      desc: 'Edge neural camera scans 14cm road fracture on GST Road KM 32.4. Real-time bounding box and depth classification.',
      icon: 'photo_camera',
      color: 'text-secondary',
      actionText: 'Launch Step 2'
    },
    {
      num: 3,
      title: 'Autonomous Multi-Agent Triage (#UF-2026-1042)',
      badge: 'Auto-Triage Active',
      desc: 'Swarm classifies P1 Critical hazard, logs tamper-proof cryptographic ledger hash, and auto-dispatches PWD Taskforce #4.',
      icon: 'smart_toy',
      color: 'text-primary-fixed',
      actionText: 'Launch Step 3'
    },
    {
      num: 4,
      title: 'City Operations Command Center & GIS Matrix',
      badge: 'Ops Console',
      desc: 'Real-time municipal matrix, department SLA velocity histograms, and interactive forensic Vision AI HUD inspection.',
      icon: 'hub',
      color: 'text-secondary',
      actionText: 'Launch Step 4'
    },
    {
      num: 5,
      title: 'Field Fleet Unit Truck T-18 Corridor',
      badge: 'Tactical Unit #4',
      desc: 'Live dashcam video simulation, NavIC/LoRa telemetry, cold-patch payload, and turn-by-turn waypoint execution.',
      icon: 'local_shipping',
      color: 'text-primary-container',
      actionText: 'Launch Step 5'
    },
    {
      num: 6,
      title: 'On-Site Repair Quality Inspection Closeout',
      badge: 'Dual LiDAR Scan',
      desc: 'Post-repair forensic inspection with dual Before/After scan, surface variance <0.2cm verification, and officer digital signature.',
      icon: 'verified',
      color: 'text-primary-fixed',
      actionText: 'Launch Step 6'
    },
    {
      num: 7,
      title: 'Multi-Channel Citizen Alert & Hero Karma',
      badge: 'Citizen Karma +50',
      desc: 'Automated broadcast to 38 affected citizens (App Push, WhatsApp/RCS, Tamil/English IVR) and citizen 5-star quality review.',
      icon: 'auto_awesome',
      color: 'text-secondary',
      actionText: 'Launch Step 7'
    }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in text-on-surface"
    >
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-surface-container-low border border-secondary/40 shadow-2xl flex flex-col gap-4 p-5 sm:p-6 text-on-surface z-10">
        <div className="flex items-start justify-between border-b border-surface-variant/40 pb-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-secondary-container/20 text-secondary font-label-code text-[11px] uppercase font-bold flex items-center gap-1 border border-secondary/30">
                <span className="material-symbols-outlined text-[15px]">terminal</span>
                HACKATHON JUDGE DEMO MODE
              </span>
              <span className="font-label-code text-[10px] text-primary-container font-mono">
                AUTONOMOUS LOOP VERIFIED
              </span>
            </div>
            <h2 className="font-headline-md text-xl sm:text-2xl text-primary font-bold tracking-tight">
              UrbanFlow AI Scenario Walkthrough
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Click any milestone below to immediately jump to and experience that interactive screen in the end-to-end loop.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Demo Steps Grid */}
        <div className="flex flex-col gap-2.5">
          {demoSteps.map((step) => (
            <div
              key={step.num}
              onClick={() => {
                onSelectStep(step.num);
                onClose();
              }}
              className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-surface-variant/40 hover:border-secondary/50 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center shrink-0 border border-surface-variant/40 group-hover:scale-105 transition-transform">
                  <span className={`material-symbols-outlined text-[22px] ${step.color}`}>
                    {step.icon}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-xs sm:text-sm text-primary font-bold truncate">
                      {step.num}. {step.title}
                    </span>
                    <span className="font-label-code text-[9px] px-1.5 py-0.2 rounded bg-surface-container-highest text-secondary font-bold shrink-0">
                      {step.badge}
                    </span>
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant leading-snug mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1 font-label-code text-xs text-secondary group-hover:text-primary-container font-bold">
                <span className="hidden sm:inline">{step.actionText}</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs font-label-code text-on-surface-variant pt-2 border-t border-surface-variant/40">
          <span>Sovereign Municipal AI Mesh</span>
          <span className="text-primary-container font-mono">100% Interconnected Architecture</span>
        </div>
      </div>
    </div>
  );
};
