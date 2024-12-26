import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { CartItemType, StoreCustomization } from "@/types/store";

interface CartItemProps {
  item: CartItemType;
  storeData: StoreCustomization;
  updateQuantity: (id: string, change: number) => void;
}

export const CartItem = ({ item, storeData, updateQuantity }: CartItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-medium" style={{ color: storeData.secondary_color }}>
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {storeData.currency} {item.price.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(item.id, -1)}
          style={{
            borderColor: storeData.secondary_color,
            color: storeData.secondary_color
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span>{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(item.id, 1)}
          style={{
            borderColor: storeData.secondary_color,
            color: storeData.secondary_color
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};