import { Router } from 'express';
import { db } from '../db/store';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { Ticket, TicketPriority, TicketStatus, TicketCategory, TicketComment, ActivityItem } from '../../src/types';

export const ticketsRouter = Router();

// Calculate SLA hours default based on priority
const SLA_MAP: Record<TicketPriority, number> = {
  urgent: 4,
  high: 8,
  medium: 24,
  low: 48,
};

// GET /api/tickets with filters, sorting, and RBAC visibility
ticketsRouter.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  let tickets = [...db.get('tickets')];

  // RBAC Filter:
  // - Employee: Only views tickets they created
  // - Agent: Views assigned tickets + unassigned tickets + tickets in queue
  // - Admin: Views all tickets
  if (user.role === 'employee') {
    tickets = tickets.filter((t) => t.creatorId === user.id);
  }

  // Query filters
  const { status, priority, category, assigneeId, search, sort = 'recent' } = req.query;

  if (status && status !== 'all') {
    tickets = tickets.filter((t) => t.status === status);
  }
  if (priority && priority !== 'all') {
    tickets = tickets.filter((t) => t.priority === priority);
  }
  if (category && category !== 'all') {
    tickets = tickets.filter((t) => t.category === category);
  }
  if (assigneeId) {
    if (assigneeId === 'unassigned') {
      tickets = tickets.filter((t) => !t.assigneeId);
    } else {
      tickets = tickets.filter((t) => t.assigneeId === assigneeId);
    }
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    tickets = tickets.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.ticketNumber.toLowerCase().includes(q) ||
        t.creatorName.toLowerCase().includes(q)
    );
  }

  // Update dynamic isOverdue flag based on deadline vs resolvedAt
  const now = new Date().getTime();
  tickets = tickets.map((t) => {
    const deadline = new Date(t.slaDeadline).getTime();
    const isOverdue = t.status !== 'resolved' && t.status !== 'closed' && now > deadline;
    return { ...t, isOverdue };
  });

  // Sorting
  if (sort === 'priority') {
    const priorityWeight: Record<TicketPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
    tickets.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  } else if (sort === 'sla') {
    tickets.sort((a, b) => new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime());
  } else {
    // recent
    tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({
    tickets,
    total: tickets.length,
  });
});

// GET /api/tickets/:id - ticket detail with comments and activities
ticketsRouter.get('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const ticket = db.get('tickets').find((t) => t.id === req.params.id);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  // RBAC authorization
  if (user.role === 'employee' && ticket.creatorId !== user.id) {
    return res.status(403).json({ error: 'Forbidden', message: 'You can only view your own tickets.' });
  }

  const comments = db.get('comments').filter((c) => c.ticketId === ticket.id);
  const activities = db.get('activities').filter((a) => a.ticketId === ticket.id);

  res.json({
    ticket,
    comments,
    activities,
  });
});

// POST /api/tickets - Create new ticket
ticketsRouter.post('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { title, description, priority = 'medium', category = 'software', slaDueHours } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const effectivePriority = (['urgent', 'high', 'medium', 'low'].includes(priority)
    ? priority
    : 'medium') as TicketPriority;

  const hours = Number(slaDueHours) || SLA_MAP[effectivePriority];
  const deadline = new Date(Date.now() + hours * 3600 * 1000).toISOString();

  const allTickets = db.get('tickets');
  const nextNum = 1083 + allTickets.length;
  const newTicket: Ticket = {
    id: `tkt-${nextNum}`,
    ticketNumber: `RHQ-${nextNum}`,
    title: title.trim(),
    description: description.trim(),
    status: 'open',
    priority: effectivePriority,
    category: (category || 'software') as TicketCategory,
    creatorId: user.id,
    creatorName: user.name,
    creatorEmail: user.email,
    slaDueHours: hours,
    slaDeadline: deadline,
    isOverdue: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    commentsCount: 0,
  };

  allTickets.unshift(newTicket);
  db.set('tickets', allTickets);

  // Record activity
  const activities = db.get('activities');
  activities.unshift({
    id: `act-${Date.now()}`,
    ticketId: newTicket.id,
    userId: user.id,
    userName: user.name,
    action: 'Created ticket',
    details: `${newTicket.ticketNumber} created with ${effectivePriority} priority`,
    timestamp: new Date().toISOString(),
  });
  db.set('activities', activities);

  // Dispatch in-app notification to admins and agents
  const notifications = db.get('notifications');
  const agentsAndAdmins = db.get('users').filter((u) => u.role === 'admin' || u.role === 'agent');
  agentsAndAdmins.forEach((staff) => {
    notifications.unshift({
      id: `notif-${Date.now()}-${staff.id}`,
      userId: staff.id,
      title: 'New Support Request',
      message: `${user.name} opened ${newTicket.ticketNumber}: "${newTicket.title}"`,
      type: 'ticket_created',
      ticketId: newTicket.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
  });
  db.set('notifications', notifications);

  res.status(201).json({ ticket: newTicket });
});

