
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum EventType {
  LOGIN = 'LOGIN',
  FILE_ACCESS = 'FILE_ACCESS',
  API_CALL = 'API_CALL',
  DATA_EXFILTRATION = 'DATA_EXFILTRATION',
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',
  MALWARE_DETECTED = 'MALWARE_DETECTED',
  IMPOSSIBLE_TRAVEL = 'IMPOSSIBLE_TRAVEL'
}

export interface UserEntity {
  id: string;
  name: string;
  department: string;
  role: string;
  riskScore: number; // 0-100
  email: string;
  avatarUrl: string;
  status: 'ACTIVE' | 'LOCKED' | 'UNDER_REVIEW';
  lastSeen?: string;
  location?: string;
}

export interface AnomalyEvent {
  id: string;
  userId: string;
  timestamp: string;
  type: EventType;
  description: string;
  riskLevel: RiskLevel;
  details: Record<string, string | number>;
  sourceIp: string;
  location: string;
}

export interface ChartDataPoint {
  time: string;
  score: number;
  events: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  resource: string;
  result: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  riskScore: number;
}

export interface UserStats {
  loginFailures: number;
  dataAccessed: string;
  privilegeChanges: number;
  afterHoursActivity: number;
}

export interface HeatmapPoint {
  day: string;
  hour: number;
  value: number; // 0-10 activity intensity
}

export interface RadarMetric {
  subject: string;
  A: number; // User
  B: number; // Baseline/Peer Group
  fullMark: number;
}

// --- New Types for Alerts & Incidents ---

export enum AlertStatus {
  NEW = 'NEW',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE'
}

export interface Alert {
  id: string;
  title: string;
  severity: RiskLevel;
  status: AlertStatus;
  timestamp: string;
  assignee?: string;
  entityId: string; // Refers to UserEntity.id
  source: string; // e.g., "Firewall", "Identity Provider"
  tags: string[];
  description: string;
}

// --- New Types for Investigation Graph ---

export type NodeType = 'USER' | 'IP' | 'FILE' | 'PROCESS' | 'DOMAIN';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  risk: number; // 0-100
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
  active?: boolean;
}

// --- New Types for Reports ---

export type ReportType = 'EXECUTIVE' | 'COMPLIANCE' | 'USER_RISK' | 'INCIDENT_SUMMARY';
export type ReportStatus = 'READY' | 'GENERATING' | 'FAILED';

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  generatedBy: string;
  generatedAt: string;
  size: string;
  status: ReportStatus;
  downloadUrl?: string;
}

// --- New Types for Settings Audit ---

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  user: string;
  setting: string;
  oldValue: string;
  newValue: string;
}

// --- RBAC Types ---

export enum UserRole {
  ADMIN = 'ADMIN',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER'
}

export enum Permission {
  VIEW_SETTINGS = 'VIEW_SETTINGS',
  EDIT_GENERAL = 'EDIT_GENERAL',
  EDIT_RISK_CONFIG = 'EDIT_RISK_CONFIG',
  MANAGE_INTEGRATIONS = 'MANAGE_INTEGRATIONS',
  MANAGE_NOTIFICATIONS = 'MANAGE_NOTIFICATIONS',
  MANAGE_ACCESS = 'MANAGE_ACCESS',
  VIEW_AUDIT = 'VIEW_AUDIT'
}