import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, DollarSign, Menu, ShoppingCart, Users, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { StoreLinks } from "@/components/store/StoreLinks";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  uniqueCustomers: number;
  menuItemsCount: number;
}

export default function Dashboard() {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    uniqueCustomers: 0,
    menuItemsCount: 0
  });
  const isMobile = useIsMobile();
  const supabaseClient = useSupabaseClient();

  const handleSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
      navigate('/login');
    }
  };

  const fetchDashboardStats = async () => {
    if (!session) return;

    try {
      // Fetch orders data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, customer_name')
        .eq('business_id', session.user.id);

      if (ordersError) throw ordersError;

      // Fetch menu items count
      const { data: customization, error: customizationError } = await supabase
        .from('business_customizations')
        .select('menu_items')
        .eq('business_id', session.user.id)
        .single();

      if (customizationError) throw customizationError;

      // Calculate stats
      const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const totalOrders = ordersData?.length || 0;
      const uniqueCustomers = new Set(ordersData?.map(order => order.customer_name)).size;
      const menuItemsCount = (customization?.menu_items as any[] || []).length;

      setStats({
        totalRevenue,
        totalOrders,
        uniqueCustomers,
        menuItemsCount
      });
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }

    const fetchBusinessProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setBusinessProfile(data);
      } catch (error: any) {
        console.error('Error fetching business profile:', error);
        toast({
          title: "Error",
          description: "Failed to load business profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
    fetchDashboardStats();
  }, [session, navigate, toast]);

  const sampleData = [
    { name: 'Jan', value: 400, revenue: 5000 },
    { name: 'Feb', value: 300, revenue: 4200 },
    { name: 'Mar', value: 600, revenue: 6800 },
    { name: 'Apr', value: 800, revenue: 8500 },
    { name: 'May', value: 500, revenue: 5600 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Customize Business Page",
      icon: Settings,
      onClick: () => navigate('/customize'),
      description: "Update your business page appearance"
    },
    {
      title: "Menu Management",
      icon: Menu,
      onClick: () => navigate('/menu'),
      description: "Manage your menu items"
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      onClick: () => navigate('/orders'),
      description: "View and manage orders"
    },
    {
      title: "Team Management",
      icon: Users,
      onClick: () => navigate('/team'),
      description: "Manage your team members"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome, {businessProfile?.business_name || 'Business Owner'}</h1>
        <p className="text-muted-foreground mt-2">Manage your business profile and view insights</p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {stats.totalOrders} orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">Unique customers served</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Orders processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <Menu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.menuItemsCount}</div>
            <p className="text-xs text-muted-foreground">Active menu items</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6 md:mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#9b87f5" 
                  strokeWidth={2}
                  dot={{ fill: "#9b87f5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="w-full justify-between hover:bg-primary/5"
                onClick={action.onClick}
              >
                <div className="flex items-center gap-3">
                  <action.icon className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    {!isMobile && (
                      <div className="text-sm text-muted-foreground">
                        {action.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-muted-foreground">→</div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <StoreLinks />
      </div>

      {isMobile && (
        <div className="mt-8 mb-24">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
}
