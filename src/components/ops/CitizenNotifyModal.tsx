import React, { useState } from 'react';
import { TicketSummary } from '../../types';
import { IMAGES } from '../../data/mockData';

interface CitizenNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketSummary;
  onBroadcastComplete?: () => void;
}

export const CitizenNotifyModal: React.FC<CitizenNotifyModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onBroadcastComplete
}) => {
  const [activeTab, setActiveTab] = useState<'push' | 'wa' | 'voice'>('push');
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcasted, setBroadcasted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [toastNote, setToastNote] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBroadcast = () => {
    setBroadcasting(true);
    setTimeout(() => {
      setBroadcasting(false);
      setBroadcasted(true);
      if (onBroadcastComplete) onBroadcastComplete();
      setTimeout(() => {
        onClose();
        setBroadcasted(false);
      }, 1000);
    }, 800);
  };

  const handleTestPush = () => {
    setToastNote('Sample Push Notification delivered to device simulator.');
    setTimeout(() => setToastNote(null), 3000);
  };

  const handleToggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in text-on-surface"
    >
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-2xl flex flex-col gap-4 p-5 sm:p-6 text-on-surface z-10">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-outline-variant/40 pb-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary font-label-code text-[11px] uppercase font-bold flex items-center gap-1 border border-secondary/30">
                <span className="material-symbols-outlined text-[14px]">forward_to_inbox</span>
                AUTOMATED CITIZEN NOTIFICATION PREVIEW
              </span>
              <span className="font-label-telemetry text-xs text-primary-container font-semibold font-mono">
                {ticket.code}
              </span>
              <span className="font-label-code text-[11px] text-on-surface-variant font-mono">
                RECIPIENTS: 38 CITIZENS
              </span>
            </div>
            <h2 className="font-headline-md text-xl sm:text-2xl text-primary font-bold tracking-tight">
              GST KM 32.4 Pothole Resolution Broadcast
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Dispatch multi-channel automated resolution proof, reward karma, and lane reopening notice to reporter & upvoters.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-surface-container border border-surface-variant/30">
          <div className="p-2 rounded-lg bg-surface-container-high flex flex-col gap-0.5">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Target Audience</span>
            <span className="font-headline-sm text-sm text-primary font-bold">38 Users</span>
            <span className="font-label-telemetry text-[10px] text-secondary">1 Reporter + 37 Watchers</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-container-high flex flex-col gap-0.5">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Resolution SLA</span>
            <span className="font-headline-sm text-sm text-primary-container font-bold">1h 14m</span>
            <span className="font-label-telemetry text-[10px] text-primary-fixed-dim">22h 46m Ahead of Limit</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-container-high flex flex-col gap-0.5">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Civic Reward</span>
            <span className="font-headline-sm text-sm text-secondary font-bold">+50 Pts</span>
            <span className="font-label-telemetry text-[10px] text-on-surface-variant">Karma Ledger Verified</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-container-high flex flex-col gap-0.5">
            <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Channel Health</span>
            <span className="font-headline-sm text-sm text-primary-fixed-dim font-bold">99.8%</span>
            <span className="font-label-telemetry text-[10px] text-secondary">Push / WA / IVR Live</span>
          </div>
        </div>

        {/* Channel Tab Bar */}
        <div className="flex items-center gap-1 border-b border-outline-variant/40 pb-2">
          <button
            onClick={() => setActiveTab('push')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-code text-xs uppercase transition-all ${
              activeTab === 'push'
                ? 'border border-secondary bg-secondary/15 text-secondary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">notifications_active</span>
            <span>App Push & Card</span>
          </button>
          <button
            onClick={() => setActiveTab('wa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-code text-xs uppercase transition-all ${
              activeTab === 'wa'
                ? 'border border-secondary bg-secondary/15 text-secondary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>WhatsApp & RCS</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-code text-xs uppercase transition-all ${
              activeTab === 'voice'
                ? 'border border-secondary bg-secondary/15 text-secondary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
            <span>AI IVR Voice Call</span>
          </button>
        </div>

        {/* Tab 1: App Push & Card */}
        {activeTab === 'push' && (
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/40 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                </div>
                <span className="font-headline-sm text-sm text-primary font-bold">UrbanFlow Civic Companion</span>
              </div>
              <span className="font-label-telemetry text-xs text-on-surface-variant font-mono">
                Just Now • Notification Tray
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 bg-surface-container-high p-3 rounded-xl border border-surface-variant/40">
              <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 relative">
                <img
                  alt="Repaired asphalt preview"
                  className="w-full h-full object-cover"
                  src={IMAGES.potholeRepaired}
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-surface-container-lowest/90 font-label-code text-[10px] text-primary-container font-bold border border-primary-container/30">
                  VERIFIED REPAIR
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-body-md text-sm font-bold text-primary">Your Pothole Report has been Fixed! 🎉</span>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Dear Citizen, your road surface report on GST Road KM 32.4 (Potheri Ramp) has been inspected, resurfaced with cold-patch polymer, and certified safe by Highway Unit T-18.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <span className="font-label-code text-xs text-secondary font-bold">+50 Karma Earned</span>
                  <span className="font-label-code text-[10px] text-on-surface-variant font-mono">TX: {ticket.proofHash}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: WhatsApp & RCS */}
        {activeTab === 'wa' && (
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/40 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[20px]">sms</span>
                <span className="font-headline-sm text-sm text-on-surface font-bold">
                  Tamil Nadu Highway Works & CivicBot
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary-container font-label-code text-[10px] font-bold">
                OFFICIAL BUSINESS
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-high text-on-surface font-body-sm flex flex-col gap-2 border border-surface-variant/30">
              <p className="text-xs">
                <strong className="text-primary">வணக்கம் / Hello Citizen!</strong> Your municipal hazard ticket{' '}
                <span className="text-secondary font-mono font-semibold">{ticket.code}</span> has been marked{' '}
                <strong className="text-primary-container">RESOLVED</strong>.
              </p>
              <div className="grid grid-cols-2 gap-2 py-1">
                <div className="p-2 rounded-lg bg-surface-container border border-surface-variant/30">
                  <span className="font-label-code text-[10px] text-error block font-bold">REPORTED HAZARD</span>
                  <span className="text-xs font-semibold text-on-surface">14cm Asphalt Crater</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container border border-surface-variant/30">
                  <span className="font-label-code text-[10px] text-primary-container block font-bold">REPAIR SPEC</span>
                  <span className="text-xs font-semibold text-on-surface">185kg Cold-Patch Polymer</span>
                </div>
              </div>
              <p className="text-on-surface-variant text-[11px]">
                GST Road Lane 2 is reopened with unrestricted traffic flow. Rate your response experience:
              </p>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button className="px-2.5 py-1 rounded-lg bg-primary-container/20 text-primary-container font-label-code text-[11px] border border-primary-container/40">
                  ⭐⭐⭐⭐⭐ Excellent
                </button>
                <button className="px-2.5 py-1 rounded-lg bg-surface-container-highest text-on-surface font-label-code text-[11px]">
                  Inspect Proof Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI IVR Voice Call */}
        {activeTab === 'voice' && (
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/40 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">mic</span>
                <span className="font-headline-sm text-sm text-primary font-bold">
                  Tamil & English AI Voice Synthesizer
                </span>
              </div>
              <span className="font-label-telemetry text-xs text-secondary font-mono">
                Duration: 28s • Sample Audio
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-high flex items-center justify-between gap-4 border border-surface-variant/30">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleAudio}
                  className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center hover:bg-secondary-fixed transition-colors shrink-0 shadow-md"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isPlayingAudio ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <div className="flex flex-col">
                  <span className="font-label-code text-xs text-on-surface font-semibold">
                    Automated Citizen IVR Dispatch
                  </span>
                  <span className="font-label-telemetry text-[11px] text-on-surface-variant font-mono">
                    TTS Neural Voice: Chennai-Fem-02
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 h-6">
                {[4, 8, 3, 10, 6, 9, 3].map((height, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full bg-secondary ${
                      isPlayingAudio ? 'animate-pulse' : ''
                    }`}
                    style={{ height: `${height * 2}px` }}
                  ></span>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-highest text-xs text-on-surface font-body-sm leading-relaxed border border-surface-variant/30">
              <span className="font-label-code text-secondary block mb-1 uppercase font-bold">
                Audio Transcript Preview:
              </span>
              "GST சாலை KM 32.4 பழுது நீக்கப்பட்டது. PWD அலகு T-18 பழுதுபார்ப்பை வெற்றிகரமாக முடித்துள்ளது. உங்கள் ஒத்துழைப்பிற்கு நன்றி. Traffic on Lane 2 has now safely resumed."
            </div>
          </div>
        )}

        {/* Toast Note */}
        {toastNote && (
          <div className="p-2.5 rounded-xl bg-surface-container-high border border-secondary text-xs font-label-code text-secondary flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>{toastNote}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-outline-variant/40">
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={handleTestPush}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface transition-all font-label-code text-xs border border-surface-variant/40"
            >
              <span className="material-symbols-outlined text-secondary text-[16px]">send_to_mobile</span>
              <span>Test Sample to My Phone</span>
            </button>
            <button
              onClick={() => alert("Officer Note updated in dispatch ledger.")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface transition-all font-label-code text-xs border border-surface-variant/40"
            >
              <span className="material-symbols-outlined text-secondary text-[16px]">edit_note</span>
              <span>Edit Officer Note</span>
            </button>
          </div>

          <button
            onClick={handleBroadcast}
            disabled={broadcasting || broadcasted}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-label-code text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_16px_rgba(76,215,246,0.35)] ${
              broadcasted
                ? 'bg-surface-container-high text-secondary border border-secondary'
                : 'bg-secondary text-on-secondary hover:bg-secondary-fixed'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${broadcasting ? 'animate-spin' : ''}`}>
              {broadcasting ? 'sync' : broadcasted ? 'task_alt' : 'broadcast_on_personal'}
            </span>
            <span>{broadcasting ? 'Broadcasting...' : broadcasted ? 'Broadcast Sent to 38 Citizens!' : 'Send Automated Broadcast to 38 Citizens'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
