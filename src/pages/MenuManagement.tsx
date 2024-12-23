import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { MenuItem } from "@/types/menu";

export default function MenuManagement() {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }

    const fetchMenuItems = async () => {
      try {
        const { data: customization, error: customizationError } = await supabase
          .from('business_customizations')
          .select('menu_items, currency')
          .eq('business_id', session.user.id)
          .maybeSingle();

        if (customizationError) throw customizationError;

        if (customization) {
          const items = customization.menu_items as MenuItem[] || [];
          setMenuItems(items);
          setCurrency(customization.currency || "USD");
        }
      } catch (error: any) {
        console.error('Error fetching menu items:', error);
        toast({
          title: "Error",
          description: "Failed to load menu items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [session, navigate, toast]);

  const handleAddItem = () => {
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      price: 0,
      category: "",
    };
    setMenuItems([...menuItems, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof MenuItem, value: string | number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from('business_customizations')
        .upsert({
          business_id: session.user.id,
          menu_items: menuItems as any, // Type assertion needed due to Supabase JSONB type
        }, {
          onConflict: 'business_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Menu items have been saved",
      });
    } catch (error: any) {
      console.error('Error saving menu items:', error);
      toast({
        title: "Error",
        description: "Failed to save menu items",
        variant: "destructive",
      });
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground mt-2">
              Add and manage your menu items
            </p>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

        <div className="space-y-4">
          {menuItems.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">Menu Item</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor={`name-${item.id}`}>Name</Label>
                    <Input
                      id={`name-${item.id}`}
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`category-${item.id}`}>Category</Label>
                    <Input
                      id={`category-${item.id}`}
                      value={item.category}
                      onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`description-${item.id}`}>Description</Label>
                  <Input
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`price-${item.id}`}>Price ({currency})</Label>
                  <Input
                    id={`price-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handleUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={handleAddItem}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
      </div>
    </div>
  );
};
