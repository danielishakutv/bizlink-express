import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [storeUrl, setStoreUrl] = useState("");

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }

    const fetchStoreUrl = async () => {
      try {
        const { data: customization, error } = await supabase
          .from('business_customizations')
          .select('public_name')
          .eq('business_id', session.user.id)
          .single();

        if (!error && customization) {
          setStoreUrl(`/store/${session.user.id}`);
        }
      } catch (error) {
        console.error('Error fetching store URL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreUrl();
  }, [session, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your business from here
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/orders')} className="w-full">
              View Orders
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/menu')} className="w-full">
              Manage Menu
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/team')} className="w-full">
              Manage Team
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/customize')} className="w-full">
              Customize Store
            </Button>
          </CardContent>
        </Card>

        {storeUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Your Store</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to={storeUrl}>
                <Button className="w-full">
                  View Store
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}