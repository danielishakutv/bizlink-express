import { useState } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/store/CartItem";
import { CartItemType, StoreCustomization } from "@/types/store";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartProps {
  cart: CartItemType[];
  storeData: StoreCustomization;
  updateQuantity: (id: string, change: number) => void;
  onCheckoutComplete: () => void;
}

export const Cart = ({ cart, storeData, updateQuantity, onCheckoutComplete }: CartProps) => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (!customerPhone.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderData = {
        business_id: storeData?.business_id,
        customer_name: customerName,
        customer_phone: customerPhone,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total_amount: getTotalAmount(),
        currency: storeData?.currency || 'USD',
        status: 'pending'
      };

      const { error } = await supabase
        .from('orders')
        .insert(orderData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your order has been placed successfully!",
      });

      onCheckoutComplete();
      setCustomerName("");
      setCustomerPhone("");
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle style={{ color: storeData.secondary_color }}>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cart.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty</p>
        ) : (
          <>
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                storeData={storeData}
                updateQuantity={updateQuantity}
              />
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{storeData.currency} {getTotalAmount().toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                style={{
                  backgroundColor: storeData.secondary_color,
                  color: storeData.primary_color
                }}
              >
                {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>
            </div>
          </>
        )}
      </div>
    </SheetContent>
  );
};