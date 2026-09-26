import React, { useState, useMemo, useRef } from 'react';
import { TicketSummary } from '../../types';
import { IMAGES } from '../../data/mockData';

export interface GisMapProps {
  tickets: TicketSummary[];
  selectedTicketId?: string;
  onSelectTicket: (ticket: TicketSummary) => void;
  onOpenVisionModal?: (ticket: TicketSummary) => void;
  onOpenNotifyModal?: (ticket: TicketSummary) => void;
  onNavigateToTruckCorridor?: () => void;
  activeLayer?: 'heatmap' | 'crews' | 'potholes' | 'elevators' | 'all';
  onLayerChange?: (layer: 'heatmap' | 'crews' | 'potholes' | 'elevators') => void;
}

// Bounding box for Chennai - Kanchipuram corridor
const DEFAULT_BOUNDS = {
  minLat: 12.80,
  maxLat: 12.98,
  minLng: 80.02,
  maxLng: 80.18,
};

export const GisMap: React.FC<GisMapProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onOpenVisionModal,
  onOpenNotifyModal,
  onNavigateToTruckCorridor,
  activeLayer = 'all',
  onLayerChange
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredTicket, setHoveredTicket] = useState<TicketSummary | null>(null);
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lng: string }>({
    lat: '12.8231° N',
    lng: '80.0452° E'
  });
  const [localActiveLayer, setLocalActiveLayer] = useState<'heatmap' | 'crews' | 'potholes' | 'elevators'>('heatmap');
  const [showPopup, setShowPopup] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const currentLayer = onLayerChange ? (activeLayer === 'all' ? localActiveLayer : activeLayer) : localActiveLayer;

  // Compute bounding box from tickets or fallback to default
  const bounds = useMemo(() => {
    if (!tickets || tickets.length === 0) return DEFAULT_BOUNDS;
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    tickets.forEach(t => {
      const lat = t.coordinates?.lat;
      const lng = t.coordinates?.lng;
      if (typeof lat === 'number' && typeof lng === 'number') {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      }
    });

    // Provide padding around bounds
    const latPadding = Math.max((maxLat - minLat) * 0.25, 0.04);
    const lngPadding = Math.max((maxLng - minLng) * 0.25, 0.04);

    return {
      minLat: minLat === Infinity ? DEFAULT_BOUNDS.minLat : minLat - latPadding,
      maxLat: maxLat === -Infinity ? DEFAULT_BOUNDS.maxLat : maxLat + latPadding,
      minLng: minLng === Infinity ? DEFAULT_BOUNDS.minLng : minLng - lngPadding,
      maxLng: maxLng === -Infinity ? DEFAULT_BOUNDS.maxLng : maxLng + lngPadding,
    };
  }, [tickets]);

  // Project geographic coordinates into container percentage (x%, y%)
  const projectToPct = (lat?: number, lng?: number) => {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return { x: 50, y: 50 };
    }
    const clampedLat = Math.max(bounds.minLat, Math.min(bounds.maxLat, lat));
    const clampedLng = Math.max(bounds.minLng, Math.min(bounds.maxLng, lng));

    // Longitude maps to X axis (left to right)
    const x = ((clampedLng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 80 + 10;
    // Latitude maps to Y axis (top to bottom is inverted: higher lat is further north/up)
    const y = ((bounds.maxLat - clampedLat) / (bounds.maxLat - bounds.minLat)) * 74 + 13;

    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(10, Math.min(90, y))
    };
  };

  // Find currently selected ticket
  const activeTicket = useMemo(() => {
    if (!selectedTicketId) return tickets[0];
    return tickets.find(t => t.id === selectedTicketId) || tickets[0];
  }, [tickets, selectedTicketId]);

  // Handle mouse move to simulate tactical GIS cursor telemetry
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    const lat = bounds.maxLat - yRatio * (bounds.maxLat - bounds.minLat);
    const lng = bounds.minLng + xRatio * (bounds.maxLng - bounds.minLng);

    setCursorCoords({
      lat: `${lat.toFixed(4)}° N`,
      lng: `${lng.toFixed(4)}° E`
    });
  };

  const handleMarkerClick = (ticket: TicketSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectTicket(ticket);
    setShowPopup(true);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      if (direction === 'in') return Math.min(prev + 0.25, 2.0);
      return Math.max(prev - 0.25, 0.75);
    });
  };

  const handleRecenter = () => {
    setZoomLevel(1);
    if (tickets[0]) {
      onSelectTicket(tickets[0]);
      setShowPopup(true);
    }
  };

  // Marker icon and color mapper based on ticket priority and category
  const getMarkerStyle = (ticket: TicketSummary, isSelected: boolean) => {
    const isP1 = ticket.priority.includes('P1');
    const isResolved = ticket.status === 'RESOLVED';
    const isRepair = ticket.status === 'IN REPAIR';

    let color = '#4cd7f6'; // default secondary cyan
    let borderColor = 'border-secondary/40';
    let pulseColor = 'bg-secondary';

    if (isResolved) {
      color = '#00ff9d';
      borderColor = 'border-primary-container/40';
      pulseColor = 'bg-primary-container';
    } else if (isP1) {
      color = '#ef4444';
      borderColor = 'border-error/50';
      pulseColor = 'bg-error';
    } else if (isRepair) {
      color = '#f59e0b';
      borderColor = 'border-amber-400/50';
      pulseColor = 'bg-amber-400';
    }

    return { color, borderColor, pulseColor, isP1 };
  };

  const activePos = activeTicket ? projectToPct(activeTicket.coordinates?.lat, activeTicket.coordinates?.lng) : { x: 39, y: 54 };

  return (
    <div
      ref={mapContainerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[440px] sm:h-[480px] bg-[#090d16] overflow-hidden rounded-2xl select-none group border border-surface-variant/40 shadow-2xl"
    >
      {/* 1. Satellite Base Texture */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 mix-blend-luminosity filter contrast-125 brightness-90 transition-transform duration-500 ease-out"
        style={{
          backgroundImage: `url('${IMAGES.mapSatGst}')`,
          transform: `scale(${zoomLevel})`,
          transformOrigin: `${activePos.x}% ${activePos.y}%`
        }}
      ></div>

      {/* 2. Tactical GIS Dot Matrix Grid */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #4cd7f6 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* 3. Vector Highways, Metro Arterials & Sector Concentrics */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-500 ease-out"
        preserveAspectRatio="none"
        viewBox="0 0 700 480"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: `${activePos.x}% ${activePos.y}%`
        }}
      >
        {/* Radial Radar Scanning Arc */}
        <circle cx="350" cy="240" r="180" fill="none" stroke="#4cd7f6" strokeWidth="0.8" strokeDasharray="6 6" strokeOpacity="0.25" />
        <circle cx="350" cy="240" r="280" fill="none" stroke="#4cd7f6" strokeWidth="0.8" strokeDasharray="8 8" strokeOpacity="0.15" />
        
        {/* Arterial Corridor: GST Road Highway Spine */}
        <path
          d="M 40,430 L 150,350 L 270,270 L 420,180 L 560,110 L 660,50"
          fill="none"
          stroke="#06B6D4"
          strokeWidth="6"
          strokeDasharray="10 5"
          strokeOpacity="0.4"
        />
        <path
          d="M 40,430 L 150,350 L 270,270 L 420,180 L 560,110 L 660,50"
          fill="none"
          stroke="#00FF9D"
          strokeWidth="2"
          strokeOpacity="0.85"
        />

        {/* Secondary Arterials */}
        <path d="M 150,350 L 240,430 L 380,440" fill="none" stroke="#4cd7f6" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
        <path d="M 420,180 L 490,260 L 640,300" fill="none" stroke="#4cd7f6" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />

        {/* Concentric Reticle Focus on Active Ticket */}
        {activeTicket && (
          <g transform={`translate(${activePos.x * 7}, ${activePos.y * 4.8})`}>
            <circle cx="0" cy="0" r="32" fill="none" stroke="#00FF9D" strokeWidth="1" strokeDasharray="4 2" className="animate-spin" style={{ animationDuration: '8s' }} />
            <circle cx="0" cy="0" r="22" fill="#00FF9D" fillOpacity="0.08" />
            <line x1="-38" y1="0" x2="-26" y2="0" stroke="#00FF9D" strokeWidth="2" />
            <line x1="26" y1="0" x2="38" y2="0" stroke="#00FF9D" strokeWidth="2" />
            <line x1="0" y1="-38" x2="0" y2="-26" stroke="#00FF9D" strokeWidth="2" />
            <line x1="0" y1="26" x2="0" y2="38" stroke="#00FF9D" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* 4. Thermal / Heatmap Layer (Zones of reported road anomalies) */}
      {(currentLayer === 'heatmap' || activeLayer === 'all') && (
        <div className="absolute inset-0 pointer-events-none">
          {tickets.map(t => {
            const { x, y } = projectToPct(t.coordinates?.lat, t.coordinates?.lng);
            const isP1 = t.priority.includes('P1');
            return (
              <div
                key={`heat-${t.id}`}
                className="absolute rounded-full filter blur-2xl transform -translate-x-1/2 -translate-y-1/2 opacity-40 transition-all duration-700"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: isP1 ? '160px' : '110px',
                  height: isP1 ? '160px' : '110px',
                  background: isP1
                    ? 'radial-gradient(circle, rgba(239, 68, 68, 0.8) 0%, rgba(245, 158, 11, 0.3) 50%, transparent 80%)'
                    : 'radial-gradient(circle, rgba(76, 215, 246, 0.7) 0%, rgba(0, 255, 157, 0.25) 50%, transparent 80%)'
                }}
              />
            );
          })}
        </div>
      )}

      {/* 5. Mobile Fleet Units (Truck T-18 & Utility Shuttles) */}
      {(currentLayer === 'crews' || activeLayer === 'all') && (
        <div
          onClick={onNavigateToTruckCorridor}
          className="absolute z-20 flex flex-col items-center cursor-pointer group/unit transition-transform hover:scale-110"
          style={{ left: '31%', top: '64%', transform: 'translate(-50%, -50%)' }}
          title="Field Unit T-18: Active En Route (Click to inspect corridor)"
        >
          <div className="relative">
            <span className="animate-ping absolute inset-0 rounded-full bg-secondary opacity-60"></span>
            <div className="h-7 w-7 rounded-full bg-secondary text-surface-container-lowest flex items-center justify-center shadow-lg border border-secondary font-bold">
              <span className="material-symbols-outlined text-[15px]">local_shipping</span>
            </div>
          </div>
          <span className="mt-1 px-1.5 py-0.5 bg-surface-container-lowest/90 backdrop-blur-md text-secondary font-label-code text-[9px] rounded font-bold border border-secondary/40 shadow">
            UNIT T-18 • 42 KM/H
          </span>
        </div>
      )}

      {/* 6. Active Ticket Coordinate Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {tickets.map(ticket => {
          const { x, y } = projectToPct(ticket.coordinates?.lat, ticket.coordinates?.lng);
          const isSelected = activeTicket?.id === ticket.id;
          const { color, borderColor, pulseColor, isP1 } = getMarkerStyle(ticket, isSelected);

          // Get category icon
          let icon = 'report_problem';
          if (ticket.category.includes('Drain')) icon = 'water_damage';
          else if (ticket.category.includes('Light') || ticket.category.includes('Electrical')) icon = 'wb_incandescent';
          else if (ticket.category.includes('Access') || ticket.category.includes('Ramp')) icon = 'accessible_forward';

          return (
            <div
              key={ticket.id}
              onClick={(e) => handleMarkerClick(ticket, e)}
              onMouseEnter={() => setHoveredTicket(ticket)}
              onMouseLeave={() => setHoveredTicket(null)}
              className="absolute z-25 pointer-events-auto cursor-pointer transition-transform duration-200"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) scale(${isSelected ? 1.25 : 1})`
              }}
            >
              <div className="relative flex items-center justify-center group/marker">
                {/* Pulsing Aura */}
                {(isP1 || isSelected) && (
                  <span
                    className={`animate-ping absolute inline-flex h-9 w-9 rounded-full ${pulseColor} opacity-70`}
                  ></span>
                )}

                {/* Marker Body */}
                <div
                  className={`relative flex items-center justify-center rounded-full shadow-2xl transition-all ${
                    isSelected
                      ? 'w-8 h-8 ring-4 ring-primary-container shadow-[0_0_20px_#00ff9d]'
                      : 'w-7 h-7 hover:scale-115'
                  }`}
                  style={{
                    backgroundColor: isSelected ? '#00ff9d' : color,
                    color: '#090d16'
                  }}
                >
                  <span className="material-symbols-outlined text-[17px] font-black">
                    {icon}
                  </span>
                </div>

                {/* Floating Micro-Badge */}
                <div className="absolute -bottom-4 px-1.5 py-0.2 rounded bg-surface-container-lowest/90 backdrop-blur-md font-label-telemetry text-[9px] font-bold text-on-surface whitespace-nowrap border border-surface-variant/40 shadow">
                  {ticket.code.replace('#UF-2026-', '')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7. Interactive Focus Popup for Selected Ticket */}
      {showPopup && activeTicket && (
        <div
          className="absolute z-40 bg-surface-container-high/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-primary-container/40 flex flex-col gap-2 max-w-[320px] w-full animate-in fade-in zoom-in-95 pointer-events-auto"
          style={{
            left: `${Math.min(Math.max(activePos.x, 22), 78)}%`,
            top: activePos.y > 55 ? `${activePos.y - 12}%` : `${activePos.y + 16}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b border-surface-variant/40 pb-1.5">
            <div className="flex items-center gap-1.5">
              <span
                className={`px-1.5 py-0.2 rounded font-label-code text-[10px] font-bold uppercase ${
                  activeTicket.priority.includes('P1')
                    ? 'bg-error-container text-on-error border border-error/40'
                    : 'bg-secondary-container/30 text-secondary border border-secondary/30'
                }`}
              >
                {activeTicket.priority}
              </span>
              <span className="font-label-telemetry text-xs text-primary font-mono font-bold">
                {activeTicket.code}
              </span>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="text-on-surface-variant hover:text-on-surface p-0.5 rounded"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          {/* Ticket Title & Location */}
          <div className="flex flex-col">
            <span className="font-headline-sm text-xs sm:text-sm text-primary font-bold leading-snug">
              {activeTicket.title}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-on-surface-variant mt-0.5 truncate">
              <span className="material-symbols-outlined text-[14px] text-secondary shrink-0">location_on</span>
              <span className="truncate">{activeTicket.location}</span>
            </div>
          </div>

          {/* GPS Coordinates & SLA Readout */}
          <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-surface-container-lowest font-label-code text-[10px] border border-surface-variant/30">
            <div>
              <span className="text-on-surface-variant block uppercase">GPS Fix</span>
              <span className="text-secondary font-mono">
                {activeTicket.coordinates ? `${activeTicket.coordinates.lat.toFixed(4)}°, ${activeTicket.coordinates.lng.toFixed(4)}°` : '12.8231°, 80.0452°'}
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant block uppercase">SLA Window</span>
              <span className="text-primary-container font-mono font-bold">
                {activeTicket.slaRemaining}
              </span>
            </div>
          </div>

          {/* Crew Info */}
          <div className="flex items-center justify-between text-[11px] font-body-sm text-on-surface">
            <span className="text-on-surface-variant">Unit: {activeTicket.assignedVehicle}</span>
            <span className="text-primary-fixed font-semibold">{activeTicket.assignedCrew}</span>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-surface-variant/30">
            <button
              onClick={() => onOpenVisionModal && onOpenVisionModal(activeTicket)}
              className="h-8 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary-fixed font-label-code text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              <span>Inspect Vision</span>
            </button>
            <button
              onClick={() => onNavigateToTruckCorridor && onNavigateToTruckCorridor()}
              className="h-8 rounded-lg bg-surface-container hover:bg-surface-bright text-secondary font-label-code text-[11px] font-semibold flex items-center justify-center gap-1 transition-all border border-surface-variant/40 active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
              <span>Track Fleet</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. Top-Left Live Sensor Coordinates HUD */}
      <div className="absolute top-3 left-3 bg-surface-container-lowest/85 backdrop-blur-md p-2.5 rounded-xl font-label-code text-[11px] flex flex-col gap-0.5 pointer-events-none border border-surface-variant/40 font-mono shadow-xl z-20">
        <div className="text-secondary font-bold flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          <span>SECTOR 04-S GIS TELEMETRY</span>
        </div>
        <div className="text-on-surface-variant">CURSOR: {cursorCoords.lat}, {cursorCoords.lng}</div>
        <div className="text-primary-fixed flex items-center gap-1">
          <span>ACTIVE PINS: {tickets.length}</span>
          <span>•</span>
          <span className="text-secondary">SELECTED: {activeTicket?.code || 'NONE'}</span>
        </div>
      </div>

      {/* 9. Top-Right Layer Toggle Bar */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-surface-container-lowest/85 backdrop-blur-md p-1 rounded-xl border border-surface-variant/40 shadow-xl z-20">
        <button
          onClick={() => {
            setLocalActiveLayer('heatmap');
            if (onLayerChange) onLayerChange('heatmap');
          }}
          className={`px-2 py-1 rounded-lg font-label-code text-[10px] flex items-center gap-1 transition-all ${
            currentLayer === 'heatmap'
              ? 'bg-secondary/25 text-secondary font-bold border border-secondary/40'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="Toggle Thermal Heatmap"
        >
          <span className="material-symbols-outlined text-[13px]">layers</span>
          <span className="hidden sm:inline">Heatmap</span>
        </button>

        <button
          onClick={() => {
            setLocalActiveLayer('potholes');
            if (onLayerChange) onLayerChange('potholes');
          }}
          className={`px-2 py-1 rounded-lg font-label-code text-[10px] flex items-center gap-1 transition-all ${
            currentLayer === 'potholes'
              ? 'bg-secondary/25 text-secondary font-bold border border-secondary/40'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="Toggle Hazard Markers"
        >
          <span className="material-symbols-outlined text-[13px]">report_problem</span>
          <span className="hidden sm:inline">Hazards</span>
        </button>

        <button
          onClick={() => {
            setLocalActiveLayer('crews');
            if (onLayerChange) onLayerChange('crews');
          }}
          className={`px-2 py-1 rounded-lg font-label-code text-[10px] flex items-center gap-1 transition-all ${
            currentLayer === 'crews'
              ? 'bg-secondary/25 text-secondary font-bold border border-secondary/40'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="Toggle Fleet Crews GPS"
        >
          <span className="material-symbols-outlined text-[13px]">local_shipping</span>
          <span className="hidden sm:inline">Fleet</span>
        </button>
      </div>

      {/* 10. Bottom-Right Navigation & Zoom Controls */}
      <div className="absolute right-3 bottom-3 flex flex-col gap-1.5 shadow-xl z-20">
        <button
          onClick={() => handleZoom('in')}
          className="w-8 h-8 rounded-lg bg-surface-container-high/90 hover:bg-surface-bright text-on-surface flex items-center justify-center text-sm font-bold border border-surface-variant/40 transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="w-8 h-8 rounded-lg bg-surface-container-high/90 hover:bg-surface-bright text-on-surface flex items-center justify-center text-sm font-bold border border-surface-variant/40 transition-colors"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={handleRecenter}
          className="w-8 h-8 rounded-lg bg-surface-container-high/90 hover:bg-surface-bright text-secondary flex items-center justify-center border border-surface-variant/40 transition-colors"
          title="Fit All & Recenter"
        >
          <span className="material-symbols-outlined text-[16px]">my_location</span>
        </button>
      </div>

      {/* 11. Bottom Compass Bearing Indicator */}
      <div className="absolute left-3 bottom-3 flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-1 rounded-lg font-label-telemetry text-[10px] text-on-surface-variant font-mono border border-surface-variant/40 z-20">
        <span className="text-secondary font-bold">N ▲</span>
        <span>CORRIDOR BEARING: 034°</span>
        <span className="text-primary-container">● SYNCED</span>
      </div>
    </div>
  );
};
