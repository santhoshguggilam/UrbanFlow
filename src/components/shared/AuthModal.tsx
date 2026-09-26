import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    profile,
    preferences,
    savedRoutes,
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    logout,
    updateUserPreferences,
    authError,
    clearError
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'savedRoutes'>('profile');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoadingAction(true);
    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName || 'Civic Guardian');
      }
    } catch {
      // Error handled in context
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setLoadingAction(true);
    try {
      await loginWithGoogle();
    } catch {
      // Error handled in context
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDemoSignIn = async (role: 'citizen' | 'admin') => {
    clearError();
    setLoadingAction(true);
    try {
      const demoEmail = role === 'admin' ? 'commissioner@urbanflow.civic' : 'citizen.hero@urbanflow.civic';
      const demoPass = 'UrbanFlow2026!';
      try {
        await loginWithEmail(demoEmail, demoPass);
      } catch {
        // If demo user doesn't exist yet, create it
        await signUpWithEmail(demoEmail, demoPass, role === 'admin' ? 'Commissioner Rivera' : 'Guardian Citizen Alex');
      }
    } catch {
      // Error handled in context
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in text-on-surface"
    >
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-surface-container-low border border-surface-variant/50 shadow-2xl flex flex-col p-5 sm:p-6 text-on-surface z-10">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-variant/40 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary-container flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">
                {user ? 'account_circle' : 'security'}
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-lg text-primary font-bold">
                {user ? 'Citizen Identity & Cloud Sync' : 'UrbanFlow AI Authentication'}
              </h2>
              <p className="font-label-code text-[11px] text-on-surface-variant">
                {user ? 'Cross-device persistent synchronization active' : 'Sign in to sync preferences, routes & civic karma'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* LOGGED IN VIEW */}
        {user ? (
          <div className="flex flex-col gap-4">
            {/* User Profile Card */}
            <div className="p-4 rounded-xl bg-surface-container border border-surface-variant/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-12 h-12 rounded-full object-cover border border-primary-container"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center text-lg font-bold">
                    {(profile?.displayName || user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-headline-sm text-sm text-primary font-bold truncate">
                      {profile?.displayName || user.displayName || 'Guardian Citizen'}
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-primary-container/20 text-primary-container font-label-code text-[10px] font-bold border border-primary-container/30 uppercase">
                      {profile?.role || 'Citizen'}
                    </span>
                  </div>
                  <span className="font-body-sm text-xs text-on-surface-variant truncate">
                    {user.email}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-label-code text-[10px] text-secondary font-bold">
                      ⭐ {profile?.karma || 820} Civic Karma
                    </span>
                    <span className="text-[10px] text-on-surface-variant">•</span>
                    <span className="font-label-code text-[10px] text-primary-fixed">
                      {profile?.level || 'Level 4 Guardian'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sync Status Badge */}
              <div className="flex flex-col items-end shrink-0">
                <span className="flex items-center gap-1 text-[10px] font-label-code text-primary-container bg-primary-container/10 px-2 py-1 rounded-full border border-primary-container/30 font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                  Cloud Synced
                </span>
              </div>
            </div>

            {/* Inner Tabs: Profile, Preferences, Saved Routes */}
            <div className="flex items-center gap-1 border-b border-surface-variant/40 pb-2 font-label-code text-xs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'profile'
                    ? 'bg-surface-container-high text-primary-fixed border border-primary-container/30 font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Profile & Karma
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'preferences'
                    ? 'bg-surface-container-high text-primary-fixed border border-primary-container/30 font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Accessibility Sync
              </button>
              <button
                onClick={() => setActiveTab('savedRoutes')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'savedRoutes'
                    ? 'bg-surface-container-high text-primary-fixed border border-primary-container/30 font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Saved Routes ({savedRoutes.length})
              </button>
            </div>

            {/* Tab: Profile & Karma */}
            {activeTab === 'profile' && (
              <div className="p-3 rounded-xl bg-surface-container border border-surface-variant/30 flex flex-col gap-2.5 text-xs font-body-sm">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant font-label-code">User ID:</span>
                  <span className="text-primary font-mono text-[11px] truncate max-w-[200px]">
                    {user.uid}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant font-label-code">Account Provider:</span>
                  <span className="text-secondary font-label-code uppercase">
                    {user.providerData[0]?.providerId || 'password'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant font-label-code">Email Verified:</span>
                  <span className="text-primary-container font-label-code">
                    {user.emailVerified ? 'Verified' : 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant font-label-code">Last Sync:</span>
                  <span className="text-on-surface font-mono">
                    {new Date(preferences?.updatedAt || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}

            {/* Tab: Accessibility Sync */}
            {activeTab === 'preferences' && (
              <div className="p-3 rounded-xl bg-surface-container border border-surface-variant/30 flex flex-col gap-2 text-xs">
                <span className="font-label-code text-[11px] text-secondary uppercase font-bold">
                  Cross-Device Accessibility Profile
                </span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high border border-surface-variant/30 cursor-pointer">
                    <span className="font-label-code text-[11px] text-primary">Elevator Vital</span>
                    <input
                      type="checkbox"
                      checked={preferences?.elevatorVital ?? true}
                      onChange={(e) => updateUserPreferences({ elevatorVital: e.target.checked })}
                      className="rounded accent-primary-container"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high border border-surface-variant/30 cursor-pointer">
                    <span className="font-label-code text-[11px] text-primary">Low-Floor Bus</span>
                    <input
                      type="checkbox"
                      checked={preferences?.lowFloorBus ?? true}
                      onChange={(e) => updateUserPreferences({ lowFloorBus: e.target.checked })}
                      className="rounded accent-primary-container"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high border border-surface-variant/30 cursor-pointer">
                    <span className="font-label-code text-[11px] text-primary">Max 3% Incline</span>
                    <input
                      type="checkbox"
                      checked={preferences?.max3PctIncline ?? true}
                      onChange={(e) => updateUserPreferences({ max3PctIncline: e.target.checked })}
                      className="rounded accent-primary-container"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high border border-surface-variant/30 cursor-pointer">
                    <span className="font-label-code text-[11px] text-primary">Sensory Cues</span>
                    <input
                      type="checkbox"
                      checked={preferences?.sensoryCues ?? true}
                      onChange={(e) => updateUserPreferences({ sensoryCues: e.target.checked })}
                      className="rounded accent-primary-container"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Tab: Saved Routes */}
            {activeTab === 'savedRoutes' && (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {savedRoutes.length === 0 ? (
                  <div className="p-4 rounded-xl bg-surface-container text-center text-xs text-on-surface-variant">
                    No routes saved yet. Tap "Save Route" on the Transit Wayfinder or AI Core to sync here!
                  </div>
                ) : (
                  savedRoutes.map((r) => (
                    <div
                      key={r.routeId}
                      className="p-2.5 rounded-xl bg-surface-container border border-surface-variant/30 flex flex-col gap-0.5"
                    >
                      <div className="flex items-center justify-between font-label-code text-xs">
                        <span className="text-primary font-bold truncate">{r.name}</span>
                        <span className="text-secondary">{r.time}</span>
                      </div>
                      <span className="text-on-surface-variant text-[11px] truncate">
                        {r.origin} ➔ {r.destination}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sign Out Action */}
            <button
              onClick={logout}
              className="w-full h-11 rounded-xl bg-surface-container-high hover:bg-error-container/30 hover:text-error text-on-surface font-label-code text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 border border-surface-variant/40"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* SIGN IN / SIGN UP VIEW */
          <div className="flex flex-col gap-4">
            {/* Quick Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loadingAction}
              className="w-full h-12 rounded-xl bg-surface-container-high hover:bg-surface-bright text-primary font-headline-sm text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all border border-surface-variant/50 shadow-sm active:scale-98"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="h-px bg-surface-variant flex-1"></div>
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase">
                or with email
              </span>
              <div className="h-px bg-surface-variant flex-1"></div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 rounded-xl bg-error-container/20 border border-error/40 text-error text-xs font-body-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
                <span>{authError}</span>
              </div>
            )}

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 bg-surface-container rounded-xl border border-surface-variant/40">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  clearError();
                }}
                className={`py-1.5 rounded-lg font-label-code text-xs font-semibold transition-all ${
                  mode === 'signin'
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  clearError();
                }}
                className={`py-1.5 rounded-lg font-label-code text-xs font-semibold transition-all ${
                  mode === 'signup'
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === 'signup' && (
                <div className="flex flex-col gap-1">
                  <label className="font-label-code text-[11px] text-on-surface-variant uppercase">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Santhosh Guggilam"
                    className="w-full h-11 px-3 rounded-xl bg-surface-container border border-surface-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary-container"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="font-label-code text-[11px] text-on-surface-variant uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="santhoshguggilam2007@gmail.com"
                  className="w-full h-11 px-3 rounded-xl bg-surface-container border border-surface-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-code text-[11px] text-on-surface-variant uppercase">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full h-11 px-3 rounded-xl bg-surface-container border border-surface-variant/40 text-on-surface text-xs focus:outline-none focus:border-primary-container"
                />
              </div>

              <button
                type="submit"
                disabled={loadingAction}
                className="w-full h-11 mt-1 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary-fixed font-label-code text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_16px_rgba(0,255,157,0.35)] flex items-center justify-center gap-1.5"
              >
                <span className={`material-symbols-outlined text-[18px] ${loadingAction ? 'animate-spin' : ''}`}>
                  {loadingAction ? 'sync' : mode === 'signin' ? 'login' : 'how_to_reg'}
                </span>
                <span>{loadingAction ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Register Account'}</span>
              </button>
            </form>

            {/* Judge Demo Fast Sign-in Shortcuts */}
            <div className="p-3 rounded-xl bg-surface-container-high border border-surface-variant/40 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-code text-[10px] text-secondary uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  1-Click Demo Profiles
                </span>
                <span className="font-label-code text-[9px] text-on-surface-variant">Instant Sign-in</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('citizen')}
                  disabled={loadingAction}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-primary font-label-code text-[11px] flex items-center justify-center gap-1 border border-surface-variant/40"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary-container">person</span>
                  <span>Citizen Hero</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('admin')}
                  disabled={loadingAction}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-secondary font-label-code text-[11px] flex items-center justify-center gap-1 border border-surface-variant/40"
                >
                  <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                  <span>Ops Commissioner</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
