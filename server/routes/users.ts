import { Router } from 'express';
import { db } from '../db/store';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';

export const usersRouter = Router();

usersRouter.get('/', (req, res) => {
  const { role } = req.query;
  let users = db.get('users').map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department,
    jobTitle: u.jobTitle,
    createdAt: u.createdAt,
  }));

  if (role) {
    users = users.filter((u) => u.role === role);
  }

  res.json({ users });
});

usersRouter.get('/:id', (req, res) => {
  const user = db.get('users').find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

usersRouter.patch('/:id/role', requireAuth, requireRole(['admin']), (req: AuthenticatedRequest, res) => {
  const { role } = req.body;
  if (!['employee', 'agent', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const users = db.get('users');
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[index].role = role;
  db.set('users', users);

  res.json({ user: users[index] });
});
