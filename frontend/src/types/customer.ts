// Customer as returned by serializeCustomer.
export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string | null;
  createdAt: string;
}

// Directory row with an aggregated ticket count (serializeCustomerSummary).
export interface CustomerSummary extends Customer {
  ticketCount: number;
}
