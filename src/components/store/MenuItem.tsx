import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MenuItemType } from "@/types/store";
import { Plus } from "lucide-react";

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType) => void;
}

export const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  return (
    <Card className="overflow-hidden">
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
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">${item.price}</p>
          <Button size="sm" onClick={() => onAddToCart(item)}>
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