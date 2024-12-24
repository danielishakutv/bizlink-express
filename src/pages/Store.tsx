import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/types/menu";
import { ShoppingCart, Phone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Store() {
  const { businessId } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{item: MenuItem, quantity: number}[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const { data: customization, error: customizationError } = await supabase
          .from('business_customizations')
          .select('menu_items, public_name')
          .eq('business_id', businessId)
          .single();

        if (customizationError) throw customizationError;

        if (customization) {
          // Type assertion to ensure menu_items is treated as MenuItem[]
          const items = (customization.menu_items as unknown as MenuItem[]) || [];
          setMenuItems(items);
          setBusinessName(customization.public_name || 'Our Store');
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

    fetchBusinessDetails();
  }, [businessId, toast]);

  const addToCart = (item: MenuItem) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return currentCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...currentCart, { item, quantity: 1 }];
    });

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(currentCart => currentCart.filter(item => item.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(currentCart =>
      currentCart.map(item =>
        item.item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, { item, quantity }) => total + item.price * quantity, 0);
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleCheckout = async () => {
    if (!validatePhoneNumber(customerPhone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    if (!customerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderData = {
        business_id: businessId,
        customer_name: customerName,
        customer_phone: customerPhone,
        items: cart.map(({ item, quantity }) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
        })),
        total_amount: calculateTotal(),
        status: 'pending',
      };

      const { error } = await supabase
        .from('orders')
        .insert(orderData);

      if (error) throw error;

      toast({
        title: "Order placed successfully",
        description: "We'll contact you shortly with order details",
      });

      // Reset cart and checkout form
      setCart([]);
      setCustomerPhone("");
      setCustomerName("");
      setIsCheckingOut(false);
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{businessName}</h1>
        <p className="text-muted-foreground mt-2">Welcome to our store</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <p className="text-muted-foreground">{item.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">${item.price.toFixed(2)}</p>
                <Button onClick={() => addToCart(item)}>Add to Cart</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span>Cart ({cart.length})</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90vw] sm:max-w-[400px]">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          <div className="mt-8 space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground">Your cart is empty</p>
            ) : (
              <>
                {cart.map(({ item, quantity }) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} x {quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                      >
                        -
                      </Button>
                      <span>{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  {!isCheckingOut ? (
                    <Button
                      className="w-full"
                      onClick={() => setIsCheckingOut(true)}
                    >
                      Proceed to Checkout
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Name
                        </label>
                        <Input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+1234567890"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleCheckout}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Place Order
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}