import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StoreCustomization } from "@/types/store";

interface StoreHeaderProps {
  storeData: StoreCustomization;
  cartItemsCount: number;
  onCartClick: () => void;
}

export const StoreHeader = ({ storeData, cartItemsCount, onCartClick }: StoreHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8" 
         style={{ 
           backgroundColor: storeData.primary_color || '#ffffff',
           padding: '1rem',
           borderRadius: '0.5rem'
         }}>
      <div className="flex items-center gap-4">
        {storeData.logo_url && (
          <img 
            src={storeData.logo_url} 
            alt="Store Logo" 
            className="h-16 w-16 object-contain rounded-full"
          />
        )}
        <h1 className="text-3xl font-bold" style={{ color: storeData.secondary_color || '#000000' }}>
          {storeData.profiles?.business_name || storeData.public_name || "Our Store"}
        </h1>
      </div>
      <Button 
        variant="outline" 
        className="relative"
        onClick={onCartClick}
        style={{
          borderColor: storeData.secondary_color,
          color: storeData.secondary_color
        }}
      >
        <ShoppingCart className="h-5 w-5" />
        {cartItemsCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
            style={{
              backgroundColor: storeData.secondary_color,
              color: storeData.primary_color
            }}
          >
            {cartItemsCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};