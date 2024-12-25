import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";

interface StoreLink {
  id: string;
  public_name: string;
}

export const StoreLinks = () => {
  const [storeLinks, setStoreLinks] = useState<StoreLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('business_customizations')
          .select('business_id, public_name')
          .not('public_name', 'is', null);

        if (error) throw error;
        setStoreLinks(data.map(store => ({
          id: store.business_id,
          public_name: store.public_name || 'Unnamed Store'
        })));
      } catch (error) {
        console.error('Error fetching store links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreLinks();
  }, []);

  if (loading) {
    return <div>Loading stores...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Available Stores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {storeLinks.map((store) => (
            <Link
              key={store.id}
              to={`/store/${store.id}`}
              className="block p-2 hover:bg-secondary rounded-md transition-colors"
            >
              {store.public_name}
            </Link>
          ))}
          {storeLinks.length === 0 && (
            <p className="text-muted-foreground">No stores available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};