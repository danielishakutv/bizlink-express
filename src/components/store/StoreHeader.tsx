import { ShoppingCart, MapPin, Phone, Info } from "lucide-react";
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
    <div className="space-y-4 mb-8">
      <div 
        className="flex justify-between items-center p-4 rounded-lg"
        style={{ 
          backgroundColor: storeData.primary_color,
          color: storeData.text_color
        }}
      >
        <div className="flex items-center gap-4">
          {storeData.logo_url && (
            <img 
              src={storeData.logo_url} 
              alt="Store Logo" 
              className="h-16 w-16 object-contain rounded-full bg-white"
            />
          )}
          <div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: storeData.header_color }}
            >
              {storeData.profiles?.business_name || storeData.public_name || "Our Store"}
            </h1>
            {storeData.business_description && (
              <p 
                className="mt-1"
                style={{ color: storeData.description_color }}
              >
                {storeData.business_description}
              </p>
            )}
          </div>
        </div>
        <Button 
          variant="outline" 
          className="relative"
          onClick={onCartClick}
          style={{
            backgroundColor: storeData.button_color,
            color: storeData.button_text_color,
            borderColor: storeData.button_text_color
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
      
      {(storeData.business_address || storeData.contact_number) && (
        <div 
          className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg"
          style={{ 
            backgroundColor: storeData.background_color,
            color: storeData.text_color
          }}
        >
          {storeData.business_address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{storeData.business_address}</span>
            </div>
          )}
          {storeData.contact_number && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{storeData.contact_number}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};