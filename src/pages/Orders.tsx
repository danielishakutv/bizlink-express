import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Order } from "@/types/order";
import { Bell } from "lucide-react";

export default function Orders() {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('business_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Type assertion to handle the JSONB to OrderItem[] conversion
        const typedOrders = (data || []).map(order => ({
          ...order,
          items: order.items as any[], // Convert JSONB to OrderItem[]
        }));

        setOrders(typedOrders);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Subscribe to new orders
    const channel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `business_id=eq.${session.user.id}`,
        },
        (payload) => {
          // Show notification for new order
          toast({
            title: "New Order Received",
            description: (
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>New order from {payload.new.customer_name}</span>
              </div>
            ),
          });
          
          // Add new order to the list with proper typing
          setOrders(current => [{
            id: payload.new.id,
            customer_name: payload.new.customer_name,
            customer_email: payload.new.customer_email,
            customer_phone: payload.new.customer_phone,
            items: payload.new.items as any[],
            total_amount: payload.new.total_amount,
            currency: payload.new.currency,
            status: payload.new.status,
            created_at: payload.new.created_at,
          }, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, navigate, toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your orders
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {format(new Date(order.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer_phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>
                    {order.currency} {order.total_amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(order.status)} text-white`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}