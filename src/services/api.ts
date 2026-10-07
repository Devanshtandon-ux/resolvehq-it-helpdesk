import {
  User,
  Ticket,
  TicketComment,
  ActivityItem,
  NotificationItem,
  DashboardMetrics,
  UserRole,
  TicketStatus,
  TicketPriority,
  TicketCategory,
} from '../types';

class ApiService {
  private getStoredToken(): string | null {
    try {
      return localStorage.getItem('resolvehq_user_id');
    } catch {
      return null;
    }
  }

  private setStoredToken(id: string | null) {
    try {
      if (id) {
        localStorage.setItem('resolvehq_user_id', id);
      } else {
        localStorage.removeItem('resolvehq_user_id');
      }
    } catch {
      // ignore
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getStoredToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    };

    const res = await fetch(`/api${endpoint}`, {
      ...options,
      credentials: 'include',
      headers,
    });

    if (!res.ok) {
      let errorMsg = `API Error ${res.status}`;
      try {
        const data = await res.json();
        errorMsg = data.message || data.error || errorMsg;
      } catch {
        // ignore
      }
      throw new Error(errorMsg);
    }

    return res.json();
  }

  // Auth
  async getCurrentUser(): Promise<User> {
    const data = await this.request<{ user: User }>('/auth/me');
    if (data.user) {
      this.setStoredToken(data.user.id);
    }
    return data.user;
  }

  async getDemoUsers(): Promise<User[]> {
    const data = await this.request<{ users: User[] }>('/auth/demo-users');
    return data.users;
  }

  async login(payload: { email?: string; userId?: string; role?: UserRole }): Promise<{ user: User }> {
    const data = await this.request<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (data.user) {
      this.setStoredToken(data.user.id);
    }
    return data;
  }

  async switchRole(role: UserRole): Promise<{ user: User; message: string }> {
    const data = await this.request<{ user: User; message: string }>('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    if (data.user) {
      this.setStoredToken(data.user.id);
    }
    return data;
  }

  async logout(): Promise<void> {
    this.setStoredToken(null);
    await this.request('/auth/logout', { method: 'POST' });
  }

  // Tickets
  async getTickets(params: {
    status?: string;
    priority?: string;
    category?: string;
    assigneeId?: string;
    search?: string;
    sort?: string;
  } = {}): Promise<{ tickets: Ticket[]; total: number }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.append(k, v);
    });
    return this.request<{ tickets: Ticket[]; total: number }>(`/tickets?${query.toString()}`);
  }

  async getTicket(id: string): Promise<{
    ticket: Ticket;
    comments: TicketComment[];
    activities: ActivityItem[];
  }> {
    return this.request<{
      ticket: Ticket;
      comments: TicketComment[];
      activities: ActivityItem[];
    }>(`/tickets/${id}`);
  }

  async createTicket(payload: {
    title: string;
    description: string;
    priority: TicketPriority;
    category: TicketCategory;
    slaDueHours?: number;
  }): Promise<{ ticket: Ticket }> {
    return this.request<{ ticket: Ticket }>('/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateTicketStatus(id: string, status: TicketStatus): Promise<{ ticket: Ticket }> {
    return this.request<{ ticket: Ticket }>(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async assignTicket(id: string, assigneeId: string | null): Promise<{ ticket: Ticket }> {
    return this.request<{ ticket: Ticket }>(`/tickets/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assigneeId }),
    });
  }

  async addComment(
    ticketId: string,
    content: string,
    isInternal: boolean = false
  ): Promise<{ comment: TicketComment }> {
    return this.request<{ comment: TicketComment }>(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, isInternal }),
    });
  }

  async clearAllTickets(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/tickets/clear-all', {
      method: 'POST',
    });
  }

  // Users
  async getUsers(role?: UserRole): Promise<User[]> {
    const q = role ? `?role=${role}` : '';
    const data = await this.request<{ users: User[] }>(`/users${q}`);
    return data.users;
  }

  // Analytics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const data = await this.request<{ metrics: DashboardMetrics }>('/analytics/dashboard');
    return data.metrics;
  }

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    return this.request<{ notifications: NotificationItem[]; unreadCount: number }>('/notifications');
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.request(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async markAllNotificationsRead(): Promise<void> {
    await this.request('/notifications/read-all', { method: 'POST' });
  }

  // AI Support & Diagnostics (Powered by Gemini 3.8 Flash)
  async aiChat(
    message: string,
    history?: { role: string; text: string }[]
  ): Promise<{ reply: string; poweredBy: string }> {
    return this.request<{ reply: string; poweredBy: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  }

  async aiDiagnoseTicket(payload: {
    title: string;
    description: string;
    category?: string;
    priority?: string;
  }): Promise<{
    diagnostic: {
      summary: string;
      probableCause: string;
      steps: string[];
      recommendedReply: string;
      estimatedMinutes: number;
    };
    poweredBy: string;
  }> {
    return this.request('/ai/diagnose', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async aiEnhanceTicket(rawText: string): Promise<{
    enhanced: {
      title: string;
      description: string;
      category: TicketCategory;
      priority: TicketPriority;
      reasoning: string;
    };
    poweredBy: string;
  }> {
    return this.request('/ai/enhance-ticket', {
      method: 'POST',
      body: JSON.stringify({ rawText }),
    });
  }
}

export const api = new ApiService();
