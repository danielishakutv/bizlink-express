import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { CartItemType } from "@/types/store";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, change: number) => void;
  currency: string;
}

export const CartItem = ({ item, updateQuantity, currency }: CartItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          ₦ {item.price.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(item.id, -1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span>{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(item.id, 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};