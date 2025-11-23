
import { AnomalyEvent, ChartDataPoint, EventType, RiskLevel, UserEntity, ActivityLog, HeatmapPoint, RadarMetric, UserStats, Alert, AlertStatus, GraphNode, GraphLink, Report, SystemAuditLog } from "./types";

export const MOCK_USERS: UserEntity[] = [
  {
    id: 'u-001',
    name: 'Alice Chen',
    department: 'Engineering',
    role: 'DevOps Engineer',
    riskScore: 92,
    email: 'alice.chen@corp.local',
    avatarUrl: 'https://picsum.photos/200/200?random=1',
    status: 'UNDER_REVIEW',
    lastSeen: '2 mins ago',
    location: 'Lagos, NG'
  },
  {
    id: 'u-002',
    name: 'Robert Fox',
    department: 'Finance',
    role: 'Analyst',
    riskScore: 78,
    email: 'r.fox@corp.local',
    avatarUrl: 'https://picsum.photos/200/200?random=2',
    status: 'ACTIVE',
    lastSeen: '1 hour ago',
    location: 'London, UK'
  },
  {
    id: 'u-003',
    name: 'Sarah Connor',
    department: 'HR',
    role: 'Director',
    riskScore: 12,
    email: 'sarah.c@corp.local',
    avatarUrl: 'https://picsum.photos/200/200?random=3',
    status: 'ACTIVE',
    lastSeen: '4 hours ago',
    location: 'New York, US'
  },
  {
    id: 'u-004',
    name: 'David Miller',
    department: 'Sales',
    role: 'VP Sales',
    riskScore: 45,
    email: 'd.miller@corp.local',
    avatarUrl: 'https://picsum.photos/200/200?random=4',
    status: 'ACTIVE',
    lastSeen: '10 mins ago',
    location: 'Chicago, US'
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
    type: EventType.IMPOSSIBLE_TRAVEL,
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

// --- User Detail Data ---

export const SELECTED_USER_STATS: UserStats = {
  loginFailures: 14,
  dataAccessed: '8.2 GB',
  privilegeChanges: 3,
  afterHoursActivity: 22 // events
};

export const RADAR_DATA: RadarMetric[] = [
  { subject: 'Data Volume', A: 120, B: 40, fullMark: 150 }, // A=User, B=Baseline
  { subject: 'Login Freq', A: 98, B: 90, fullMark: 150 },
  { subject: 'After Hours', A: 130, B: 20, fullMark: 150 },
  { subject: 'Privilege Use', A: 85, B: 30, fullMark: 150 },
  { subject: 'Ext. Devices', A: 20, B: 20, fullMark: 150 },
  { subject: 'Failed Auths', A: 110, B: 15, fullMark: 150 },
];

export const ACTIVITY_LOGS: ActivityLog[] = [
  { id: '1', action: 'Download', timestamp: '2 mins ago', resource: 'customer_db_dump.sql', result: 'SUCCESS', riskScore: 95 },
  { id: '2', action: 'Login', timestamp: '25 mins ago', resource: 'VPN Gateway', result: 'SUCCESS', riskScore: 88 },
  { id: '3', action: 'Sudo Access', timestamp: '2 hours ago', resource: '/etc/shadow', result: 'BLOCKED', riskScore: 75 },
  { id: '4', action: 'File Read', timestamp: '4 hours ago', resource: 'Q3_Financials.xlsx', result: 'SUCCESS', riskScore: 10 },
  { id: '5', action: 'Login', timestamp: '5 hours ago', resource: 'Office 365', result: 'FAILURE', riskScore: 40 },
  { id: '6', action: 'Login', timestamp: '5 hours ago', resource: 'Office 365', result: 'FAILURE', riskScore: 40 },
];

export const generateHeatmapData = (): HeatmapPoint[] => {
  const data: HeatmapPoint[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  days.forEach(day => {
    for (let h = 0; h < 24; h++) {
      let val = (h >= 9 && h <= 18) && (day !== 'Sat' && day !== 'Sun') ? Math.floor(Math.random() * 5) + 3 : 0;
      if (day === 'Sat' && h === 2) val = 10;
      if (day === 'Fri' && h === 23) val = 8;
      data.push({ day, hour: h, value: val });
    }
  });
  return data;
};

export const HEATMAP_DATA = generateHeatmapData();

// --- Alerts Data ---

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-2024-001',
    title: 'Potential Data Exfiltration via S3',
    severity: RiskLevel.CRITICAL,
    status: AlertStatus.NEW,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    entityId: 'u-001',
    source: 'DLP System',
    tags: ['Data Loss', 'AWS', 'Insider Threat'],
    description: 'User uploaded 4.5GB of encrypted archives to an unlisted personal S3 bucket.'
  },
  {
    id: 'ALT-2024-002',
    title: 'Impossible Travel Detected',
    severity: RiskLevel.HIGH,
    status: AlertStatus.INVESTIGATING,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    entityId: 'u-001',
    assignee: 'J. Doe',
    source: 'Identity Provider',
    tags: ['Geo-velocity', 'Account Compromise'],
    description: 'Concurrent sessions detected in London (UK) and Lagos (NG) within 15 minutes.'
  },
  {
    id: 'ALT-2024-003',
    title: 'Unauthorized Admin Access',
    severity: RiskLevel.MEDIUM,
    status: AlertStatus.RESOLVED,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    entityId: 'u-002',
    assignee: 'Admin User',
    source: 'PAM',
    tags: ['Privilege Escalation'],
    description: 'User attempted to access "Root" group capabilities without an active change request ticket.'
  },
  {
    id: 'ALT-2024-004',
    title: 'Multiple Failed MFA Challenges',
    severity: RiskLevel.MEDIUM,
    status: AlertStatus.NEW,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    entityId: 'u-004',
    source: 'Okta',
    tags: ['Brute Force', 'Authentication'],
    description: '15 failed MFA push notifications rejected by user device in 5 minutes.'
  },
  {
    id: 'ALT-2024-005',
    title: 'Malware Signature Match',
    severity: RiskLevel.HIGH,
    status: AlertStatus.NEW,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    entityId: 'u-003',
    source: 'Endpoint Protection',
    tags: ['Malware', 'Endpoint'],
    description: 'Endpoint detection flagged "Trojan.Win32.Generic" in Downloads folder.'
  },
  {
    id: 'ALT-2024-006',
    title: 'Port Scanning Activity',
    severity: RiskLevel.LOW,
    status: AlertStatus.FALSE_POSITIVE,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    entityId: 'u-001',
    assignee: 'NetSec Team',
    source: 'Network Firewall',
    tags: ['Reconnaissance'],
    description: 'Internal IP scan detected. Verified as scheduled vulnerability scan.'
  }
];

// --- Investigation Data ---

export const INVESTIGATION_GRAPH_NODES: GraphNode[] = [
  { id: 'u1', type: 'USER', label: 'Alice Chen', x: 400, y: 300, risk: 92 },
  { id: 'ip1', type: 'IP', label: '10.0.0.52', x: 250, y: 300, risk: 40 },
  { id: 'ip2', type: 'IP', label: '197.210.X.X', x: 250, y: 150, risk: 85 },
  { id: 'f1', type: 'FILE', label: 'passwords.txt', x: 550, y: 300, risk: 90 },
  { id: 'f2', type: 'FILE', label: 'Q3_Report.pdf', x: 550, y: 400, risk: 10 },
  { id: 'd1', type: 'DOMAIN', label: 'suspicious-site.com', x: 100, y: 150, risk: 95 },
  { id: 'p1', type: 'PROCESS', label: 'powershell.exe', x: 400, y: 450, risk: 70 },
];

export const INVESTIGATION_GRAPH_LINKS: GraphLink[] = [
  { source: 'u1', target: 'ip1', label: 'Logged In' },
  { source: 'u1', target: 'ip2', label: 'Remote Access', active: true },
  { source: 'ip2', target: 'd1', label: 'C2 Traffic' },
  { source: 'ip1', target: 'f1', label: 'Accessed' },
  { source: 'ip1', target: 'f2', label: 'Accessed' },
  { source: 'u1', target: 'p1', label: 'Spawned' },
];

export const FORENSIC_LOGS = [
  { time: '2024-05-20 14:22:10', type: 'PROCESS_START', src: '10.0.0.52', user: 'alice.chen', details: 'Started powershell.exe -encodedCommand...', risk: 88 },
  { time: '2024-05-20 14:22:15', type: 'FILE_ACCESS', src: '10.0.0.52', user: 'alice.chen', details: 'Read C:\\Users\\Public\\passwords.txt', risk: 95 },
  { time: '2024-05-20 14:23:05', type: 'NETWORK_CONN', src: '10.0.0.52', user: 'alice.chen', details: 'Outbound connect to 197.210.X.X:443', risk: 75 },
  { time: '2024-05-20 14:25:00', type: 'DATA_TRANSFER', src: '10.0.0.52', user: 'alice.chen', details: 'Upload 45MB to external host', risk: 65 },
  { time: '2024-05-20 14:28:11', type: 'AUTH_SUCCESS', src: '197.210.X.X', user: 'alice.chen', details: 'VPN Session Established', risk: 80 },
  { time: '2024-05-20 14:30:22', type: 'API_CALL', src: '10.0.0.52', user: 'alice.chen', details: 'GET /api/v1/customers/export', risk: 50 },
];

// --- Reports Data ---

export const MOCK_REPORTS: Report[] = [
  { id: 'rpt-101', name: 'Q3 Executive Security Summary', type: 'EXECUTIVE', generatedBy: 'System', generatedAt: '2024-10-01T08:00:00Z', size: '2.4 MB', status: 'READY' },
  { id: 'rpt-102', name: 'Weekly High Risk Users', type: 'USER_RISK', generatedBy: 'Admin', generatedAt: '2024-10-15T09:30:00Z', size: '850 KB', status: 'READY' },
  { id: 'rpt-103', name: 'PCI-DSS Compliance Audit', type: 'COMPLIANCE', generatedBy: 'Auditor', generatedAt: '2024-10-14T14:15:00Z', size: '15 MB', status: 'GENERATING' },
  { id: 'rpt-104', name: 'Incident #492 Post-Mortem', type: 'INCIDENT_SUMMARY', generatedBy: 'J. Doe', generatedAt: '2024-09-28T11:20:00Z', size: '1.2 MB', status: 'READY' },
  { id: 'rpt-105', name: 'Monthly Threat Landscape', type: 'EXECUTIVE', generatedBy: 'System', generatedAt: '2024-09-01T08:00:00Z', size: '3.1 MB', status: 'READY' },
];

// --- Settings Audit Logs ---

export const MOCK_SYSTEM_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'audit-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    user: 'Admin User',
    setting: 'Risk Scoring Threshold - High',
    oldValue: '75',
    newValue: '80'
  }
];
