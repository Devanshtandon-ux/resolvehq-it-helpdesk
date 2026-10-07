import fs from 'fs';
import path from 'path';
import { User, Ticket, TicketComment, ActivityItem, NotificationItem } from '../../src/types';

export interface DatabaseData {
  users: (User & { passwordHash?: string })[];
  tickets: Ticket[];
  comments: TicketComment[];
  activities: ActivityItem[];
  notifications: NotificationItem[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial state: Clean slate with verified demo users and 0 tickets
const INITIAL_SEED: DatabaseData = {
  users: [
    {
      id: 'usr_admin_1',
      name: 'Marcus Sterling',
      email: 'marcus@resolvehq.internal',
      role: 'admin',
      department: 'IT Infrastructure',
      jobTitle: 'VP of IT Operations',
      createdAt: '2026-01-15T08:00:00Z',
    },
    {
      id: 'usr_agent_1',
      name: 'Sarah Chen',
      email: 'sarah.chen@resolvehq.internal',
      role: 'agent',
      department: 'Tier-2 Support',
      jobTitle: 'Senior Systems Specialist',
      createdAt: '2026-02-01T09:30:00Z',
    },
    {
      id: 'usr_agent_2',
      name: 'Alex Rivera',
      email: 'alex.rivera@resolvehq.internal',
      role: 'agent',
      department: 'Network Operations',
      jobTitle: 'Network & Security Engineer',
      createdAt: '2026-02-10T10:15:00Z',
    },
    {
      id: 'usr_emp_1',
      name: 'Elena Rostova',
      email: 'elena.rostova@acmecorp.com',
      role: 'employee',
      department: 'Product Design',
      jobTitle: 'Lead Product Designer',
      createdAt: '2026-03-01T11:00:00Z',
    },
    {
      id: 'usr_emp_2',
      name: 'David Kim',
      email: 'david.kim@acmecorp.com',
      role: 'employee',
      department: 'Engineering',
      jobTitle: 'Staff Backend Engineer',
      createdAt: '2026-03-12T14:20:00Z',
    },
  ],
  tickets: [],
  comments: [],
  activities: [],
  notifications: [],
};

class DatabaseStore {
  private data: DatabaseData;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseData {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.users && Array.isArray(parsed.users)) {
          return {
            users: parsed.users,
            tickets: parsed.tickets || [],
            comments: parsed.comments || [],
            activities: parsed.activities || [],
            notifications: parsed.notifications || [],
          };
        }
      }
    } catch (e) {
      console.warn('Error reading db.json, writing clean database:', e);
    }

    this.saveData(INITIAL_SEED);
    return JSON.parse(JSON.stringify(INITIAL_SEED));
  }

  private saveData(data: DatabaseData): void {
    try {
      this.ensureDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing to db.json:', e);
    }
  }

  public get<K extends keyof DatabaseData>(key: K): DatabaseData[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseData>(key: K, value: DatabaseData[K]): void {
    this.data[key] = value;
    this.saveData(this.data);
  }

  public reload(): void {
    this.data = this.loadData();
  }

  public resetToSeed(): DatabaseData {
    this.data = JSON.parse(JSON.stringify(INITIAL_SEED));
    this.saveData(this.data);
    return this.data;
  }
}

export const db = new DatabaseStore();
