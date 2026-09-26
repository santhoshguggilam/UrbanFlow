import React, { useState } from 'react';
import { AppViewMode } from '../types';
import { IMAGES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  viewMode: AppViewMode;
  onToggleViewMode: (mode: AppViewMode) => void;
  onOpenJudgeDemo: () => void;
  onOpenAuth: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onToggleViewMode,
  onOpenJudgeDemo,
  onOpenAuth,
  unreadCount = 3
}) => {
  const { user, profile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0f131c]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] border-b border-surface-variant/30 pt-safe">
        <div className="h-16 px-3 sm:px-5 flex items-center justify-between gap-2 max-w-7xl mx-auto w-full">
          {/* Brand & Live Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => onToggleViewMode('citizen')}
              className="flex items-center gap-2 text-left focus:outline-none group"
              title="UrbanFlow AI Home"
            >
              <img
                alt="UrbanFlow AI Logo"
                className="h-8 w-auto object-contain shrink-0 drop-shadow-[0_0_8px_rgba(0,255,157,0.4)] transition-transform group-hover:scale-105"
                src={IMAGES.logo}
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-[16px] sm:text-[18px] text-primary truncate tracking-tight font-semibold">
                    UrbanFlow
                  </span>
                  <span className="font-label-code text-[10px] text-primary-container uppercase px-1.5 py-0.2 rounded bg-primary-container/15 border border-primary-container/30 font-bold">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
                  </span>
                  <span className="font-label-code text-[10px] text-on-surface-variant truncate uppercase tracking-widest font-mono">
                    Grid Online • Chennai & Kanchi
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center View Mode Switcher */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-surface-container-high border border-surface-variant/50 shadow-inner">
            <button
              onClick={() => onToggleViewMode('citizen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-code text-[11px] font-semibold transition-all ${
                viewMode === 'citizen'
                  ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(0,255,157,0.35)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">smartphone</span>
              <span>Citizen Mobile</span>
            </button>
            <button
              onClick={() => onToggleViewMode('ops')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-code text-[11px] font-semibold transition-all ${
                viewMode === 'ops'
                  ? 'bg-secondary text-on-secondary shadow-[0_0_12px_rgba(76,215,246,0.35)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span>Ops Command Center</span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Switch for small screens */}
            <button
              onClick={() => onToggleViewMode(viewMode === 'citizen' ? 'ops' : 'citizen')}
              className="md:hidden h-9 px-2 rounded-lg bg-surface-container-high text-secondary border border-surface-variant/40 flex items-center gap-1 text-[11px] font-label-code font-bold active:scale-95"
              title="Toggle View Mode"
            >
              <span className="material-symbols-outlined text-[16px]">
                {viewMode === 'citizen' ? 'terminal' : 'smartphone'}
              </span>
              <span>{viewMode === 'citizen' ? 'Ops' : 'Citizen'}</span>
            </button>

            {/* Judge Demo Quick Action Button */}
            <button
              onClick={onOpenJudgeDemo}
              className="h-10 px-2.5 sm:px-3 rounded-full bg-secondary-container/20 text-secondary border border-secondary/40 hover:bg-secondary-container/30 flex items-center gap-1 transition-all active:scale-95 shadow-[0_0_12px_rgba(76,215,246,0.2)]"
              title="Open Hackathon Demo Walkthrough"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              <span className="font-label-code text-[10px] sm:text-[11px] tracking-wider uppercase font-bold">
                Judge Demo
              </span>
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="w-10 h-10 rounded-full bg-error-container/30 text-error border border-error/30 hover:bg-error-container/50 flex items-center justify-center transition-all active:scale-95"
              title="Civic Emergency SOS"
            >
              <span className="material-symbols-outlined text-[20px]">e911_emergency</span>
            </button>

            {/* Notifications with popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-10 h-10 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high flex items-center justify-center transition-colors active:scale-95"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#00ff9d]"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface-container-high border border-surface-variant/60 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-surface-variant/40 pb-2 mb-2">
                    <span className="font-headline-sm text-sm text-primary font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary-container text-[18px]">campaign</span>
                      Civic Mesh Dispatch Feed
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-on-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                  <div className="space-y-2 text-xs font-body-sm">
                    <div className="p-2 rounded-lg bg-surface-container-lowest border-l-2 border-primary-container">
                      <div className="flex justify-between font-label-code text-[10px] text-primary-container mb-0.5">
                        <span>PWD HIGHWAYS</span>
                        <span>Just Now</span>
                      </div>
                      <p className="text-on-surface font-medium">Ticket #UF-2026-1042: Taskforce #4 on GST Rd KM 32.4</p>
                      <p className="text-on-surface-variant text-[11px]">Infrared compaction in progress. Lane 2 diverted.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-container-lowest border-l-2 border-secondary">
                      <div className="flex justify-between font-label-code text-[10px] text-secondary mb-0.5">
                        <span>TRANSIT GRID</span>
                        <span>4m ago</span>
                      </div>
                      <p className="text-on-surface font-medium">Tambaram Platform 1 Elevator Verified 100% Operational</p>
                      <p className="text-on-surface-variant text-[11px]">Wheelchair boarding access open at Concourse A.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-container-lowest border-l-2 border-primary-fixed">
                      <div className="flex justify-between font-label-code text-[10px] text-primary-fixed mb-0.5">
                        <span>CIVIC KARMA</span>
                        <span>12m ago</span>
                      </div>
                      <p className="text-on-surface font-medium">+50 Karma awarded for verified hazard identification</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Authentication & Profile Indicator */}
            {user ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-2 py-1 rounded-full bg-surface-container hover:bg-surface-container-high border border-surface-variant/40 transition-all active:scale-95 group ml-0.5"
                title="Account & Cloud Sync Settings"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-primary-container shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {(profile?.displayName || user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:flex flex-col text-left pr-1 leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="font-headline-sm text-xs text-primary font-bold truncate max-w-[90px]">
                      {profile?.displayName || user.displayName?.split(' ')[0] || 'Citizen'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                  </div>
                  <span className="font-label-code text-[9px] text-secondary font-semibold">
                    {profile?.karma || 820} Karma
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="h-9 px-3 rounded-full bg-primary-container text-on-primary-container hover:bg-primary-fixed font-label-code text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,157,0.3)] transition-all active:scale-95 ml-0.5"
                title="Sign in to save preferences & sync data"
              >
                <span className="material-symbols-outlined text-[16px]">account_circle</span>
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-surface-container-high border border-error/50 p-5 shadow-2xl flex flex-col gap-3 text-on-surface animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(255,180,171,0.4)]">
                <span className="material-symbols-outlined text-[28px]">e911_emergency</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-lg text-primary font-bold">Emergency Civic Alert</h3>
                <p className="font-label-code text-xs text-error font-semibold">Priority 1 Municipal Dispatch</p>
              </div>
            </div>
            <p className="font-body-sm text-sm text-on-surface-variant">
              Immediate connection to Chennai & Kanchipuram emergency services (112 / Police, 108 / Ambulance, 101 / Fire, GCC Disaster Control).
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href="tel:112"
                className="h-11 rounded-xl bg-error text-on-error font-label-code text-xs font-bold uppercase flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                Dial 112
              </a>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="h-11 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-highest font-label-code text-xs font-semibold flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
