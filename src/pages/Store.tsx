import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { MenuItem } from "@/components/store/MenuItem";
import { Cart } from "@/components/store/Cart";
import { StoreHeader } from "@/components/store/StoreHeader";
import { MenuItemType, CartItemType, StoreCustomization } from "@/types/store";

export default function Store() {
  const { businessId, storeName } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState<StoreCustomization | null>(null);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        let query = supabase
          .from('business_customizations')
          .select('*, profiles:business_id(business_name)');

        if (storeName) {
          query = query.eq('public_name', storeName);
        } else if (businessId) {
          query = query.eq('business_id', businessId);
        }

        const { data, error } = await query.maybeSingle();

        if (error) throw error;
        if (!data) {
          toast({
            title: "Store not found",
            description: "The requested store could not be found.",
            variant: "destructive",
          });
          return;
        }

        // Parse and validate menu items
        const menuItems = Array.isArray(data.menu_items) 
          ? data.menu_items.map((item: any): MenuItemType => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              image_url: item.image_url,
              category: item.category
            }))
          : [];

        // Create the store data with properly typed menu items
        const parsedData: StoreCustomization = {
          ...data,
          menu_items: menuItems
        };

        setStoreData(parsedData);
      } catch (error: any) {
        console.error('Error fetching store data:', error);
        toast({
          title: "Error",
          description: "Failed to load store data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [businessId, storeName, toast]);

  const addToCart = (item: MenuItemType) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return currentCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...currentCart, { ...item, quantity: 1 }];
    });

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(currentCart => {
      return currentCart.reduce((acc, item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? [...acc, { ...item, quantity: newQuantity }] : acc;
        }
        return [...acc, item];
      }, [] as CartItemType[]);
    });
  };

  const handleCheckoutComplete = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
          <p className="text-muted-foreground">The requested store could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen" 
      style={{ backgroundColor: storeData?.body_background_color || '#f5f5f5' }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger className="hidden" />
            <StoreHeader 
              storeData={storeData}
              cartItemsCount={cart.length}
              onCartClick={() => setIsCartOpen(true)}
            />
            <Cart 
              cart={cart}
              storeData={storeData}
              updateQuantity={updateQuantity}
              onCheckoutComplete={handleCheckoutComplete}
            />
          </Sheet>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {storeData?.menu_items && storeData.menu_items.length > 0 ? (
              storeData.menu_items.map((item: MenuItemType) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  storeData={storeData}
                  onAddToCart={addToCart}
                />
              ))
            ) : (
              <p 
                className="text-muted-foreground col-span-full text-center py-8"
                style={{ color: storeData?.text_color }}
              >
                No menu items available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}