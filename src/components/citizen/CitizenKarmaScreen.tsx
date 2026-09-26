import React, { useState } from 'react';
import { TicketSummary } from '../../types';
import { IMAGES } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

interface CitizenKarmaScreenProps {
  ticket: TicketSummary;
  onViewOnGIS: () => void;
  onBackToReport: () => void;
}

export const CitizenKarmaScreen: React.FC<CitizenKarmaScreenProps> = ({
  ticket,
  onViewOnGIS,
  onBackToReport
}) => {
  const { profile, submitReviewInCloud, user } = useAuth();
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Smooth Finish', 'Fast Response']);
  const [submittedReview, setSubmittedReview] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [dismissToast, setDismissToast] = useState(false);

  const tags = ['Smooth Finish', 'Fast Response', 'Clean Worksite', 'Clear Lane Markings'];

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitReview = async () => {
    setSubmittedReview(true);
    if (user) {
      await submitReviewInCloud(ticket.id, rating, selectedTags);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `GST Road KM 32.4 Pothole Resolved via UrbanFlow AI`,
          text: `Reported and resolved in 1h 14m! Safeguarded 1,420 daily commuters. #UrbanFlowAI #CivicTech`,
          url: window.location.href
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Reported & resolved in 1h 14m on UrbanFlow AI. Pothole repaired at GST Road KM 32.4! Proof Hash: ${ticket.proofHash}`
      );
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-24 gap-4 max-w-lg mx-auto text-on-surface">
      {/* Toast Notification Banner */}
      {!dismissToast && (
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-high border border-primary-container/40 shadow-xl p-3 flex items-start gap-3 transition-all animate-in fade-in slide-in-from-top-4">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-container via-secondary to-primary-container"></div>
          <div className="w-10 h-10 rounded-full bg-primary-container/15 flex items-center justify-center shrink-0 text-primary-container">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-label-code text-xs text-primary-container uppercase tracking-wider font-semibold">
                Official Dispatch
              </span>
              <span className="font-label-code text-[10px] text-on-surface-variant">Just now</span>
            </div>
            <p className="font-headline-sm text-sm text-primary font-semibold mt-0.5 leading-snug">
              Incident Resolved! PWD Taskforce #4
            </p>
            <p className="font-body-sm text-xs text-on-surface-variant truncate">
              GST Road KM 32.4 completed asphalt overhaul
            </p>
          </div>
          <button
            onClick={() => setDismissToast(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface shrink-0 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Hero Civic Karma Celebration Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest p-5 shadow-2xl border border-primary-container/30">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-3 top-3 opacity-20 pointer-events-none">
          <span className="material-symbols-outlined text-[80px] text-primary-container">military_tech</span>
        </div>
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/20 text-primary-container border border-primary-container/40">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            <span className="font-label-code text-xs tracking-wider uppercase font-bold">+50 Civic Karma</span>
          </div>
          <span className="font-label-code text-xs text-secondary tracking-widest uppercase font-semibold">
            Verified Impact
          </span>
        </div>
        <div className="relative z-10">
          <h2 className="font-headline-md text-2xl text-primary tracking-tight font-bold">Citizen Hero Upgrade</h2>
          <p className="font-body-md text-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[16px]">shield</span>
            <span>
              {profile?.level || 'Level 4 Guardian Citizen'} • <strong className="text-on-surface font-semibold">{profile?.karma || 820} Total Karma</strong>
            </span>
          </p>
        </div>

        {/* Impact & SLA Metrics */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 bg-surface-container-lowest/60 -mx-5 -mb-5 p-4 rounded-b-2xl border-t border-surface-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shrink-0 border border-surface-variant/40">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <div className="min-w-0">
              <div className="font-label-code text-[10px] uppercase text-on-surface-variant tracking-wider">
                Turnaround SLA
              </div>
              <div className="font-headline-sm text-xs text-primary font-bold truncate">
                1h 14m <span className="text-primary-container text-[11px] font-normal">(22h ahead)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0 border border-surface-variant/40">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
            <div className="min-w-0">
              <div className="font-label-code text-[10px] uppercase text-on-surface-variant tracking-wider">
                Protected Flow
              </div>
              <div className="font-headline-sm text-xs text-primary font-bold truncate">~1,420 Commuters / Day</div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Resolution Dossier */}
      <div className="rounded-2xl bg-surface-container-low p-4 shadow-lg space-y-4 border border-surface-variant/40">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-code text-xs text-secondary tracking-widest font-semibold">
                TICKET {ticket.code}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary-container font-label-code text-[10px] font-bold border border-primary-container/30">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                VERIFIED & CLOSED
              </span>
            </div>
            <h3 className="font-headline-sm text-lg text-primary mt-1 font-bold">GST Road KM 32.4</h3>
            <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[15px] text-secondary">pin_drop</span>
              Potheri Down-Ramp (Lane 2 Northbound)
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary-container shrink-0 border border-surface-variant/40">
            <span className="material-symbols-outlined text-[22px]">verified_user</span>
          </div>
        </div>

        {/* Before & After Visual Inspection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-xs text-on-surface-variant uppercase tracking-wider">
              Autonomous Telemetry Proof
            </span>
            <span className="font-label-code text-[10px] text-primary-container flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">center_focus_strong</span>
              LiDAR Synchronized
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Before */}
            <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest flex flex-col group border border-surface-variant/40">
              <div className="relative aspect-video w-full overflow-hidden bg-surface-container-high">
                <img
                  alt="Pothole Before Repair"
                  className="w-full h-full object-cover"
                  src={IMAGES.potholeBefore}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-error-container/80 text-on-error font-label-code text-[9px] uppercase tracking-wider font-semibold">
                  Before • 07:19 AM
                </div>
                <div className="absolute bottom-2 left-2 right-2 px-1.5 py-1 rounded bg-surface-container-lowest/80 backdrop-blur-sm border border-surface-variant/40">
                  <span className="font-label-code text-[9px] text-error flex items-center justify-between font-bold">
                    <span>CRATER: 14CM</span>
                    <span>94.2% AI CONF</span>
                  </span>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest flex flex-col group border border-primary-container/40 shadow-[0_0_12px_rgba(0,255,157,0.15)]">
              <div className="relative aspect-video w-full overflow-hidden bg-surface-container-high">
                <img
                  alt="Asphalt After Repair"
                  className="w-full h-full object-cover"
                  src={IMAGES.potholeRepaired}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container font-label-code text-[9px] uppercase tracking-wider font-bold">
                  After • 08:33 AM
                </div>
                <div className="absolute bottom-2 left-2 right-2 px-1.5 py-1 rounded bg-surface-container-lowest/80 backdrop-blur-sm border border-primary-container/30">
                  <span className="font-label-code text-[9px] text-primary-container flex items-center justify-between font-bold">
                    <span>VAR &lt;0.2CM</span>
                    <span>98.7% DENSE</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Crew & Sensor Verification Badge */}
        <div className="p-3 rounded-xl bg-surface-container space-y-2 border border-surface-variant/40">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">commute</span>
              <span className="font-body-md text-xs text-on-surface truncate font-semibold">
                Tata Prima T-18 • Lead Off. R. Sundaram
              </span>
            </div>
            <span className="font-label-code text-[11px] text-secondary font-bold shrink-0">PWD HWY-4</span>
          </div>
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="material-symbols-outlined text-[16px] text-primary-container">sensors</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant">
              Validated by CivicAgent AI & LoRa Dynamic Road Deflectometer
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Citizen Quality Audit */}
      <div className="rounded-2xl bg-surface-container-low p-4 shadow-lg space-y-3.5 border border-surface-variant/40">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-headline-sm text-base text-primary font-bold">Citizen Quality Audit</h4>
            <p className="font-body-sm text-xs text-on-surface-variant">Confirm lane smoothness for final municipal sign-off</p>
          </div>
          <span className="font-label-code text-[10px] text-secondary uppercase bg-secondary-container/20 px-2 py-0.5 rounded border border-secondary/30">
            Optional
          </span>
        </div>

        {/* 5 Star Interactive Rating */}
        <div className="flex items-center justify-center gap-2.5 py-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="w-12 h-12 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary-container transition-transform active:scale-90 border border-surface-variant/30"
            >
              <span className="material-symbols-outlined text-[26px]">
                {star <= rating ? 'star' : 'star_border'}
              </span>
            </button>
          ))}
        </div>

        {/* Feedback Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleToggleTag(tag)}
                className={`h-10 px-3.5 rounded-full font-body-sm text-xs flex items-center gap-1.5 transition-all active:scale-95 border ${
                  isSelected
                    ? 'bg-primary-container/20 border-primary-container text-primary-container font-semibold'
                    : 'bg-surface-container border-surface-variant/40 text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isSelected ? 'check_circle' : 'add_circle'}
                </span>
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        {/* Submit Review Action */}
        <button
          onClick={handleSubmitReview}
          disabled={submittedReview}
          className={`w-full h-12 rounded-xl font-headline-sm text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
            submittedReview
              ? 'bg-surface-container-high text-primary-container border border-primary-container/40'
              : 'bg-primary-container text-on-primary-container hover:brightness-105 shadow-[0_0_16px_rgba(0,255,157,0.35)]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {submittedReview ? 'verified' : 'thumb_up'}
          </span>
          <span>{submittedReview ? 'Review Anchored to Ledger • +10 Karma!' : 'Confirm Road Clearance & Submit Review'}</span>
        </button>
      </div>

      {/* Civic Blockchain / Ledger Proof Box */}
      <div className="rounded-2xl bg-surface-container-lowest p-4 shadow space-y-3 border border-surface-variant/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary-container">lock</span>
            <span className="font-label-code text-xs text-on-surface font-semibold uppercase tracking-wider">
              Tamper-Proof Ledger Certificate
            </span>
          </div>
          <span className="font-label-code text-[10px] text-primary-container font-bold bg-primary-container/10 px-2 py-0.5 rounded border border-primary-container/30">
            L1 VALIDATED
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-surface-container-low font-label-code text-[11px] text-on-surface-variant flex flex-col gap-1 border border-surface-variant/30">
          <div className="flex items-center justify-between">
            <span>TRANSACTION HASH</span>
            <span className="text-primary font-mono select-all">{ticket.proofHash}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>BLOCK / TIMESTAMP</span>
            <span className="text-on-surface">#18,294,011 • 14:38:21 UTC</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleShare}
            className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">share</span>
            <span>{shareToast ? 'Link Copied!' : 'Share Impact'}</span>
          </button>
          <button
            onClick={onViewOnGIS}
            className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[18px] text-primary-container">map</span>
            <span>View on GIS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
