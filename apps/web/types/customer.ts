export type RecentActivity = {
  action: string;
  time: string;
};

export type Customer = {
  id: number;
  name: string;
  company: string;
  initials: string;
  active_since: string;
  email: string;
  phone: string;
  salesperson: string;
  credit_status: "No Credit" | "Good Standing" | "Overdue" | "Credit Hold" | "Excellent";
  status: "Active" | "Inactive" | "Pending";
  total_spend: number;
  number_of_purchases: number;
  last_activity: string;
  recent_activity: RecentActivity[];
};
