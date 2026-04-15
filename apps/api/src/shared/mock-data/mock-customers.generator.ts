import { CustomerEntity, RecentActivity } from '../../entity/customer.entity';

// Seeded pseudo-random number generator (Mulberry32)
function createRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = createRng(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)] as T;
}

function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 2): number {
  const val = rand() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

// ---- Data pools ----

const firstNames = [
  'Ava', 'Liam', 'Emma', 'Noah', 'Olivia', 'James', 'Sophia', 'William',
  'Isabella', 'Benjamin', 'Mia', 'Lucas', 'Charlotte', 'Henry', 'Amelia',
  'Alexander', 'Harper', 'Mason', 'Evelyn', 'Ethan', 'Abigail', 'Michael',
  'Emily', 'Daniel', 'Elizabeth', 'Logan', 'Mila', 'Jackson', 'Ella',
  'Sebastian', 'Aria', 'Jack', 'Scarlett', 'Aiden', 'Victoria', 'Owen',
  'Madison', 'Samuel', 'Luna', 'Carter', 'Grace', 'Wyatt', 'Chloe',
  'John', 'Penelope', 'Luke', 'Layla', 'Julian', 'Riley', 'Grayson',
  'Zoey', 'Levi', 'Nora', 'Isaac', 'Lily', 'Gabriel', 'Eleanor',
  'Anthony', 'Hannah', 'Dylan', 'Lillian', 'Lincoln', 'Addison', 'Jaxon',
  'Aubrey', 'Asher', 'Ellie', 'Christopher', 'Stella', 'Josiah', 'Natalie',
  'Andrew', 'Zoe', 'Thomas', 'Leah', 'Joshua', 'Hazel', 'Ezra', 'Violet',
  'Hudson', 'Aurora', 'Charles', 'Savannah', 'Caleb', 'Audrey', 'Ryan',
  'Brooklyn', 'Nathan', 'Bella', 'Adrian', 'Claire', 'Eli', 'Skylar',
  'Nolan', 'Lucy', 'Aaron', 'Paisley', 'Cameron', 'Everly', 'Waylon',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Turner', 'Phillips', 'Evans', 'Collins', 'Stewart',
  'Morris', 'Morgan', 'Reed', 'Cook', 'Bell', 'Murphy', 'Bailey',
  'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres', 'Peterson',
  'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders',
  'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman',
  'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores',
  'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant',
  'Alexander', 'Russell', 'Griffin', 'Diaz', 'Hayes',
];

const companies = [
  'Apex Solutions', 'BlueSky Technologies', 'Crimson Analytics', 'Delta Ventures',
  'Echo Systems', 'Frontier Digital', 'Global Nexus', 'Horizon Dynamics',
  'Innovatech Corp', 'Juniper Labs', 'Keystone Partners', 'Luminary Group',
  'Momentum Capital', 'NovaStar Industries', 'Orbit Consulting', 'Pinnacle Brands',
  'Quantum Networks', 'Radiant Media', 'Sterling Commerce', 'Titan Logistics',
  'Ultratech Solutions', 'Vertex Analytics', 'Wavelength Media', 'Xenith Systems',
  'Zenith Enterprises', 'Arcadia Holdings', 'Beacon Financial', 'Cascade Retail',
  'Dynamo Ventures', 'Ember Technologies', 'Falcon Digital', 'Genesis Corp',
  'Helios Partners', 'Ignite Marketing', 'Jade Analytics', 'Kinetic Systems',
  'Launchpad Studios', 'Maxima Consulting', 'Nexus Brands', 'Optic Media',
  'Prestige Group', 'Quartz Logistics', 'Redwood Capital', 'Summit Industries',
  'Tempest Networks', 'Unity Enterprises', 'Valor Holdings', 'Waveform Inc',
  'Xtreme Solutions', 'Yellowstone Partners', 'Alpha Prime Ltd', 'BrightPath Group',
  'Clarity Ventures', 'DeepRoot Analytics', 'Elevate Corp', 'FlowState Media',
  'GreenLeaf Holdings', 'HighPoint Technologies', 'Inertia Labs', 'Junction Capital',
  'Keyline Partners', 'Lodestar Systems', 'Marketplace Inc', 'Northstar Digital',
  'Oculus Ventures', 'Pathway Consulting', 'Quintessence Corp', 'Riverstone Group',
  'Solaris Industries', 'Tectonic Brands', 'Uplift Networks', 'Vanguard Analytics',
  'Westridge Capital', 'Xcelerate Solutions', 'Yellowbrick Inc', 'Zephyr Holdings',
  'Axiom Technologies', 'Blueprint Partners', 'Cobalt Systems', 'Driftwood Media',
  'Endeavour Corp', 'Fieldstone Ventures', 'Grandview Logistics', 'Heritage Digital',
  'Interlink Solutions', 'Jetstream Capital', 'Kaleidoscope Inc', 'Landmark Partners',
  'Midpoint Analytics', 'Northwind Systems', 'Overture Holdings', 'Prism Media',
  'Quattro Consulting', 'Ridgeline Corp', 'Silvergate Partners', 'Trident Networks',
  'Undercurrent Studios', 'Vitality Group', 'Windfall Technologies', 'Xero Solutions',
  'Yardstick Analytics', 'Zebrafish Digital',
];

const salespersons = [
  'Jane White', 'Michael Chen', 'Sarah Johnson', 'Robert Kim',
  'Emily Davis', 'David Park', 'Lisa Thompson', 'James Wilson',
  'Anna Martinez', 'Kevin Brown', 'Rachel Lee', 'Chris Taylor',
];

const creditStatuses = ['Good Credit', 'No Credit', 'Bad Credit', 'Excellent Credit'];
const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Pending'];

const activityActions = [
  'Generated Report', 'Received Email', 'Subscribed Promotion', 'Updated Profile',
  'Updated Billing', 'Placed Order', 'Made Payment', 'Opened Support Ticket',
  'Downloaded Invoice', 'Renewed Subscription', 'Cancelled Order', 'Requested Quote',
  'Attended Webinar', 'Completed Survey', 'Reviewed Contract', 'Submitted Feedback',
  'Scheduled Meeting', 'Viewed Proposal', 'Accepted Terms', 'Upgraded Plan',
];

function formatRelativeTime(minutesAgo: number): string {
  if (minutesAgo < 60) return `${minutesAgo} min ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  const monthsAgo = Math.floor(daysAgo / 30);
  return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + rand() * (end.getTime() - start.getTime()));
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0] as string;
}

let cachedData: CustomerEntity[] | null = null;

export function generateMockCustomers(): CustomerEntity[] {
  if (cachedData) return cachedData;

  const activeSinceStart = new Date('2018-01-01');
  const activeSinceEnd = new Date('2024-12-31');
  const lastActivityStart = new Date('2025-01-01');
  const lastActivityEnd = new Date('2026-04-14');

  const customers: CustomerEntity[] = [];

  for (let i = 1; i <= 1000; i++) {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const name = `${firstName} ${lastName}`;
    const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`;
    const company = pick(companies);
    const activeSince = randomDate(activeSinceStart, activeSinceEnd);
    const lastActivityDate = randomDate(lastActivityStart, lastActivityEnd);

    const emailDomain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`;

    const areaCode = randInt(10, 99);
    const phone = `0${areaCode}-${randInt(1000, 9999)}-${randInt(1000, 9999)}`;

    const recentActivity: RecentActivity[] = [];
    let currentMinutes = randInt(5, 30);
    const usedActions = new Set<string>();

    for (let j = 0; j < 5; j++) {
      let action = pick(activityActions);
      let attempts = 0;
      while (usedActions.has(action) && attempts < 10) {
        action = pick(activityActions);
        attempts++;
      }
      usedActions.add(action);
      recentActivity.push({ action, time: formatRelativeTime(currentMinutes) });
      currentMinutes += randInt(30, 480);
    }

    customers.push({
      id: i,
      name,
      company,
      initials,
      active_since: toISODate(activeSince),
      email,
      phone,
      salesperson: pick(salespersons),
      credit_status: pick(creditStatuses),
      status: pick(statuses),
      total_spend: Number(randFloat(500, 500000, 0)),
      number_of_purchases: randInt(1, 500),
      last_activity: lastActivityDate.toISOString(),
      recent_activity: recentActivity,
    });
  }

  cachedData = customers;
  return customers;
}
