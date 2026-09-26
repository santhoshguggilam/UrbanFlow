import React, { useState } from 'react';
import { TicketSummary } from '../../types';
import { IMAGES } from '../../data/mockData';

interface RepairInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketSummary;
  onApproveCloseout: () => void;
}

export const RepairInspectionModal: React.FC<RepairInspectionModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onApproveCloseout
}) => {
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApprove = () => {
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      setApproved(true);
      onApproveCloseout();
      setTimeout(() => {
        onClose();
        setApproved(false);
      }, 1000);
    }, 800);
  };

  const handlePdfExport = () => {
    setToastText('Audit Certificate PDF compiled (SHA-256 #0x3F88). Download initiated.');
    setTimeout(() => setToastText(null), 3500);
  };

  const handleDroneRescan = () => {
    setToastText('Survey Drone D-04 queued for aerial LIDAR depth validation.');
    setTimeout(() => setToastText(null), 3500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in text-on-surface"
    >
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-2xl flex flex-col gap-4 p-5 sm:p-6 text-on-surface z-10">
        {/* Header Ribbon */}
        <div className="flex items-start justify-between border-b border-outline-variant/40 pb-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary-container font-label-code text-[11px] uppercase font-bold flex items-center gap-1 border border-primary-container/30">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                AUTONOMOUS CLOSEOUT
              </span>
              <span className="font-label-telemetry text-xs text-secondary font-semibold font-mono">
                {ticket.code}
              </span>
              <span className="font-label-code text-[11px] text-on-surface-variant font-mono">
                LEDGER ENTRY #4092-A
              </span>
            </div>
            <h2 className="font-headline-md text-xl sm:text-2xl text-primary font-bold tracking-tight">
              Tactical Incident Closeout & AI Repair Inspection
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              GST Road KM 32.4 — Potheri Down-Ramp • Deployed Unit:{' '}
              <span className="text-secondary font-medium">Truck T-18 (Lead Off. R. Sundaram)</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Dual Visual Verification (Before vs After) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-[16px]">compare</span>
              Dual Optical & LIDAR Surface Verification
            </span>
            <span className="font-label-telemetry text-[11px] text-primary-fixed-dim font-medium font-mono">
              AI Ingestion & Edge Post-Scan Match
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Before */}
            <div className="relative rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/40 flex flex-col">
              <div className="p-2 bg-surface-container-high/90 flex items-center justify-between z-10 border-b border-surface-variant/30">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                  <span className="font-label-code text-[10px] text-error uppercase font-bold">
                    Before: Citizen & AI Ingestion
                  </span>
                </div>
                <span className="font-label-telemetry text-[10px] text-on-surface-variant font-mono">
                  06:58:12 UTC
                </span>
              </div>
              <div className="relative h-44 w-full bg-surface-container-lowest overflow-hidden flex items-center justify-center">
                <img
                  alt="Pothole Before Ingestion View"
                  className="w-full h-full object-cover opacity-85 filter brightness-90"
                  src={IMAGES.dashcamRoad}
                />
                <div className="absolute inset-4 border-2 border-dashed border-error/90 rounded-xl bg-error/10 flex flex-col justify-between p-2 pointer-events-none">
                  <span className="font-label-code text-[9px] bg-error-container text-on-error px-1.5 py-0.5 rounded uppercase font-bold self-start">
                    HAZARD: 94.2% • CRATER DEPTH: 14.1cm
                  </span>
                  <span className="font-label-telemetry text-[9px] text-error self-end font-semibold font-mono">
                    VOL: 0.18 m³ • LANE 2 MEDIAN
                  </span>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="relative rounded-xl overflow-hidden bg-surface-container-lowest border border-primary-container/40 flex flex-col shadow-[0_0_16px_rgba(0,255,157,0.15)]">
              <div className="p-2 bg-surface-container-high/90 flex items-center justify-between z-10 border-b border-surface-variant/30">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                  <span className="font-label-code text-[10px] text-primary-container uppercase font-bold">
                    After: On-Site Post-Repair Scan
                  </span>
                </div>
                <span className="font-label-telemetry text-[10px] text-primary-fixed-dim font-mono">
                  07:51:30 UTC
                </span>
              </div>
              <div className="relative h-44 w-full bg-surface-container-lowest overflow-hidden flex items-center justify-center">
                <img
                  alt="Completed Repair Verification Scan"
                  className="w-full h-full object-cover opacity-90 filter contrast-105"
                  src={IMAGES.truckFront}
                />
                <div className="absolute inset-4 border border-primary-container/90 rounded-xl bg-primary-container/10 flex flex-col justify-between p-2 pointer-events-none">
                  <div className="flex justify-between items-center">
                    <span className="font-label-code text-[9px] bg-primary-container text-on-primary-container px-1.5 py-0.5 rounded uppercase font-bold">
                      AI GRADE CONFIRMED: PASS
                    </span>
                    <span className="font-label-telemetry text-[9px] text-primary-fixed-dim font-bold font-mono">
                      VAR: &lt;0.2cm
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface-container-lowest/80 text-[9px] font-label-code text-primary-container border border-primary-container/30">
                    SURFACE GRADE VARIANCE: &lt;0.2cm • COMPACTION DENSITY: 98.7% NOMINAL • STRUCTURAL DEFECTS: 0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Repair Telemetry & Diagnostics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-surface-container border border-surface-variant/30">
          <div className="p-2 rounded-lg bg-surface-container-high flex flex-col gap-0.5">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Material Injected</span>
            <span className="font-headline-sm text-sm text-primary font-bold">185 kg</span>
            <span className="font-label-telemetry text-[10px] text-primary-container">Cold-Patch Polymer</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-container-high flex flex-col gap-0.5">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Compaction Passes</span>
            <span className="font-headline-sm text-sm text-secondary font-bold">6 Cycles</span>
            <span className="font-label-telemetry text-[10px] text-on-surface-variant">Hydraulic Vibratory</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-container-high flex flex-col gap-0.5">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Surface Seal Temp</span>
            <span className="font-headline-sm text-sm text-primary-container font-bold">142°C</span>
            <span className="font-label-telemetry text-[10px] text-on-surface-variant">IR Heat Sensor Pass</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-container-high flex flex-col gap-0.5">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Reopening Status</span>
            <span className="font-headline-sm text-sm text-primary-fixed-dim font-bold">60 km/h</span>
            <span className="font-label-telemetry text-[10px] text-secondary">Unrestricted Flow</span>
          </div>
        </div>

        {/* Cryptographic Audit & Sign-Off */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-surface-container border border-surface-variant/30">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-high">
            <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container shrink-0">
              <span className="material-symbols-outlined text-[20px]">draw</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-body-sm font-semibold text-xs text-on-surface truncate">
                  Off. R. Sundaram (PWD-7721)
                </span>
                <span className="material-symbols-outlined text-primary-container text-[14px]">verified</span>
              </div>
              <span className="font-label-code text-[10px] text-on-surface-variant">
                Digitally Signed via Mobile MDT • 07:52 UTC
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-high">
            <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-body-sm font-semibold text-xs text-secondary">
                  CivicAgent v4.8 Autonomous Audit
                </span>
                <span className="font-label-code text-[9px] px-1 py-0.2 rounded bg-primary-container/20 text-primary-container font-bold">
                  PASSED
                </span>
              </div>
              <span className="font-label-telemetry text-[10px] text-on-surface-variant truncate font-mono">
                Score: 99.1% • Hash: 0x3F88...E19A2026
              </span>
            </div>
          </div>
        </div>

        {/* Status Toast Notification */}
        {toastText && (
          <div className="p-2.5 rounded-xl bg-surface-container-high border border-primary-container/50 text-xs font-label-code text-primary-container flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>{toastText}</span>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-outline-variant/40">
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={handlePdfExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface transition-all font-label-code text-xs border border-surface-variant/40"
            >
              <span className="material-symbols-outlined text-secondary text-[16px]">picture_as_pdf</span>
              <span>Audit Cert (PDF)</span>
            </button>
            <button
              onClick={handleDroneRescan}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface transition-all font-label-code text-xs border border-surface-variant/40"
            >
              <span className="material-symbols-outlined text-secondary text-[16px]">flight</span>
              <span>Drone Re-scan</span>
            </button>
          </div>

          <button
            onClick={handleApprove}
            disabled={approving || approved}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-label-code text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_16px_rgba(0,255,157,0.35)] ${
              approved
                ? 'bg-surface-container-high text-primary-container border border-primary-container'
                : 'bg-primary-container text-on-primary-container hover:bg-primary-fixed hover:brightness-105'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${approving ? 'animate-spin' : ''}`}>
              {approving ? 'sync' : approved ? 'task_alt' : 'verified'}
            </span>
            <span>{approving ? 'Broadcasting...' : approved ? 'Approved & Lane Cleared' : 'Approve Quality Inspection & Broadcast Lane Clearance'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
