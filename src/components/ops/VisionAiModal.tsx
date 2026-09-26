import React, { useState } from 'react';
import { TicketSummary } from '../../types';
import { IMAGES } from '../../data/mockData';

interface VisionAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketSummary;
  onConfirmAssessment?: () => void;
}

export const VisionAiModal: React.FC<VisionAiModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onConfirmAssessment
}) => {
  const [activeTab, setActiveTab] = useState<'vision' | 'telemetry' | 'classification' | 'ledger'>('vision');
  const [showBounding, setShowBounding] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMesh, setShowMesh] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setConfirmed(true);
      if (onConfirmAssessment) onConfirmAssessment();
      setTimeout(() => {
        onClose();
        setConfirmed(false);
      }, 900);
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in text-on-surface"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-surface-container-low border border-primary-container/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,255,157,0.15)] overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-surface-container border-b border-surface-variant/40">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary-container/15 border border-primary-container/40 rounded">
              <span className="h-2 w-2 rounded-full bg-primary-container animate-ping"></span>
              <span className="font-label-code text-[11px] text-primary-fixed uppercase tracking-wider font-bold">
                NEURAL VISION ENGINE v4.2
              </span>
            </div>
            <div className="h-4 w-px bg-surface-variant hidden sm:block"></div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-sm sm:text-base text-primary font-bold">
                Forensic Telemetry: {ticket.code}
              </span>
              <span className="font-label-code text-[10px] text-error bg-error-container/30 px-1.5 py-0.5 rounded font-bold border border-error/30">
                {ticket.priority}
              </span>
            </div>
            <span className="font-label-telemetry text-xs text-secondary hidden md:inline font-mono">
              ● INFERENCE HASH: 0x8F92...B47C
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-label-code text-[10px] text-on-surface-variant hidden sm:inline">[ESC] to exit</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 bg-surface-container-lowest border-b border-surface-variant/40 overflow-x-auto text-xs font-label-code scrollbar-none">
          <button
            onClick={() => setActiveTab('vision')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vision'
                ? 'bg-surface-container-high text-primary-fixed border border-primary-container/40 font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-primary-container">view_in_ar</span>
            <span>Neural Bounding & Depth Heatmap</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'telemetry'
                ? 'bg-surface-container-high text-primary-fixed border border-primary-container/40 font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">sensors</span>
            <span>Sensor Telemetry & EXIF</span>
          </button>
          <button
            onClick={() => setActiveTab('classification')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'classification'
                ? 'bg-surface-container-high text-primary-fixed border border-primary-container/40 font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-primary-fixed">analytics</span>
            <span>AI Classification & Confidence</span>
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ledger'
                ? 'bg-surface-container-high text-primary-fixed border border-primary-container/40 font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">verified</span>
            <span>Autonomous Action Ledger</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 bg-surface space-y-4">
          {/* TAB 1: Neural Bounding & Depth Heatmap View */}
          {activeTab === 'vision' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Viewport Box (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-2">
                  <div className="relative w-full h-[320px] md:h-[400px] rounded-xl overflow-hidden bg-surface-container-lowest border border-surface-variant/40 shadow-inner select-none">
                    <img
                      alt="Raw asphalt crater input"
                      className="absolute inset-0 w-full h-full object-cover filter contrast-110 brightness-95"
                      src={IMAGES.potholeNightCyber}
                    />

                    {/* Laser Grid Layer */}
                    {showGrid && (
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.04)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
                    )}

                    {/* Depth Heatmap Layer */}
                    {showHeatmap && (
                      <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-90 transition-opacity">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 480">
                          <defs>
                            <radialGradient id="craterHeat" cx="53%" cy="63%" r="28%" fx="53%" fy="63%">
                              <stop offset="0%" stopColor="#ff0055" stopOpacity="0.85" />
                              <stop offset="35%" stopColor="#ff7b00" stopOpacity="0.65" />
                              <stop offset="70%" stopColor="#00e5ff" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#00ff9d" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                          <ellipse cx="430" cy="300" rx="180" ry="95" fill="url(#craterHeat)" />
                        </svg>
                      </div>
                    )}

                    {/* Contour Mesh Layer */}
                    {showMesh && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-95 transition-opacity" preserveAspectRatio="none" viewBox="0 0 800 480">
                        <ellipse cx="430" cy="300" rx="190" ry="105" fill="none" stroke="#00FF9D" strokeWidth="1" strokeDasharray="3 3" />
                        <ellipse cx="432" cy="304" rx="145" ry="78" fill="none" stroke="#4CD7F6" strokeWidth="1.5" />
                        <ellipse cx="435" cy="308" rx="95" ry="50" fill="none" stroke="#FFB4AB" strokeWidth="2" />
                        <ellipse cx="436" cy="312" rx="48" ry="25" fill="#FF5252" fillOpacity="0.25" stroke="#FF5252" strokeWidth="2.5" />
                        <line x1="436" y1="200" x2="436" y2="400" stroke="#00FF9D" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.6" />
                        <line x1="260" y1="312" x2="610" y2="312" stroke="#00FF9D" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.6" />
                        <text x="445" y="240" fill="#00FF9D" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold">
                          Z-DEPTH: -14.2 CM (CRITICAL)
                        </text>
                        <text x="445" y="256" fill="#4CD7F6" fontFamily="JetBrains Mono" fontSize="10">
                          WIDTH: 84 CM | RADIUS: 42 CM
                        </text>
                        <text x="445" y="272" fill="#DFE2EE" fontFamily="JetBrains Mono" fontSize="9">
                          ASPHALT LOSS VOL: ~0.048 m³
                        </text>
                      </svg>
                    )}

                    {/* Bounding Box Overlay */}
                    {showBounding && (
                      <div className="absolute left-[31%] top-[39%] w-[48%] h-[48%] rounded-xl border-2 border-primary-container shadow-[0_0_15px_rgba(0,255,157,0.6)] flex flex-col justify-between p-2 pointer-events-none transition-opacity">
                        <div className="flex items-center justify-between">
                          <span className="font-label-code text-[10px] bg-primary-container text-on-primary-container font-black px-1.5 py-0.5 rounded shadow">
                            OBJECT: ASPHALT_CRATER_SEV
                          </span>
                          <span className="font-label-telemetry text-[11px] bg-surface-container-lowest/90 text-primary-fixed border border-primary-container/40 px-1.5 py-0.5 rounded font-bold font-mono">
                            CONF: 94.2%
                          </span>
                        </div>
                        <div className="flex items-end justify-between font-label-code text-[9px] text-secondary">
                          <span>SECTOR 04-S</span>
                          <span>VOL_EST: 48,200 cm³</span>
                        </div>
                      </div>
                    )}

                    {/* Overlays Badges */}
                    <div className="absolute top-3 left-3 bg-surface-container-high/90 backdrop-blur-md border border-surface-variant/40 px-2 py-1 rounded font-label-code text-[10px] flex items-center gap-1.5 text-primary-fixed pointer-events-none">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse"></span>
                      <span>LIVE FRAME: #1042-RAW-4K</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-surface-container-high/90 backdrop-blur-md border border-surface-variant/40 px-2 py-1 rounded font-label-telemetry text-[10px] text-secondary flex items-center gap-1 pointer-events-none font-mono">
                      <span className="material-symbols-outlined text-[13px]">speed</span>
                      <span>EDGE LATENCY: 42ms (NVIDIA JETSON)</span>
                    </div>
                  </div>

                  {/* Viewport Layer Quick Toggles */}
                  <div className="flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-xl border border-surface-variant/30 flex-wrap gap-2">
                    <span className="font-label-code text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">layers</span> Overlay Controls:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setShowBounding(!showBounding)}
                        className={`px-2 py-1 rounded font-label-code text-[11px] font-bold flex items-center gap-1 transition-all ${
                          showBounding ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {showBounding ? 'check' : 'close'}
                        </span>
                        Bounding Box
                      </button>
                      <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`px-2 py-1 rounded font-label-code text-[11px] font-bold flex items-center gap-1 transition-all ${
                          showHeatmap ? 'bg-secondary text-surface' : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {showHeatmap ? 'check' : 'close'}
                        </span>
                        Depth Heatmap
                      </button>
                      <button
                        onClick={() => setShowMesh(!showMesh)}
                        className={`px-2 py-1 rounded font-label-code text-[11px] font-bold flex items-center gap-1 transition-all ${
                          showMesh ? 'bg-primary-fixed-dim text-on-primary-fixed-variant' : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {showMesh ? 'check' : 'close'}
                        </span>
                        14cm Contour Mesh
                      </button>
                      <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`px-2 py-1 rounded font-label-code text-[11px] font-bold flex items-center gap-1 transition-all ${
                          showGrid ? 'bg-surface-bright text-on-surface' : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">grid_4x4</span>
                        Laser Grid
                      </button>
                    </div>
                  </div>
                </div>

                {/* Telemetry Summary Rail (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                  {/* Severity Card */}
                  <div className="bg-surface-container rounded-xl p-3 border border-error/30 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-xs uppercase tracking-wider text-error font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">warning</span> Severity Verdict
                      </span>
                      <span className="font-label-code text-[10px] bg-error text-on-error px-1.5 py-0.5 rounded font-bold">
                        24H SLA TIER 1
                      </span>
                    </div>
                    <p className="font-headline-sm text-sm text-primary font-bold">Road Surface Crater Severe</p>
                    <p className="font-body-sm text-on-surface-variant text-[12px] leading-relaxed">
                      Crater exceeds 12cm threshold (measured: 14.2cm). Poses immediate rollover risk for 2-wheelers and heavy vehicle axle fatigue on GST Road down-ramp.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-surface-variant/40">
                      <div className="flex flex-col">
                        <span className="font-label-code text-[10px] text-on-surface-variant">MEASURED DEPTH</span>
                        <span className="font-label-telemetry text-base text-error font-bold font-mono">14.2 cm</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-code text-[10px] text-on-surface-variant">TRAFFIC VOL</span>
                        <span className="font-label-telemetry text-base text-secondary font-bold font-mono">3,820 v/hr</span>
                      </div>
                    </div>
                  </div>

                  {/* Geospatial Anchor */}
                  <div className="bg-surface-container rounded-xl p-3 border border-surface-variant/40 flex flex-col gap-2 text-xs">
                    <span className="font-label-code text-xs uppercase tracking-wider text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">pin_drop</span> Geospatial Anchor
                    </span>
                    <div className="space-y-1.5 font-label-telemetry text-[11px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Coordinates:</span>
                        <span className="text-primary-fixed">12.8231° N, 80.0452° E</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Corridor / KM:</span>
                        <span className="text-on-surface">GST Rd KM 32.4 (Potheri)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Ingest Time:</span>
                        <span className="text-on-surface">07:19:02 UTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Assigned Unit:</span>
                        <span className="text-primary-fixed font-bold">PWD Taskforce #4 (T-18)</span>
                      </div>
                    </div>
                  </div>

                  {/* Swarm Auto-Action Status */}
                  <div className="bg-surface-container-high rounded-xl p-3 border border-primary-container/30 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-xs text-primary-fixed font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">smart_toy</span> Autonomous Swarm
                      </span>
                      <span className="font-label-telemetry text-[10px] text-primary-container">AUTONOMOUS OK</span>
                    </div>
                    <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                      Taskforce #4 mobilized with Cold-Patch Mix B-22. Auto-notified citizen ticket creator #CIT-9921 via SMS/App.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Sensor Telemetry & EXIF */}
          {activeTab === 'telemetry' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/40 flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-surface-variant/40 pb-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">photo_camera</span>
                  <h4 className="font-headline-sm text-sm text-primary font-bold">
                    Vision Sensor & Optical Hardware EXIF
                  </h4>
                </div>
                <div className="space-y-2 font-label-telemetry text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-surface-variant/20">
                    <span className="text-on-surface-variant">Optic Sensor Module:</span>
                    <span className="text-primary-fixed">Sony Exmor IMX586 48MP Quad-Bayer</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-variant/20">
                    <span className="text-on-surface-variant">Focal Length & Aperture:</span>
                    <span className="text-on-surface">26mm equiv. • f/1.79 Aperture</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-variant/20">
                    <span className="text-on-surface-variant">Exposure & ISO:</span>
                    <span className="text-on-surface">1/250 sec • ISO 100 • Evaluative Metering</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-variant/20">
                    <span className="text-on-surface-variant">Capture Resolution:</span>
                    <span className="text-on-surface">4000 x 3000 px RAW (Downsampled 4K)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-on-surface-variant">LiDAR / ToF Assist:</span>
                    <span className="text-secondary font-bold">Dual VCSEL Time-of-Flight Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/40 flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-surface-variant/40 pb-2">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">memory</span>
                  <h4 className="font-headline-sm text-sm text-primary font-bold">
                    Edge Inference & LoRa Mesh Telemetry
                  </h4>
                </div>
                <div className="space-y-2 font-label-telemetry text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-surface-variant/20">
                    <span className="text-on-surface-variant">Inference Hardware:</span>
                    <span className="text-primary-container font-bold">NVIDIA Jetson Orin Nano (40 TOPS)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-variant/20">
                    <span className="text-on-surface-variant">Inference Latency:</span>
                    <span className="text-secondary font-bold">42 ms (FP16 Quantized TensorRT)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-variant/20">
                    <span className="text-on-surface-variant">Gateway Node ID:</span>
                    <span className="text-on-surface">LoRaWAN-GW-KTR-09 (Ch. 868.1 MHz)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-variant/20">
                    <span className="text-on-surface-variant">Mesh RSSI / SNR:</span>
                    <span className="text-primary-fixed">-82 dBm / +9.4 dB (Optimal Link)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-on-surface-variant">GPS Lock Status:</span>
                    <span className="text-secondary">RTK High Precision (3cm error radius)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI Classification & Confidence */}
          {activeTab === 'classification' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 bg-surface-container p-4 rounded-xl border border-surface-variant/40 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-surface-variant/40 pb-2">
                  <h4 className="font-headline-sm text-sm text-primary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">psychology</span>
                    Multi-Class Probability Distribution
                  </h4>
                  <span className="font-label-code text-[11px] text-secondary">Model: UrbanNet-V4.2</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-label-code">
                    <span className="text-primary font-bold">1. Road Surface Crater (Severe &gt;10cm)</span>
                    <span className="text-primary-container font-mono font-bold">94.2%</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-highest rounded overflow-hidden">
                    <div className="h-full bg-primary-container rounded shadow-[0_0_8px_rgba(0,255,157,0.5)]" style={{ width: '94.2%' }}></div>
                  </div>
                  <span className="font-label-telemetry text-[11px] text-on-surface-variant">
                    Verified by 3 consecutive frame inferences + depth contour analysis
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-label-code">
                    <span className="text-on-surface">2. Sub-surface Water Infiltration / Pooling</span>
                    <span className="text-secondary font-mono font-bold">4.1%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded overflow-hidden">
                    <div className="h-full bg-secondary rounded" style={{ width: '4.1%' }}></div>
                  </div>
                  <span className="font-label-telemetry text-[11px] text-on-surface-variant">
                    Low reflectance indicates minor residual moisture at crater base
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-label-code">
                    <span className="text-on-surface">3. Alligator Cracking & Asphalt Wear</span>
                    <span className="text-tertiary-fixed-dim font-mono font-bold">1.7%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded overflow-hidden">
                    <div className="h-full bg-tertiary-fixed-dim rounded" style={{ width: '1.7%' }}></div>
                  </div>
                  <span className="font-label-telemetry text-[11px] text-on-surface-variant">
                    Fringes present minor perimeter fissures
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-surface-container p-4 rounded-xl border border-surface-variant/40 flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-surface-variant/40 pb-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">rule</span>
                  <h4 className="font-headline-sm text-sm text-primary font-bold">Triage Orchestrator Rule Engine</h4>
                </div>
                <div className="space-y-2 text-xs font-body-sm">
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-error/30 flex items-start gap-2">
                    <span className="material-symbols-outlined text-error text-[18px] mt-0.5">priority_high</span>
                    <div>
                      <span className="font-bold text-error font-label-code">TRIGGER: P1 CRITICAL DISPATCH</span>
                      <p className="text-on-surface-variant text-[11px] mt-0.5">
                        Depth &gt; 10cm on Arterial Corridors automates immediate unit routing without commissioner approval wait.
                      </p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-variant/30 flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary-fixed text-[18px] mt-0.5">check_circle</span>
                    <div>
                      <span className="font-bold text-primary-fixed font-label-code">SLA WINDOW: 24 HOURS</span>
                      <p className="text-on-surface-variant text-[11px] mt-0.5">
                        Target repair time: 4 hours. Hard regulatory breach threshold: 24h.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Autonomous Action Ledger */}
          {activeTab === 'ledger' && (
            <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/40 flex flex-col gap-3 font-label-code">
              <div className="flex items-center justify-between border-b border-surface-variant/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">history_edu</span>
                  <h4 className="font-headline-sm text-sm text-primary font-bold">Cryptographically Signed Action Ledger</h4>
                </div>
                <span className="font-label-telemetry text-xs text-secondary font-mono">LEDGER BLOCK #849,201</span>
              </div>
              <div className="space-y-2.5 font-label-telemetry text-xs pt-1">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-container-low border-l-4 border-primary-container">
                  <span className="text-secondary font-bold whitespace-nowrap">07:19:02 UTC</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-primary font-semibold">[SWARM INGEST] Image received from Citizen Vision Portal (#CIT-9921)</span>
                    <span className="text-on-surface-variant text-[11px] font-mono">
                      Hash: <strong className="text-primary-fixed">0x8F92A144E391BC02</strong> • Inference Confirmed (94.2%)
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-container-low border-l-4 border-secondary">
                  <span className="text-secondary font-bold whitespace-nowrap">07:19:05 UTC</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-primary font-semibold">[TRAFFIC AGENT] VMS Matrix Display updated on GST Rd KM 31.0</span>
                    <span className="text-on-surface-variant text-[11px]">Lane 3 diversion advisory active • Bus #105 rerouted</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-container-low border-l-4 border-primary-fixed">
                  <span className="text-secondary font-bold whitespace-nowrap">07:20:44 UTC</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-primary font-semibold">[FIELD DISPATCH] PWD Taskforce #4 (Truck T-18) Dispatched</span>
                    <span className="text-on-surface-variant text-[11px]">Driver acknowledged receipt • 500kg Cold-Patch Compound loaded</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-container-low border-l-4 border-tertiary-fixed-dim">
                  <span className="text-secondary font-bold whitespace-nowrap">07:21:10 UTC</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-primary font-semibold">[CITIZEN BROADCAST] SMS & Mobile Push Sent to Citizen Ingest</span>
                    <span className="text-on-surface-variant text-[11px]">Ticket #UF-2026-1042 live tracker link transmitted</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* High-Tech Bottom Action Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-surface-container border-t border-surface-variant/40 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-container animate-ping"></span>
            <span className="font-label-code text-xs text-on-surface-variant">
              AI Recommendation: <strong className="text-primary-fixed">Maintain P1 Dispatch</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => alert('Forensic Telemetry PDF compiled with cryptographic hash 0x8F92...B47C')}
              className="px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-secondary font-label-code text-xs transition-colors flex items-center gap-1.5 border border-surface-variant/40"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Download Forensic Report</span>
            </button>
            <button
              onClick={() => alert('Override Mode Enabled: Operator adjustments to bounding box unlocked.')}
              className="px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-code text-xs transition-colors flex items-center gap-1.5 border border-surface-variant/40"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Adjust Box / Override</span>
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirming || confirmed}
              className={`px-4 py-2 rounded-xl font-label-code text-xs font-bold transition-all flex items-center gap-1.5 ${
                confirmed
                  ? 'bg-surface-container-high text-primary-container border border-primary-container'
                  : 'bg-primary-container text-on-primary-container hover:bg-primary-fixed shadow-[0_0_16px_rgba(0,255,157,0.4)]'
              }`}
            >
              <span className={`material-symbols-outlined text-[17px] ${isConfirming ? 'animate-spin' : ''}`}>
                {isConfirming ? 'sync' : confirmed ? 'task_alt' : 'verified'}
              </span>
              <span>{isConfirming ? 'Logging...' : confirmed ? 'Confirmed & Dispatched' : 'Confirm AI Assessment & Priority'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
