import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, TicketSummary } from '../../types';
import { INITIAL_CHAT_MESSAGES, INITIAL_ROUTE_RECOMMENDATION } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

interface AICoreScreenProps {
  onNavigateToMobility: () => void;
  onNavigateToReport: () => void;
  onTrackTicket: (ticketCode: string) => void;
  ticketData: TicketSummary;
}

export const AICoreScreen: React.FC<AICoreScreenProps> = ({
  onNavigateToMobility,
  onNavigateToReport,
  onTrackTicket,
  ticketData
}) => {
  const { saveRouteToCloud, user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [agentMode, setAgentMode] = useState<'auto' | 'mobility' | 'civic' | 'services'>('auto');
  const [isTyping, setIsTyping] = useState(false);
  const [routeSaved, setRouteSaved] = useState(false);
  const chatStreamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleQuickPrompt = (promptType: string) => {
    if (promptType === 'accessible_route') {
      setInputText('Tambaram to SRM KTR with minimum walking step-free');
      handleSendPrompt('Tambaram to SRM KTR with minimum walking step-free', 'route');
    } else if (promptType === 'pothole_report') {
      onNavigateToReport();
    } else if (promptType === 'hospital_finder') {
      setInputText('Nearest accessible emergency hospital with ramp bay');
      handleSendPrompt('Find nearest accessible emergency hospital with ramp bay near Tambaram/Potheri', 'hospital');
    } else if (promptType === 'civic_complaints') {
      setInputText('Query open unresolved civic complaints in Zone 14');
      handleSendPrompt('Query open unresolved civic complaints in Zone 14', 'complaints');
    }
  };

  const handleSendPrompt = (textToSend?: string, forceType?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (forceType === 'route' || text.toLowerCase().includes('tambaram') || text.toLowerCase().includes('srm') || text.toLowerCase().includes('wheelchair')) {
        const routeReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'agent',
          agentType: 'orchestrator',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'route-card',
          routeData: INITIAL_ROUTE_RECOMMENDATION
        };
        setMessages((prev) => [...prev, routeReply]);
      } else if (forceType === 'hospital' || text.toLowerCase().includes('hospital')) {
        const hospitalReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'agent',
          agentType: 'mobility',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'text',
          text: '🏥 SRM Global Hospital & Medical Center (Kattankulathur) has 4 ramp ambulance bays open. Step-free clearance verified via LoRaWAN node #HOSP-04. Dedicated accessibility corridor ETA: 14 mins.'
        };
        setMessages((prev) => [...prev, hospitalReply]);
      } else if (forceType === 'complaints' || text.toLowerCase().includes('complaint')) {
        const complaintsReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'agent',
          agentType: 'civic',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'dispatch-card',
          dispatchData: ticketData
        };
        setMessages((prev) => [...prev, complaintsReply]);
      } else {
        const genericReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'agent',
          agentType: 'orchestrator',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'text',
          text: `Swarm Orchestrator analyzed query "${text}". Connected to Greater Chennai Corporation, PWD Highways, and MTC Transit nodes. Operational status nominal (99.8% live health).`
        };
        setMessages((prev) => [...prev, genericReply]);
      }
    }, 700);
  };

  return (
    <div className="flex flex-col w-full pb-24 text-on-surface">
      {/* Floating Ambient Grid Status & Engine Header */}
      <div className="px-4 py-2.5 bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-between shadow-sm sticky top-16 z-20 border-b border-surface-variant/30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
          </span>
          <span className="font-label-code text-[11px] text-primary-container tracking-wider truncate">
            AI Orchestration Engine v2.4 • Connected to City Services
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 bg-surface-container-high px-2 py-0.5 rounded-full text-secondary border border-surface-variant/40">
          <span className="material-symbols-outlined text-[14px]">tune</span>
          <span className="font-label-code text-[10px] text-on-surface-variant uppercase">Sovereign Mode</span>
        </div>
      </div>

      {/* Realtime Service Health Quick Metric */}
      <div className="px-4 pt-2.5 pb-1">
        <div className="flex items-center justify-between px-3 py-2 bg-surface-container-low rounded-xl border border-surface-variant/40 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-secondary">hub</span>
            <span className="font-label-telemetry text-[11px] text-on-surface-variant">
              4 City Departments Integrated
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-label-code text-[11px] text-primary-container font-semibold">
              99.8% Live Service Health
            </span>
            <span className="material-symbols-outlined text-[14px] text-primary-container">verified</span>
          </div>
        </div>
      </div>

      {/* Hackathon Quick-Flow Prompt Bar */}
      <div className="px-4 py-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-label-code text-[10px] uppercase text-on-surface-variant tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-secondary">bolt</span>
            Hackathon Interactive Demo Quick-Flow
          </span>
          <span className="font-label-code text-[9px] text-primary-container/80 bg-primary-container/10 px-1.5 py-0.5 rounded border border-primary-container/20">
            Tap to execute
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <button
            onClick={() => handleQuickPrompt('accessible_route')}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-full shadow-sm active:scale-95 transition-all text-left border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[16px] text-primary-container">accessible_forward</span>
            <span className="font-body-sm text-[12px] whitespace-nowrap">Tambaram to SRM KTR (Min Walking)</span>
          </button>
          <button
            onClick={() => handleQuickPrompt('pothole_report')}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-full shadow-sm active:scale-95 transition-all text-left border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">photo_camera</span>
            <span className="font-body-sm text-[12px] whitespace-nowrap">Report Deep Pothole</span>
          </button>
          <button
            onClick={() => handleQuickPrompt('hospital_finder')}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-full shadow-sm active:scale-95 transition-all text-left border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[16px] text-error">local_hospital</span>
            <span className="font-body-sm text-[12px] whitespace-nowrap">Nearest Accessible Hospital</span>
          </button>
          <button
            onClick={() => handleQuickPrompt('civic_complaints')}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-full shadow-sm active:scale-95 transition-all text-left border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">analytics</span>
            <span className="font-body-sm text-[12px] whitespace-nowrap">Unresolved Civic Complaints</span>
          </button>
        </div>
      </div>

      {/* Interactive Chat Stream */}
      <div ref={chatStreamRef} className="px-4 py-2 flex flex-col gap-4 flex-1">
        {/* Timestamp Divider */}
        <div className="flex items-center justify-center gap-2 my-1">
          <div className="h-[1px] bg-surface-container-high w-16"></div>
          <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-widest">
            Active Dispatch • 07:18 AM IST
          </span>
          <div className="h-[1px] bg-surface-container-high w-16"></div>
        </div>

        {/* Messages Stream */}
        {messages.map((msg) => (
          <div key={msg.id} className="w-full">
            {/* User message */}
            {msg.sender === 'user' && (
              <div className="flex items-end justify-end gap-2 pl-8">
                <div className="flex flex-col items-end gap-1 max-w-[90%]">
                  <div className="bg-secondary-container text-on-secondary-container px-4 py-3 rounded-2xl rounded-tr-none shadow-md">
                    <p className="font-body-md text-on-secondary-container leading-snug">
                      "{msg.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-code text-[10px] pr-1">
                    <span>{msg.timestamp}</span>
                    <span className="material-symbols-outlined text-[12px] text-primary-container">done_all</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 shadow-sm border border-surface-variant/50">
                  <span className="material-symbols-outlined text-secondary text-[18px]">person</span>
                </div>
              </div>
            )}

            {/* Agent / Route Card */}
            {msg.sender === 'agent' && msg.type === 'route-card' && (
              <div className="flex items-start gap-2.5 pr-2">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,255,157,0.35)] mt-1">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <div className="flex flex-col gap-3 min-w-0 flex-1">
                  {/* Live Agent Telemetry & Intent Breakdown Card */}
                  <div className="bg-surface-container-low p-3.5 rounded-2xl shadow-md flex flex-col gap-2.5 border border-surface-variant/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-secondary">alt_route</span>
                        <span className="font-label-code text-[11px] text-secondary uppercase font-semibold">
                          Intent Classified
                        </span>
                      </div>
                      <span className="font-label-code text-[10px] bg-primary-container/15 text-primary-container px-2 py-0.5 rounded-full font-bold border border-primary-container/30">
                        MOBILITY_ACCESSIBLE
                      </span>
                    </div>

                    {/* Routed Agent Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 py-1">
                      <span className="font-label-code text-[10px] text-on-surface-variant">Active Swarm:</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-code text-[10px] border border-surface-variant/40">
                        <span className="material-symbols-outlined text-[12px] text-primary-container">accessible</span>
                        AccessibilityAgent
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-code text-[10px] border border-surface-variant/40">
                        <span className="material-symbols-outlined text-[12px] text-secondary">commute</span>
                        MobilityAgent
                      </span>
                    </div>

                    {/* Parsed Parameters */}
                    <div className="bg-surface-container p-2.5 rounded-xl flex flex-col gap-1.5 text-on-surface">
                      <div className="flex items-center justify-between text-[11px] font-body-sm">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">trip_origin</span> Origin:
                        </span>
                        <span className="font-label-telemetry text-on-surface font-medium">Tambaram Junction</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-body-sm">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">location_on</span> Destination:
                        </span>
                        <span className="font-label-telemetry text-on-surface font-medium">SRM KTR Campus</span>
                      </div>
                      <div className="pt-1.5 flex flex-col gap-1 bg-surface-container-lowest/60 p-2 rounded-lg">
                        <span className="font-label-code text-[9px] uppercase tracking-wider text-secondary">
                          Accessibility Constraints Injected
                        </span>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 bg-surface-container-high rounded font-label-code text-[9px] text-primary-container">
                            Wheelchair Level 1
                          </span>
                          <span className="px-1.5 py-0.5 bg-surface-container-high rounded font-label-code text-[9px] text-primary-container">
                            Avoid Stairs (Elevator Priority)
                          </span>
                          <span className="px-1.5 py-0.5 bg-surface-container-high rounded font-label-code text-[9px] text-primary-container">
                            Transfer Walk &lt; 300m
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Synthesized Output / Route Preview Card */}
                  <div className="bg-surface-container p-4 rounded-2xl shadow-xl flex flex-col gap-3 border border-primary-container/20">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-code text-[11px] font-bold shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">accessible</span>
                        ACCESSIBILITY OPTIMIZED
                      </span>
                      <span className="font-label-code text-[11px] text-secondary font-semibold">
                        Arrive 07:54 AM
                      </span>
                    </div>

                    {/* Primary Metric Strip */}
                    <div className="grid grid-cols-4 gap-1.5 py-2 bg-surface-container-low rounded-xl px-2 border border-surface-variant/30 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-label-code text-[9px] text-on-surface-variant uppercase">Time</span>
                        <span className="font-headline-sm text-primary font-bold">48m</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-label-code text-[9px] text-on-surface-variant uppercase">Walking</span>
                        <span className="font-headline-sm text-primary-container font-bold">210m</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-label-code text-[9px] text-on-surface-variant uppercase">Cost</span>
                        <span className="font-headline-sm text-secondary font-bold">₹35</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-label-code text-[9px] text-on-surface-variant uppercase">Transfers</span>
                        <span className="font-headline-sm text-primary font-bold">1 Lift</span>
                      </div>
                    </div>

                    {/* Dynamic Visual Route Preview */}
                    <div
                      className="w-full h-36 bg-surface-container-highest rounded-xl relative overflow-hidden flex flex-col justify-end p-2.5 shadow-inner bg-cover bg-center"
                      style={{ backgroundImage: `url('${INITIAL_ROUTE_RECOMMENDATION.mapImage}')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent"></div>
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5 bg-surface-container-low/90 backdrop-blur-md px-2 py-1 rounded-lg border border-surface-variant/40">
                          <span className="material-symbols-outlined text-[14px] text-primary-container">elevator</span>
                          <span className="font-label-code text-[10px] text-on-surface">
                            Lift Operational • Gate 2 West
                          </span>
                        </div>
                        <span className="font-label-code text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                          Live Grid Verified
                        </span>
                      </div>
                    </div>

                    {/* Multimodal Timeline Detailed Segments */}
                    <div className="flex flex-col gap-3 pt-1">
                      {INITIAL_ROUTE_RECOMMENDATION.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div className="flex flex-col items-center">
                            <span className="w-6 h-6 rounded-full bg-primary-container/20 text-primary-container flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[14px]">{step.icon}</span>
                            </span>
                            {idx < INITIAL_ROUTE_RECOMMENDATION.steps.length - 1 && (
                              <div className="w-[2px] h-8 bg-surface-container-high my-0.5"></div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-body-md text-primary font-semibold text-[13px]">{step.title}</span>
                              <span className="font-label-code text-[10px] text-on-surface-variant">{step.time}</span>
                            </div>
                            <p className="font-body-sm text-on-surface-variant text-[11px] leading-tight mt-0.5">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Route Action Bar */}
                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        onClick={onNavigateToMobility}
                        className="w-full h-11 bg-primary-container text-on-primary-container rounded-xl font-label-code text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,255,157,0.35)] active:scale-98 transition-all hover:brightness-105"
                      >
                        <span className="material-symbols-outlined text-[18px]">near_me</span>
                        Start Turn-by-Turn Nav
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={async () => {
                            if (!routeSaved) {
                              setRouteSaved(true);
                              if (user) {
                                await saveRouteToCloud({
                                  name: INITIAL_ROUTE_RECOMMENDATION.name,
                                  origin: 'Tambaram Junction',
                                  destination: 'SRM University (KTR Campus)',
                                  time: INITIAL_ROUTE_RECOMMENDATION.time,
                                  cost: INITIAL_ROUTE_RECOMMENDATION.cost
                                });
                              }
                            } else {
                              setRouteSaved(false);
                            }
                          }}
                          className={`h-10 rounded-xl font-label-code text-[11px] flex items-center justify-center gap-1.5 active:scale-98 transition-all border border-surface-variant/40 ${
                            routeSaved
                              ? 'bg-secondary-container/20 text-secondary border-secondary/40 font-bold'
                              : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {routeSaved ? 'bookmark_added' : 'bookmark'}
                          </span>
                          {routeSaved ? 'Route Saved & Synced' : 'Save Route'}
                        </button>
                        <button
                          onClick={onNavigateToMobility}
                          className="h-10 bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface rounded-xl font-label-code text-[11px] flex items-center justify-center gap-1.5 active:scale-98 transition-all border border-surface-variant/40"
                        >
                          <span className="material-symbols-outlined text-[15px]">alt_route</span>
                          Standard Route
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Agent / Dispatch Card */}
            {msg.sender === 'agent' && msg.type === 'dispatch-card' && (
              <div className="flex items-start gap-2.5 pr-2">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-2xl rounded-tl-none shadow-md flex flex-col gap-2 flex-1 border border-surface-variant/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary-container">
                        assignment_turned_in
                      </span>
                      <span className="font-label-code text-[11px] text-primary-container font-semibold">
                        Civic Dispatch Complete
                      </span>
                    </div>
                    <span className="font-label-code text-[10px] text-on-surface-variant">07:19:02</span>
                  </div>
                  <p className="font-body-sm text-on-surface text-[12px] leading-relaxed">
                    Pothole detected near <span className="text-secondary font-medium">GST Road (KM 32.4)</span> — Autonomous payload routed directly to{' '}
                    <span className="text-primary font-medium">PWD Road Maintenance Dept</span>.
                  </p>
                  <div className="bg-surface-container p-2 rounded-xl flex items-center justify-between border border-surface-variant/40">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">receipt_long</span>
                      <span className="font-label-code text-[11px] text-on-surface font-bold">
                        Ticket {ticketData.code}
                      </span>
                    </div>
                    <span className="font-label-code text-[10px] bg-secondary-container/20 text-secondary px-2 py-0.5 rounded">
                      Priority: P1 Critical • SLA 24h
                    </span>
                  </div>
                  <button
                    onClick={() => onTrackTicket(ticketData.code)}
                    className="w-full mt-1 h-9 rounded-lg bg-surface-container-high hover:bg-surface-bright text-secondary text-xs font-label-code font-bold flex items-center justify-center gap-1.5 border border-secondary/30 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    <span>Track Assigned Truck T-18 Corridor</span>
                  </button>
                </div>
              </div>
            )}

            {/* Agent / Regular Text */}
            {msg.sender === 'agent' && msg.type === 'text' && (
              <div className="flex items-start gap-2.5 pr-2">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <div className="bg-surface-container p-3.5 rounded-2xl rounded-tl-none shadow-md flex flex-col gap-1.5 flex-1 border border-surface-variant/40">
                  <div className="flex items-center justify-between">
                    <span className="font-label-code text-[10px] text-primary-container uppercase font-bold">
                      Swarm Orchestration
                    </span>
                    <span className="font-label-code text-[9px] text-on-surface-variant">Live Dispatch</span>
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface leading-relaxed">{msg.text}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 pl-10 text-on-surface-variant font-label-code text-[11px]">
            <span className="flex h-2 w-2 rounded-full bg-primary-container animate-pulse"></span>
            <span>Swarm agents coordinating cross-department dispatch...</span>
          </div>
        )}

        {/* Simulated Idle Cue */}
        {!isTyping && (
          <div className="flex items-center gap-2 pl-10 text-on-surface-variant font-label-code text-[10px]">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse"></span>
            <span>Orchestrator ready for next city command or query...</span>
          </div>
        )}
      </div>

      {/* Bottom Interactive Input Dock & Control Array */}
      <div className="fixed bottom-16 sm:bottom-20 inset-x-0 z-30 bg-[#0f131c]/95 backdrop-blur-xl px-4 pt-2.5 pb-2 flex flex-col gap-2 shadow-[0_-8px_24px_rgba(0,0,0,0.6)] border-t border-surface-variant/40 max-w-lg mx-auto">
        {/* Agent Filter Selector Bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            <span className="font-label-code text-[9px] uppercase text-on-surface-variant mr-1">Agent Mode:</span>
            <button
              onClick={() => setAgentMode('auto')}
              className={`px-2.5 py-0.5 rounded-full font-label-code text-[10px] transition-all ${
                agentMode === 'auto'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              Auto
            </button>
            <button
              onClick={() => setAgentMode('mobility')}
              className={`px-2.5 py-0.5 rounded-full font-label-code text-[10px] transition-all ${
                agentMode === 'mobility'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              Mobility
            </button>
            <button
              onClick={() => setAgentMode('civic')}
              className={`px-2.5 py-0.5 rounded-full font-label-code text-[10px] transition-all ${
                agentMode === 'civic'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              Civic
            </button>
            <button
              onClick={() => setAgentMode('services')}
              className={`px-2.5 py-0.5 rounded-full font-label-code text-[10px] transition-all ${
                agentMode === 'services'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              Services
            </button>
          </div>
          <button className="flex items-center gap-1 text-on-surface-variant hover:text-secondary text-[11px] font-label-code">
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>Filter</span>
          </button>
        </div>

        {/* Main Message Input Box */}
        <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-2xl shadow-lg border border-surface-variant/40">
          {/* Vision / Camera Trigger */}
          <button
            onClick={onNavigateToReport}
            className="w-10 h-10 rounded-xl bg-surface-container-high text-secondary hover:text-on-surface flex items-center justify-center shrink-0 active:scale-95 transition-all"
            title="Attach Vision Data / Camera"
          >
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          </button>
          {/* Voice Input Trigger */}
          <button
            onClick={() => handleSendPrompt("Speech input: check status of Potheri corridor and nearest wheelchair access")}
            className="w-10 h-10 rounded-xl bg-surface-container-high text-secondary hover:text-on-surface flex items-center justify-center shrink-0 active:scale-95 transition-all"
            title="Stream Audio Prompt"
          >
            <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
          </button>
          {/* Input Text Field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendPrompt();
            }}
            placeholder="Ask UrbanFlow about routes, complaints, services..."
            className="bg-transparent text-primary placeholder-on-surface-variant font-body-sm text-[13px] px-2 flex-1 outline-none min-w-0"
          />
          {/* Neon Green Command Send Button */}
          <button
            onClick={() => handleSendPrompt()}
            className="w-11 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,255,157,0.4)] active:scale-95 transition-all font-bold hover:brightness-105"
            title="Execute Query"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>

        {/* Sovereign Subtext */}
        <div className="flex items-center justify-between text-[9px] font-label-code text-on-surface-variant px-1">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[11px] text-primary-container">lock</span>
            End-to-End Cryptographic Civic Ledger
          </span>
          <span>Latency: 42ms • LoRaWAN Mesh</span>
        </div>
      </div>
    </div>
  );
};
