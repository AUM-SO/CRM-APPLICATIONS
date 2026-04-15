/**
 * Generate mock_customers.json for documentation / offline use.
 * Run with: npx ts-node -P tsconfig.json scripts/generate-mock-data.ts
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateMockCustomers } from '../src/shared/mock-data/mock-customers.generator';

const customers = generateMockCustomers();
const outputPath = join(__dirname, '../src/shared/mock-data/mock_customers.json');
writeFileSync(outputPath, JSON.stringify(customers, null, 2), 'utf-8');
console.log(`Generated ${customers.length} records → ${outputPath}`);
