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
  text_color?: string;
  header_color?: string;
  background_color?: string;
  body_background_color?: string;
  item_title_color?: string;
  description_color?: string;
  button_color?: string;
  button_text_color?: string;
  business_description?: string;
  business_address?: string;
  contact_number?: string;
  profiles?: {
    business_name?: string;
  };
  created_at: string;
  updated_at: string;
}