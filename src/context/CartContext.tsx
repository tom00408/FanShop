import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  customName?: string;
  customNumber?: string;
  customInitials?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string, customName?: string, customNumber?: string, customInitials?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string, customName?: string, customNumber?: string, customInitials?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => 
        i.id === item.id && 
        i.size === item.size && 
        i.customName === item.customName && 
        i.customNumber === item.customNumber &&
        i.customInitials === item.customInitials
      );
      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id && 
          i.size === item.size && 
          i.customName === item.customName && 
          i.customNumber === item.customNumber &&
          i.customInitials === item.customInitials
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string, size?: string, customName?: string, customNumber?: string, customInitials?: string) => {
    setItems(currentItems => currentItems.filter(item => 
      !(item.id === id && 
        item.size === size && 
        item.customName === customName && 
        item.customNumber === customNumber &&
        item.customInitials === customInitials)
    ));
  };

  const updateQuantity = (id: string, quantity: number, size?: string, customName?: string, customNumber?: string, customInitials?: string) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id && 
        item.size === size && 
        item.customName === customName && 
        item.customNumber === customNumber &&
        item.customInitials === customInitials
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 