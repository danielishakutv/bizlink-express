export interface MenuItemType {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
}

export interface CartItemType extends MenuItemType {
  quantity: number;
}