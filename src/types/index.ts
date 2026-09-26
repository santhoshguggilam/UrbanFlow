export type AppViewMode = 'citizen' | 'ops';
export type CitizenTab = 'pulse' | 'ai-core' | 'mobility' | 'report' | 'karma';
export type OpsNavTab = 
  | 'gis-matrix' 
  | 'incident-triage' 
  | 'field-crews' 
  | 'transit-grid' 
  | 'sla-analytics' 
  | 'orchestrator-rules';

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'citizen' | 'admin' | 'field_lead' | 'traffic_lead';
  karma: number;
  level: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  userId: string;
  viewMode: AppViewMode;
  accessibilityMode: boolean;
  elevatorVital: boolean;
  lowFloorBus: boolean;
  max3PctIncline: boolean;
  sensoryCues: boolean;
  preferredRouting: 'least-walking' | 'fastest' | 'lowest-cost' | 'max-accessible';
  updatedAt: string;
}

export interface SavedRoute {
  routeId: string;
  userId: string;
  name: string;
  origin: string;
  destination: string;
  time: string;
  cost: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentType?: 'orchestrator' | 'accessibility' | 'mobility' | 'vision' | 'civic';
  timestamp: string;
  text?: string;
  type?: 'text' | 'route-card' | 'dispatch-card' | 'system-alert';
  routeData?: RouteRecommendation;
  dispatchData?: TicketSummary;
}

export interface RouteRecommendation {
  id: string;
  name: string;
  badge: string;
  matchScore: string;
  time: string;
  walking: string;
  cost: string;
  transfers: string;
  liftStatus: string;
  mapImage: string;
  steps: {
    title: string;
    time: string;
    desc: string;
    icon: string;
    color: string;
  }[];
}

export interface TicketSummary {
  id: string;
  code: string; // e.g. #UF-2026-1042
  title: string;
  category: string;
  location: string;
  coordinates: { lat: number; lng: number };
  priority: 'P1 CRITICAL' | 'P2 HIGH' | 'P2 MED' | 'P3 NOMINAL';
  confidence: number;
  status: 'SUBMITTED' | 'ASSIGNED' | 'IN REPAIR' | 'RESOLVED';
  assignedCrew: string;
  assignedVehicle: string;
  timestamp: string;
  slaLimit: string;
  slaRemaining: string;
  upvotes: number;
  depthCm: number;
  materialUsedKg?: number;
  compactionPasses?: number;
  tempCelsius?: number;
  proofHash: string;
}

export interface CrewTelemetry {
  truckId: string;
  callsign: string;
  driverName: string;
  badge: string;
  driverRating: number;
  techsCount: number;
  speedKmH: number;
  speedLimit: number;
  hybridEnergyPct: number;
  hybridRangeKm: number;
  coldPatchCurrentTons: number;
  coldPatchCapacityTons: number;
  hydraulicPressurePsi: number;
  heading: string;
  locationName: string;
  currentStepIndex: number;
  waypoints: {
    label: string;
    name: string;
    time: string;
    status: 'complete' | 'current' | 'upcoming';
  }[];
}
