import db from '../src/lib/db';
import { seedDemoData } from '../src/lib/seed';

console.log('Seeding demo data into database...');
seedDemoData(db);
console.log('Demo data seeded successfully.');
