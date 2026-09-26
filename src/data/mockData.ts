import { ChatMessage, CrewTelemetry, RouteRecommendation, TicketSummary } from '../types';

export const INITIAL_ROUTE_RECOMMENDATION: RouteRecommendation = {
  id: 'zero-barrier-ktr',
  name: 'Suburban Rail & Campus Kneeling Electric',
  badge: 'Recommended Zero-Stair',
  matchScore: '98% Fit',
  time: '48m',
  walking: '210m Total (Flat Grade 0.4%)',
  cost: '₹35 Civic Fare',
  transfers: '1 Lift (2 Elevators Online)',
  liftStatus: 'Lift Operational • Gate 2 West',
  mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_Lv5B4o3BUUzMAA5Uj4Emh7rW4BrlZ2lI8gqsWQJGy2Fxq4lbJjqsY1wRVFRtpqVAwAxmFVAaNPIYQ_rfFOt0u4nCNO6E_iA3kH2jkOLI_UGXdwkMawk_0G7EPiXFD8Rt-bfbVmy3S8N1tNb7b4u9e92VvtZu4xxzoV6XcrfycUXdXGofJDRvNBGapz8iJgZ65Ul9eCYU-SRh7SByomnWEwUS1zJVtId49v0Q9QCm2e5oEjjrhTY',
  steps: [
    {
      title: 'Tambaram Platform 1 (Ramp Access)',
      time: '07:22 AM',
      desc: 'Smooth 1:12 slope ramp at Concourse A. No turnstiles obstruction (wide accessible gate open). Checked 2m ago.',
      icon: 'ramp_right',
      color: 'text-primary-container'
    },
    {
      title: 'EMU Suburban Express (Coach 4 Dedicated Bay)',
      time: '18 min run',
      desc: 'Level boarding ramp deployed. On-board wheelchair locks present. Train #40502 on schedule.',
      icon: 'train',
      color: 'text-secondary'
    },
    {
      title: 'Potheri / SRM Link • Low-Floor Civic Shuttle',
      time: '07:44 AM',
      desc: 'Autonomous EV Shuttle Route #14 with hydraulic curb kneel. Transfers 90m step-free directly to SRM Arch Gate.',
      icon: 'electric_bolt',
      color: 'text-primary-fixed'
    }
  ]
};

export const STANDARD_BARRIER_ROUTE = {
  name: 'Standard Bus 105 Deluxe via GST Road',
  badge: 'Severe Mobility Barriers',
  score: '24% Accessibility',
  time: '42m',
  cost: '₹25 Bus Fare',
  walk: '850 meters (Uneven flagstones)',
  obstacle: '64 Stairs (No Ramp Present)',
  vehicle: 'High Floor (3 Stiff Bus Steps)',
  warning: 'Critical Inaccessibility: Contains 64 steep steps over pedestrian bridge (Elevator Out of Order at Tambaram Bus Terminal). High-curb bus entry.'
};

export const INITIAL_TICKETS: TicketSummary[] = [
  {
    id: 't-1042',
    code: '#UF-2026-1042',
    title: 'Road Surface Structural Damage (Crater 14cm)',
    category: 'Pothole / Road Surface Fracture (PWD)',
    location: 'GST Road KM 32.4 • Potheri Flyover Down-Ramp',
    coordinates: { lat: 12.8231, lng: 80.0452 },
    priority: 'P1 CRITICAL',
    confidence: 94.2,
    status: 'IN REPAIR',
    assignedCrew: 'PWD Field Taskforce #4',
    assignedVehicle: 'Truck T-18 (Tata Prima 2830.K)',
    timestamp: 'Today 07:19:02 IST',
    slaLimit: '24h SLA Tier 1',
    slaRemaining: '03h 48m left',
    upvotes: 38,
    depthCm: 14.2,
    materialUsedKg: 185,
    compactionPasses: 6,
    tempCelsius: 142,
    proofHash: '0x8F92A144E391BC02B47C02AA'
  },
  {
    id: 't-1039',
    code: '#UF-2026-1039',
    title: 'Streetlight Cluster Failure',
    category: 'Streetlight Outage / Electrical Line (TNEB)',
    location: 'Tambaram West Concourse • TNEB Electrical',
    coordinates: { lat: 12.9249, lng: 80.1280 },
    priority: 'P2 HIGH',
    confidence: 91.8,
    status: 'ASSIGNED',
    assignedCrew: 'TNEB Unit #12',
    assignedVehicle: 'Bucket Truck E-04',
    timestamp: 'Today 06:45:10 IST',
    slaLimit: '12h SLA',
    slaRemaining: '07h 15m left',
    upvotes: 14,
    depthCm: 0,
    proofHash: '0x4E119932B10CA789DF102'
  },
  {
    id: 't-1038',
    code: '#UF-2026-1038',
    title: 'Ramp Incline Obstruction & Tactile Damage',
    category: 'Accessibility Infrastructure (GCC)',
    location: 'Chromepet Station Footover Bridge Ramp',
    coordinates: { lat: 12.9516, lng: 80.1415 },
    priority: 'P2 MED',
    confidence: 89.4,
    status: 'ASSIGNED',
    assignedCrew: 'GCC Field Maintenance #3',
    assignedVehicle: 'Civic Utility Van V-08',
    timestamp: 'Today 06:12:44 IST',
    slaLimit: '24h SLA',
    slaRemaining: '11h 20m left',
    upvotes: 27,
    depthCm: 0,
    proofHash: '0x7B992831CA882190E112'
  },
  {
    id: 't-1035',
    code: '#UF-2026-1035',
    title: 'Blocked Storm Drain Inlet & Silt Surcharge',
    category: 'Water Main & Drainage (CMWSSB)',
    location: 'Velachery Main Road & Tambaram Bypass Jn',
    coordinates: { lat: 12.9150, lng: 80.1190 },
    priority: 'P3 NOMINAL',
    confidence: 88.0,
    status: 'ASSIGNED',
    assignedCrew: 'CMWSSB Drainage Team #2',
    assignedVehicle: 'Suction Jetter J-02',
    timestamp: 'Today 05:30:19 IST',
    slaLimit: '48h SLA',
    slaRemaining: '24h 00m left',
    upvotes: 9,
    depthCm: 0,
    proofHash: '0x1C229871BA990234EF99'
  }
];

