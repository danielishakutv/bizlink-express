export interface MenuItemType {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
}

export interface CartItemType extends MenuItemType {
  quantity: number;
}

export interface StoreCustomization {
  id: string;
  business_id: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  public_name?: string;
  menu_items: MenuItemType[];
  currency: string;
  business?: {
    business_name?: string;
  }
}