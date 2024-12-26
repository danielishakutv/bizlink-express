import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MenuItemType, StoreCustomization } from "@/types/store";
import { Plus } from "lucide-react";

interface MenuItemProps {
  item: MenuItemType;
  storeData: StoreCustomization;
  onAddToCart: (item: MenuItemType) => void;
}

export const MenuItem = ({ item, storeData, onAddToCart }: MenuItemProps) => {
  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-lg"
      style={{
        borderColor: storeData.secondary_color
      }}
    >
      {item.image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle style={{ color: storeData.secondary_color }}>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold" style={{ color: storeData.secondary_color }}>
            {storeData.currency} {item.price.toFixed(2)}
          </p>
          <Button 
            size="sm" 
            onClick={() => onAddToCart(item)}
            style={{
              backgroundColor: storeData.secondary_color,
              color: storeData.primary_color
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
        )}
      </CardContent>
    </Card>
  );
};