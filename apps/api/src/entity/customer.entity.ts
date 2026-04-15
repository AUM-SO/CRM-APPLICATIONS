export interface RecentActivity {
  action: string;
  time: string;
}

export interface CustomerEntity {
  id: number;
  name: string;
  company: string;
  initials: string;
  active_since: string;
  email: string;
  phone: string;
  salesperson: string;
  credit_status: string;
  status: string;
  total_spend: number;
  number_of_purchases: number;
  last_activity: string;
  recent_activity: RecentActivity[];
}
