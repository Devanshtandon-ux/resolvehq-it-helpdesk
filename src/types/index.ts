export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'hardware' | 'software' | 'network' | 'access' | 'security' | 'other';
export type UserRole = 'employee' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  jobTitle?: string;
  createdAt: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  content: string;
  isInternal?: boolean;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  action: string;
  details?: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  slaDueHours: number;
  slaDeadline: string;
  isOverdue: boolean;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ticket_created' | 'ticket_assigned' | 'status_changed' | 'sla_warning' | 'comment_added';
  ticketId?: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardMetrics {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  overdueTickets: number;
  avgResolutionTimeHours: number;
  slaComplianceRate: number;
  statusDistribution: { status: TicketStatus; count: number; label: string }[];
  priorityDistribution: { priority: TicketPriority; count: number; label: string }[];
  categoryDistribution: { category: TicketCategory; count: number; label: string }[];
  ticketsTrend: { date: string; created: number; resolved: number }[];
  recentActivity: ActivityItem[];
}

export type ThemePreset = 'lavender' | 'cloud' | 'ivory' | 'mint' | 'rose' | 'custom';

export interface ThemeConfig {
  preset: ThemePreset;
  bgHex: string;
  surfaceHex: string;
  accentHex: string;
  accentHoverHex: string;
  textPrimaryHex: string;
  textSecondaryHex: string;
  borderHex: string;
  isDark: boolean;
}
