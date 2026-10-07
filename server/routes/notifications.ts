import { Router } from 'express';
import { db } from '../db/store';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';

export const notificationsRouter = Router();

notificationsRouter.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const allNotifications = db.get('notifications');
  const userNotifs = allNotifications
    .filter((n) => n.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = userNotifs.filter((n) => !n.read).length;

  res.json({
    notifications: userNotifs,
    unreadCount,
  });
});

notificationsRouter.patch('/:id/read', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const notifs = db.get('notifications');
  const index = notifs.findIndex((n) => n.id === req.params.id && n.userId === user.id);

  if (index !== -1) {
    notifs[index].read = true;
    db.set('notifications', notifs);
  }

  res.json({ success: true });
});

notificationsRouter.post('/read-all', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const notifs = db.get('notifications').map((n) => {
    if (n.userId === user.id) {
      return { ...n, read: true };
    }
    return n;
  });

  db.set('notifications', notifs);
  res.json({ success: true });
});