// PATCH /api/tickets/:id/status - Status transitions
ticketsRouter.patch('/:id/status', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { status } = req.body as { status: TicketStatus };

  if (!['open', 'in_progress', 'waiting', 'resolved', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const tickets = db.get('tickets');
  const index = tickets.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const ticket = tickets[index];

  // RBAC validation: Employees cannot change status unless they are closing/reopening their own ticket
  if (user.role === 'employee') {
    if (ticket.creatorId !== user.id) {
      return res.status(403).json({ error: 'Forbidden', message: 'You can only manage your own tickets.' });
    }
    if (status !== 'closed' && status !== 'open') {
      return res.status(403).json({ error: 'Forbidden', message: 'Employees can only close or reopen tickets.' });
    }
  }

  const prevStatus = ticket.status;
  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();

  if (status === 'resolved' || status === 'closed') {
    ticket.resolvedAt = new Date().toISOString();
  }

  db.set('tickets', tickets);

  // Activity log
  const activities = db.get('activities');
  activities.unshift({
    id: `act-${Date.now()}`,
    ticketId: ticket.id,
    userId: user.id,
    userName: user.name,
    action: `Changed status to ${status.replace('_', ' ')}`,
    details: `Transitioned from ${prevStatus} to ${status}`,
    timestamp: new Date().toISOString(),
  });
  db.set('activities', activities);

  // Notify creator if updated by agent/admin
  if (ticket.creatorId !== user.id) {
    const notifications = db.get('notifications');
    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: ticket.creatorId,
      title: 'Ticket Status Updated',
      message: `Your ticket ${ticket.ticketNumber} was updated to "${status.replace('_', ' ')}" by ${user.name}`,
      type: 'status_changed',
      ticketId: ticket.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
    db.set('notifications', notifications);
  }

  res.json({ ticket });
});

// PATCH /api/tickets/:id/assign - Assign to an agent
ticketsRouter.patch('/:id/assign', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;

  if (user.role === 'employee') {
    return res.status(403).json({ error: 'Forbidden', message: 'Employees cannot assign tickets.' });
  }

  const { assigneeId } = req.body;
  const tickets = db.get('tickets');
  const index = tickets.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const ticket = tickets[index];

  if (!assigneeId) {
    ticket.assigneeId = undefined;
    ticket.assigneeName = undefined;
  } else {
    const targetUser = db.get('users').find((u) => u.id === assigneeId);
    if (!targetUser) {
      return res.status(400).json({ error: 'Target assignee user not found' });
    }
    ticket.assigneeId = targetUser.id;
    ticket.assigneeName = targetUser.name;

    // Notify assignee
    const notifications = db.get('notifications');
    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: targetUser.id,
      title: 'Ticket Assigned to You',
      message: `${user.name} assigned you to ${ticket.ticketNumber}: "${ticket.title}"`,
      type: 'ticket_assigned',
      ticketId: ticket.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
    db.set('notifications', notifications);
  }

  ticket.updatedAt = new Date().toISOString();
  db.set('tickets', tickets);

  // Activity log
  const activities = db.get('activities');
  activities.unshift({
    id: `act-${Date.now()}`,
    ticketId: ticket.id,
    userId: user.id,
    userName: user.name,
    action: ticket.assigneeName ? `Assigned to ${ticket.assigneeName}` : 'Unassigned ticket',
    timestamp: new Date().toISOString(),
  });
  db.set('activities', activities);

  res.json({ ticket });
});

// POST /api/tickets/:id/comments - Add comment
ticketsRouter.post('/:id/comments', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { content, isInternal } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Comment content cannot be empty' });
  }

  const tickets = db.get('tickets');
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  // Authorization: Employees cannot comment on others' tickets
  if (user.role === 'employee' && ticket.creatorId !== user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const newComment: TicketComment = {
    id: `cmt-${Date.now()}`,
    ticketId: ticket.id,
    authorId: user.id,
    authorName: user.name,
    authorRole: user.role,
    content: content.trim(),
    isInternal: Boolean(isInternal && user.role !== 'employee'),
    createdAt: new Date().toISOString(),
  };

  const comments = db.get('comments');
  comments.push(newComment);
  db.set('comments', comments);

  ticket.commentsCount = (ticket.commentsCount || 0) + 1;
  ticket.updatedAt = new Date().toISOString();
  db.set('tickets', tickets);

  // Activity log
  const activities = db.get('activities');
  activities.unshift({
    id: `act-${Date.now()}`,
    ticketId: ticket.id,
    userId: user.id,
    userName: user.name,
    action: 'Posted comment',
    details: content.length > 60 ? `${content.slice(0, 60)}...` : content,
    timestamp: new Date().toISOString(),
  });
  db.set('activities', activities);

  res.status(201).json({ comment: newComment });
});

// Clear all tickets for a 100% clean live demonstration slate
ticketsRouter.post('/clear-all', requireAuth, (req: AuthenticatedRequest, res) => {
  db.set('tickets', []);
  db.set('comments', []);
  db.set('activities', []);
  db.set('notifications', []);
  res.json({ success: true, message: 'All tickets, comments, and activities cleared for fresh demo.' });
});

