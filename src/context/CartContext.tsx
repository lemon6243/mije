import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductOption } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, optionId: string, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, deltaOrQuantity: number, isAbsolute?: boolean) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mije_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (product: Product, optionId: string, quantity: number) => {
    const option = product.options.find((o) => o.id === optionId);
    if (!option) {
      return { success: false, message: '옵션을 선택해 주십시오.' };
    }

    if (option.stock <= 0) {
      return { success: false, message: '선택하신 옵션은 품절되었습니다.' };
    }

    const lineId = `${product.id}_${optionId}`;
    const existingIndex = cart.findIndex((item) => item.id === lineId);

    const currentQtyInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    const requestedTotal = currentQtyInCart + quantity;

    if (requestedTotal > option.stock) {
      return {
        success: false,
        message: `남은 재고(${option.stock}개)보다 많은 수량을 담을 수 없습니다. 현재 장바구니: ${currentQtyInCart}개`,
      };
    }

    setCart((prev) => {
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: requestedTotal,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: lineId,
            productId: product.id,
            product,
            optionId,
            option,
            quantity,
          },
        ];
      }
    });

    return { success: true };
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, value: number, isAbsolute = false) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = isAbsolute ? value : item.quantity + value;
            if (newQty <= 0) return null;
            // Cap at available stock
            const cappedQty = Math.min(newQty, item.option.stock);
            return { ...item, quantity: cappedQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
