import { Router, Response } from 'express';
import { db } from '../db/store';
import { AuthenticatedRequest } from '../middleware/auth';
import { UserRole } from '../../src/types';

export const authRouter = Router();

authRouter.get('/demo-users', (req, res) => {
  const users = db.get('users').map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department,
    jobTitle: u.jobTitle,
  }));
  res.json({ users });
});

authRouter.get('/me', (req: AuthenticatedRequest, res) => {
  if (req.user) {
    return res.json({ user: req.user });
  }

  // If no cookie set yet, automatically default to Marcus Sterling (Admin) for seamless developer experience
  const users = db.get('users');
  const defaultAdmin = users.find((u) => u.role === 'admin') || users[0];

  res.cookie('resolvehq_user_id', defaultAdmin.id, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 3600 * 1000,
  });

  res.json({ user: defaultAdmin });
});

authRouter.post('/login', (req, res) => {
  const { email, userId, role } = req.body;
  const users = db.get('users');

  let user = users.find((u) => (userId && u.id === userId) || (email && u.email.toLowerCase() === email.toLowerCase()));

  if (!user && role) {
    user = users.find((u) => u.role === role);
  }

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  res.cookie('resolvehq_user_id', user.id, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 3600 * 1000,
  });

  res.json({
    user,
    token: user.id,
    message: `Signed in as ${user.name} (${user.role})`,
  });
});

authRouter.post('/switch-role', (req, res) => {
  const { role } = req.body as { role: UserRole };
  const users = db.get('users');
  const targetUser = users.find((u) => u.role === role) || users[0];

  res.cookie('resolvehq_user_id', targetUser.id, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 3600 * 1000,
  });

  res.json({
    user: targetUser,
    message: `Switched session to ${targetUser.name} (${targetUser.role})`,
  });
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('resolvehq_user_id');
  res.json({ message: 'Logged out successfully' });
});
