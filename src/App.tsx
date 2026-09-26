import React, { useState, useEffect } from 'react';
import { AppViewMode, CitizenTab, OpsNavTab, TicketSummary } from './types';
import { INITIAL_CREW_TELEMETRY, INITIAL_TICKETS } from './data/mockData';
import { Header } from './components/Header';
import { CitizenNavbar } from './components/citizen/CitizenNavbar';
import { AICoreScreen } from './components/citizen/AICoreScreen';
import { MobilityScreen } from './components/citizen/MobilityScreen';
import { ReportScreen } from './components/citizen/ReportScreen';
import { CitizenKarmaScreen } from './components/citizen/CitizenKarmaScreen';
import { PulseScreen } from './components/citizen/PulseScreen';
import { CityOpsDashboard } from './components/ops/CityOpsDashboard';
import { TruckCorridorScreen } from './components/ops/TruckCorridorScreen';
import { VisionAiModal } from './components/ops/VisionAiModal';
import { RepairInspectionModal } from './components/ops/RepairInspectionModal';
import { CitizenNotifyModal } from './components/ops/CitizenNotifyModal';
import { JudgeDemoModal } from './components/shared/JudgeDemoModal';
import { AuthModal } from './components/shared/AuthModal';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { tickets: cloudTickets, resolveTicketInCloud, preferences, updateUserPreferences } = useAuth();
  const [viewMode, setViewMode] = useState<AppViewMode>(preferences?.viewMode || 'citizen');
  const [citizenTab, setCitizenTab] = useState<CitizenTab>('ai-core');
  const [opsNavTab, setOpsNavTab] = useState<OpsNavTab>('gis-matrix');
  const [crewTelemetry] = useState(INITIAL_CREW_TELEMETRY);
  const [selectedTicket, setSelectedTicket] = useState<TicketSummary>(INITIAL_TICKETS[0]);

  // Use cloud tickets with fallback to INITIAL_TICKETS
  const tickets = cloudTickets && cloudTickets.length > 0 ? cloudTickets : INITIAL_TICKETS;

  // Modals state
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync viewMode from user preferences if available
  useEffect(() => {
    if (preferences?.viewMode && preferences.viewMode !== viewMode) {
      setViewMode(preferences.viewMode);
    }
  }, [preferences?.viewMode]);

  const handleToggleViewMode = (newMode: AppViewMode) => {
    setViewMode(newMode);
    updateUserPreferences({ viewMode: newMode });
  };

  // App-level navigation handlers
  const handleTrackTicket = (ticketCode: string) => {
    const t = tickets.find((tk) => tk.code === ticketCode) || tickets[0];
    setSelectedTicket(t);
    setViewMode('ops');
    setOpsNavTab('field-crews');
  };

  const handleOpenVisionModal = (ticket: TicketSummary) => {
    setSelectedTicket(ticket);
    setIsVisionModalOpen(true);
  };

  const handleOpenNotifyModal = (ticket: TicketSummary) => {
    setSelectedTicket(ticket);
    setIsNotifyModalOpen(true);
  };

  const handleMarkResolved = (ticketId: string) => {
    resolveTicketInCloud(ticketId);
    setSelectedTicket((prev) => ({
      ...prev,
      status: 'RESOLVED',
      slaRemaining: 'Resolved on-site'
    }));
  };

  const handleApproveCloseout = () => {
    handleMarkResolved(selectedTicket.id);
  };

  // Judge Demo Step Navigator
  const handleSelectDemoStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        // Accessible Wayfinding
        setViewMode('citizen');
        setCitizenTab('mobility');
        break;
      case 2:
        // Citizen Edge Vision Pothole Report
        setViewMode('citizen');
        setCitizenTab('report');
        break;
      case 3:
        // Autonomous Multi-Agent Triage (#UF-2026-1042)
        setViewMode('citizen');
        setCitizenTab('ai-core');
        break;
      case 4:
        // City Operations Command Center & GIS Matrix
        setViewMode('ops');
        setOpsNavTab('gis-matrix');
        break;
      case 5:
        // Field Fleet Unit Truck T-18 Corridor
        setViewMode('ops');
        setOpsNavTab('field-crews');
        break;
      case 6:
        // On-Site Repair Quality Inspection Closeout
        setViewMode('ops');
        setOpsNavTab('field-crews');
        setIsRepairModalOpen(true);
        break;
      case 7:
        // Multi-Channel Citizen Alert & Hero Karma
        setViewMode('citizen');
        setCitizenTab('karma');
        break;
      default:
        setViewMode('citizen');
        setCitizenTab('ai-core');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Header */}
      <Header
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        onOpenJudgeDemo={() => setIsJudgeDemoOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16">
        {viewMode === 'citizen' ? (
          /* CITIZEN MOBILE EXPERIENCE */
          <div className="w-full">
            {citizenTab === 'pulse' && (
              <PulseScreen
                onNavigateTab={(tab) => setCitizenTab(tab)}
                onTrackTicket={handleTrackTicket}
                tickets={tickets}
              />
            )}

            {citizenTab === 'ai-core' && (
              <AICoreScreen
                onNavigateToMobility={() => setCitizenTab('mobility')}
                onNavigateToReport={() => setCitizenTab('report')}
                onTrackTicket={handleTrackTicket}
                ticketData={selectedTicket}
              />
            )}

            {citizenTab === 'mobility' && (
              <MobilityScreen />
            )}

            {citizenTab === 'report' && (
              <ReportScreen
                ticket={selectedTicket}
                onTrackWorkcrew={() => {
                  setViewMode('ops');
                  setOpsNavTab('field-crews');
                }}
                onViewResolutionDossier={() => setCitizenTab('karma')}
              />
            )}

            {citizenTab === 'karma' && (
              <CitizenKarmaScreen
                ticket={selectedTicket}
                onViewOnGIS={() => {
                  setViewMode('ops');
                  setOpsNavTab('gis-matrix');
                }}
                onBackToReport={() => setCitizenTab('report')}
              />
            )}

            {/* Citizen Bottom Navigation */}
            <CitizenNavbar
              activeTab={citizenTab}
              onSelectTab={setCitizenTab}
              onOpenOps={() => setViewMode('ops')}
            />
          </div>
        ) : (
          /* CITY OPERATIONS COMMAND DASHBOARD */
          <div className="flex w-full min-h-[calc(100vh-4rem)]">
            {/* Desktop Operations Sidebar */}
            <aside className="hidden lg:flex w-64 xl:w-72 bg-surface-container-lowest border-r border-surface-variant/30 flex-col justify-between p-4 shrink-0 fixed top-16 bottom-0 z-30 overflow-y-auto scrollbar-none">
              <div className="flex flex-col gap-2">
                <div className="px-2 py-1 flex items-center justify-between">
                  <span className="font-label-code text-[11px] uppercase tracking-wider text-on-surface-variant">
                    Operations Command
                  </span>
                  <span className="font-label-code text-[9px] text-primary-container bg-primary-container/10 px-1.5 py-0.2 rounded border border-primary-container/20">
                    LIVE
                  </span>
                </div>

                <nav className="flex flex-col gap-1">
                  <button
                    onClick={() => setOpsNavTab('gis-matrix')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-body-md text-xs transition-all text-left ${
                      opsNavTab === 'gis-matrix'
                        ? 'bg-surface-container-high text-primary-fixed border-l-2 border-primary-container font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-primary-container">hub</span>
                    <span>Live Operations / GIS Matrix</span>
                  </button>

                  <button
                    onClick={() => {
                      setOpsNavTab('incident-triage');
                      setIsVisionModalOpen(true);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-body-md text-xs transition-all text-left ${
                      opsNavTab === 'incident-triage'
                        ? 'bg-surface-container-high text-primary-fixed border-l-2 border-primary-container font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-secondary">emergency</span>
                    <span>Incident Triage & Dispatch</span>
                  </button>

                  <button
                    onClick={() => setOpsNavTab('field-crews')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-body-md text-xs transition-all text-left ${
                      opsNavTab === 'field-crews'
                        ? 'bg-surface-container-high text-primary-fixed border-l-2 border-primary-container font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-primary-fixed">local_shipping</span>
                    <span>Municipal Depts & Field Crews</span>
                  </button>

                  <button
                    onClick={() => {
                      setViewMode('citizen');
                      setCitizenTab('mobility');
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body-md text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-[20px] text-secondary">directions_subway</span>
                    <span>Transit & Accessibility Grid</span>
                  </button>

                  <button
                    onClick={() => {
                      setViewMode('citizen');
                      setCitizenTab('karma');
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body-md text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-[20px] text-tertiary-fixed-dim">analytics</span>
                    <span>Citizen Feedback & SLA Analytics</span>
                  </button>

                  <button
                    onClick={() => setIsJudgeDemoOpen(true)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body-md text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-[20px] text-secondary">tune</span>
                    <span>Settings & AI Orchestrator Rules</span>
                  </button>
                </nav>
              </div>

              {/* Sidebar Footer */}
              <div className="flex flex-col gap-3 pt-4 border-t border-surface-variant/40">
                <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary-container animate-pulse"></span>
                    <span className="font-label-code text-[11px] text-on-surface-variant">Neural Mesh v3.1</span>
                  </div>
                  <span className="font-label-code text-[10px] text-primary-fixed font-bold font-mono">Nominal</span>
                </div>
                <button
                  onClick={() => alert("🚨 Sovereign Emergency Broadcast dispatched to all municipal VMS displays and civic channels.")}
                  className="w-full flex items-center justify-center gap-2 bg-error-container text-on-error hover:bg-error transition-all py-2.5 px-3 rounded-xl font-label-code text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(255,180,171,0.2)]"
                >
                  <span className="material-symbols-outlined text-[18px]">broadcast_on_personal</span>
                  <span>Emergency Broadcast</span>
                </button>
              </div>
            </aside>

            {/* Main Operations Views Content Container */}
            <div className="flex-1 lg:pl-64 xl:pl-72 p-4 sm:p-6 max-w-7xl mx-auto w-full">
              {opsNavTab === 'field-crews' ? (
                <TruckCorridorScreen
                  telemetry={crewTelemetry}
                  ticket={selectedTicket}
                  onOpenRepairModal={() => setIsRepairModalOpen(true)}
                  onOpenNotifyModal={() => setIsNotifyModalOpen(true)}
                  onBackToGis={() => setOpsNavTab('gis-matrix')}
                />
              ) : (
                <CityOpsDashboard
                  tickets={tickets}
                  activeNavTab={opsNavTab}
                  onSelectNavTab={setOpsNavTab}
                  onOpenVisionModal={handleOpenVisionModal}
                  onOpenNotifyModal={handleOpenNotifyModal}
                  onNavigateToTruckCorridor={() => setOpsNavTab('field-crews')}
                  onMarkResolved={handleMarkResolved}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Forensic Vision AI Inspection Modal */}
      <VisionAiModal
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
        ticket={selectedTicket}
        onConfirmAssessment={() => {
          handleMarkResolved(selectedTicket.id);
        }}
      />

      {/* Repair Quality Inspection Modal */}
      <RepairInspectionModal
        isOpen={isRepairModalOpen}
        onClose={() => setIsRepairModalOpen(false)}
        ticket={selectedTicket}
        onApproveCloseout={handleApproveCloseout}
      />

      {/* Automated Citizen Notification Modal */}
      <CitizenNotifyModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        ticket={selectedTicket}
        onBroadcastComplete={() => {
          // Switch to citizen karma review if desired
        }}
      />

      {/* Hackathon Judge Demo Walkthrough Modal */}
      <JudgeDemoModal
        isOpen={isJudgeDemoOpen}
        onClose={() => setIsJudgeDemoOpen(false)}
        onSelectStep={handleSelectDemoStep}
      />

      {/* Cloud Authentication & Sync Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
