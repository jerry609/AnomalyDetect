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
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION'
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