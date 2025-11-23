import { AnomalyEvent, ChartDataPoint, EventType, RiskLevel, UserEntity } from "./types";

export const MOCK_USERS: UserEntity[] = [
  {
    id: 'u-001',
    name: 'Alice Chen',
    department: 'Engineering',
    role: 'DevOps Engineer',
    riskScore: 92,
    email: 'alice.chen@corp.local',
    avatarUrl: 'https://picsum.photos/200/200?random=1',
    status: 'UNDER_REVIEW'
  },
  {
    id: 'u-002',
    name: 'Robert Fox',
    department: 'Finance',
    role: 'Analyst',
    riskScore: 78,
    email: 'r.fox@corp.local',
    avatarUrl: 'https://picsum.photos/200/200?random=2',
    status: 'ACTIVE'
  },
  {
    id: 'u-003',
    name: 'Sarah Connor',
    department: 'HR',
    role: 'Director',
    riskScore: 12,
    email: 'sarah.c@corp.local',
    avatarUrl: 'https://picsum.photos/200/200?random=3',
    status: 'ACTIVE'
  },
  {
    id: 'u-004',
    name: 'David Miller',
    department: 'Sales',
    role: 'VP Sales',
    riskScore: 45,
    email: 'd.miller@corp.local',
    avatarUrl: 'https://picsum.photos/200/200?random=4',
    status: 'ACTIVE'
  }
];

export const MOCK_EVENTS: AnomalyEvent[] = [
  {
    id: 'evt-101',
    userId: 'u-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    type: EventType.DATA_EXFILTRATION,
    description: 'Unusual volume of data transfer to external IP',
    riskLevel: RiskLevel.CRITICAL,
    details: { volume: '4.5GB', destination: '192.168.X.X (Unknown)' },
    sourceIp: '10.0.0.52',
    location: 'San Francisco, US'
  },
  {
    id: 'evt-102',
    userId: 'u-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: EventType.LOGIN,
    description: 'Impossible Travel: Login from Lagos right after London',
    riskLevel: RiskLevel.HIGH,
    details: { prevLoc: 'London, UK', currLoc: 'Lagos, NG' },
    sourceIp: '197.210.X.X',
    location: 'Lagos, NG'
  },
  {
    id: 'evt-103',
    userId: 'u-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    type: EventType.PRIVILEGE_ESCALATION,
    description: 'Attempted access to sensitive finance directory',
    riskLevel: RiskLevel.MEDIUM,
    details: { directory: '/finance/q3-projections/confidential' },
    sourceIp: '10.0.2.15',
    location: 'New York, US'
  },
  {
    id: 'evt-104',
    userId: 'u-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    type: EventType.LOGIN,
    description: 'Failed login attempts (Brute force pattern)',
    riskLevel: RiskLevel.MEDIUM,
    details: { attempts: 15 },
    sourceIp: '45.33.X.X',
    location: 'Chicago, US'
  }
];

export const RISK_TREND_DATA: ChartDataPoint[] = [
  { time: '00:00', score: 20, events: 2 },
  { time: '04:00', score: 15, events: 1 },
  { time: '08:00', score: 25, events: 5 },
  { time: '12:00', score: 45, events: 12 },
  { time: '16:00', score: 85, events: 28 }, // Spike
  { time: '20:00', score: 60, events: 10 },
  { time: '23:59', score: 55, events: 8 },
];