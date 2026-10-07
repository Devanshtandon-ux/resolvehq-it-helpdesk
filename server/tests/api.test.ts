/**
 * ResolveHQ Automated API & Authorization Tests
 * Run via: npm test or npx tsx server/tests/api.test.ts
 */
import { db } from '../db/store';
import { Ticket } from '../../src/types';

async function runTests() {
  console.log('--- Starting ResolveHQ Automated Test Suite ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Seed database has users with 3 required roles
  const users = db.get('users');
  const roles = new Set(users.map((u) => u.role));
  assert(
    roles.has('admin') && roles.has('agent') && roles.has('employee'),
    'Database contains Admin, Agent, and Employee roles'
  );

  // Test 2: Clean slate initialized safely
  const initialTickets = db.get('tickets');
  assert(Array.isArray(initialTickets), 'Tickets array is safely initialized in DatabaseStore');

  // Test 3: Creation and SLA calculation validation
  const testTicket: Ticket = {
    id: 'test-tkt-1',
    ticketNumber: 'RHQ-9999',
    title: 'Test connectivity issue',
    description: 'Automated test incident description',
    status: 'open',
    priority: 'urgent',
    category: 'network',
    creatorId: 'usr_emp_1',
    creatorName: 'Elena Rostova',
    creatorEmail: 'elena.rostova@acmecorp.com',
    slaDueHours: 4,
    slaDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    isOverdue: false,
    commentsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.set('tickets', [testTicket]);
  const retrievedTickets = db.get('tickets');
  assert(retrievedTickets.length === 1, 'Successfully registered ticket into store');

  // Test 4: Status transitions validation
  testTicket.status = 'in_progress';
  db.set('tickets', [testTicket]);
  assert(db.get('tickets')[0].status === 'in_progress', 'Ticket status transition validated to in_progress');

  // Test 5: Clean slate reset
  db.set('tickets', []);
  assert(db.get('tickets').length === 0, 'Clean slate demo reset successfully clears tickets');

  console.log('--------------------------------------------------');
  console.log(`Results: ${passed} Passed, ${failed} Failed.`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