export const INITIAL_CREW_TELEMETRY: CrewTelemetry = {
  truckId: 'Unit T-18',
  callsign: 'LION-4',
  driverName: 'Off. R. Sundaram',
  badge: '#PWD-7721',
  driverRating: 4.96,
  techsCount: 4,
  speedKmH: 42,
  speedLimit: 50,
  hybridEnergyPct: 78,
  hybridRangeKm: 184,
  coldPatchCurrentTons: 3.4,
  coldPatchCapacityTons: 4.5,
  hydraulicPressurePsi: 3200,
  heading: '204° SSW',
  locationName: 'GST Road KM 32.4 (Approaching Guduvanchery Bypass)',
  currentStepIndex: 2,
  waypoints: [
    { label: 'DEPOT EXIT', name: 'Tambaram Central Works', time: '07:15 AM', status: 'complete' },
    { label: 'ARTERIAL', name: 'Vandalur Flyover Junction', time: '07:28 AM', status: 'complete' },
    { label: 'CURRENT', name: 'Guduvanchery Toll Bypass', time: '3.8 km remaining', status: 'current' },
    { label: 'DECELERATE', name: 'Lane 2 Merge & Arrow Deploy', time: 'ETA 07:44 AM', status: 'upcoming' },
    { label: 'ON-SITE', name: 'Begin Infrared Patching', time: 'ETA 07:47 AM', status: 'upcoming' }
  ]
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    timestamp: '07:18:24',
    text: 'I need to reach SRM KTR at 8 AM. I use a wheelchair and want the least walking from Tambaram.'
  },
  {
    id: 'msg-2',
    sender: 'agent',
    agentType: 'orchestrator',
    timestamp: '07:18:28',
    type: 'route-card',
    routeData: INITIAL_ROUTE_RECOMMENDATION
  },
  {
    id: 'msg-3',
    sender: 'agent',
    agentType: 'civic',
    timestamp: '07:19:02',
    type: 'dispatch-card',
    dispatchData: INITIAL_TICKETS[0]
  }
];

