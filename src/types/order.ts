export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
}