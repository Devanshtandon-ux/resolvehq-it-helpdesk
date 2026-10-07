/**
 * ResolveHQ Database Seed Script
 * Can be run via: npm run seed
 */
import { db } from './store';

console.log('Seeding ResolveHQ database with production demo data...');
const seeded = db.resetToSeed();
console.log(`Successfully seeded:`);
console.log(`- ${seeded.users.length} Users (Admin, Agents, Employees)`);
console.log(`- ${seeded.tickets.length} IT Help Desk Tickets with SLA timers`);
console.log(`- ${seeded.comments.length} Discussion comments`);
console.log(`- ${seeded.activities.length} Audit activity logs`);
console.log(`- ${seeded.notifications.length} In-app notifications`);
console.log('Seed completed successfully.');