export const IMAGES = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1WLsuqBinMojhQVb9pDPa4SZSv6WRR5bqCRIoyAmmVhlnIcqgYapC0Wt9SHQZPbu32HmL0BDjJ4cAellQFLqEHkhQhRZ02p0VdxVJYWGHTw2l6ijMkvwbPzHcjSFsEFtsdkYVg2HozjxZg95oZT9IjYvTsJx4IOp82hquxmrjCzVh0r4nDaySwEWHuZ-J1semzfgoz--quNBikSSdWZ-iNajwfOwEBrFuZtEjGs8Mc7cZFRkbEgyTBb',
  potholeCamera: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiavfrcHroVzHVrEcpFHJO_WSAbfAIosKyUTmczZC6j6EA7_2QU0FwIuXCPsWgpX-SPd95uSgsUk7nk8N_EFq0_ZxT6-XiTbq1UzfuYX07TI0gn57gZZ4GTM3yNvhukW-v7wThmXRFRVdITZ5hhdGQ-qJlBbjJrCqDai5bjCsY2Qo9bd2rXvg3rAyalKZ-oShAM0ARAeLLUczuE7Nqy4BIOscTBZdYLMdyXg2UN_Z10Cf8ImqPrsc',
  potholeCloseUp: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoqzUZ9MTekppMtbgw7RZK4qhdnijZWKExaa8VIIyaEWj_7fcfja1tGuKdn5MLtX2VL96GBdixXDYLShZgRmS7KPqLyVlcQrLGbRI0PNtHU92QAOHlbtshn3svS8-OOMZqFOmiMH7II7QXgdTPWV-QGGrEGGXuKTs7pjE2MZ3P4NfDJ3XmTJBvAQQcxOhF-FYU3xmXdxMAUcUfab_MQ__RTwOlJCPOFPyTUkVVWXMMJ98Da9EGUjM',
  potholeNightCyber: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0qqQKd4SVud0YSEiNFye3Hnqanr2DqbNttmBMxY2MVals8D5SvpmYRjVQb-FRSvOzMuZIsFj6jn1s_MXbM_CkAY4LUSQhVWQDqqLrlyZ6TNDe5IfGooXi3c3-tlPmFzsLWE_mSy7I2TukxWaiWSB5CulFV6fu-i_Y8__ovhGvlL5k2FkVXMcnvmJuBInci2RIgZv_IuHdCPpLpabla2VU5fybUWLDqyJq2MMhli1ZbVW4Hj3jJlc',
  potholeBefore: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzLAfGjrYmaXesVd7-_U48A2FCSM6Fq_CyNmA9EfVIGcQDnduV2jZpdYgfXFUd8tHj1HzLzZT6caews1PLU5ew2AmxRbzOmIcsfk7Er14X-ZIFVjFnWkVtrnD0z3YrGrOP2ga4ZIAqQQ1T30eSyi7u2JZ2TTLuQ7PB1-2NuFZjcSaJfDAl8__Bpy10DocF3pgWFGkl1_v5olVnyiUFSesIKJb6xtmkALkpEjQnCWJOhuVfSleTwXw',
  potholeRepaired: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ5idOWYLacZpbFF9T9k0i70VY9PLwI2fELKTBW7B7uPQZTHB4nsafaPGKBELOvJ7U-Sya6Dp-4UHPBVs0f2Z-5LZzeIblsSwc7h7q2BlJsbp_U9ltjFOnXG8XucP5yf934HAJijbt5A9lLHiEJVRmr8lUthVWVXumLIP48Oa6UWlmWnsnpGTCT--z08qJUiTwuyVfnRf8GQjWPwkZ-rX_0E5LtoaNhmGF7lUl6wWz2NtjKz5vrYg',
  truckFront: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5bsWd07C52o9Tt2mgP81o8Vk6ihiSErsptJM1HcqquoXSppPFvA88aMxFcW26HFsp0UZ0VNIYEixuHvze-JjUNtYufPAiHGnVyvxvsfXVB3wPR7AWtBgzsFH_ePJ32uIA0y7lfKbh4WLCxbxx75j7xj1oh1Ez-fsXQZcuK5wupG4WGitZSUMjENllP-ehJgJ1dxGPI0cZPTkeq4fY3aY3r_tFGaJmocIK3CqJM7YoR6ZxTFRTlxI',
  officerSundaram: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9bwNV2DBXjraX-tFwONoWYkinmDlWGyC6i-WTWnNxl1FLCo0CLskyB3ZzhFIhQHbjXZ9fh_Vb9ZI2kqmnq_1ziNOwzNbk_GnZF45SPKGlrqQIit2L6D2kU6UJfLI2EmWdTxRTTSJ70aFt2Wbz_Fr7bXkadxEwmvMmLaalLwiXLbHpS3r4B0BlDOAo8VlqbofKNpJUaXwa4Y7QZa6cbTYBnIn3BEq6ba9MmYdNcmtP8zEVmj1DexY',
  dashcamRoad: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtJH98DzX-fQOP3C65xg3VP5K5zzW3do-4BlhK0Q1dIPdIZV7YLwubpRAAJ4QB-CqjNqlRDtkC5UQAcEzNiF25WoWaICvnprc-EeSaiY1VrC0f822GE6yzz9-NI5N7-UkkBmvVg4almEDvSCJFUToBJUdxWlUxkWBWMNtftlZwVfWp6xkX8-lRPHNKdrVCo42AhopXSviiulgTBwOO8rswK6_anFvXTENFQOupQZwxps-9Xi8La8k',
  mapSatGst: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC13lLbPDpvl-qX0SRp9sc0P6gJmV_tm9tIudxWW9XPxPN3E9BViDS3lLJ286Qr8nTfHuLoejvSvzy4cuxDu9MCDX_u4gYKumQT2kE7gx13CTkO96CdoLmy6tNz0Egao3-LmDC53jXG1deNRs8OC6-rIJUSQzbRhWZYuuG1M0klZw1H5cFsAFruBwvzblwyPLJspyt7IC9BPxvjNegirL9wT0qY4pR_tkaq5zRosp4U4_Rb-CbxvqA',
  mapSatPotheri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj8UIg_nXr_ZyecEnsRMFBiLvboykgZqBu-9IuLXqMU2UVaVae5539BwUAjjt-pnfDNMJRsbQgvP6JMKzy_TpB_06cvpOnRcC92mjF7jxRntMMqG64GyYI7Gu-BNSqtIx0Jqv4DiJsNFHUclKtt3129WqZEsCDVbH2EOv0WTyzfRYG5RzMsBerxVuaRuL8n_WjV3jvXKZ4W6C3_leT6q_I5z-6YvmK-QmBvJWp2RkQXD8FM97qgDM'
};
