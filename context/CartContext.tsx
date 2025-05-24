'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/utils/supabaseClient';

type CartItem = {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  cartCount: number;
  refreshCart: () => void;
};

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  cartCount: 0,
  refreshCart: () => {}
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Cargar el carrito desde Supabase
  const refreshCart = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setCart([]);
      setCartCount(0);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('product_id, quantity, product:product_id(name, price, image_url)')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error al obtener carrito:', error.message);
      return;
    }

    const transformed = data.map((item: any) => ({
      id: item.product_id,
      name: item.product.name,
      price: item.product.price,
      image_url: item.product.image_url,
      quantity: item.quantity
    }));

    setCart(transformed);
    setCartCount(transformed.reduce((sum, item) => sum + item.quantity, 0));
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (product: CartItem) => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from('cart_items').upsert(
      {
        user_id: user.id,
        product_id: product.id,
        quantity: 1
      },
      { onConflict: 'user_id,product_id' }
    );

    if (!error) {
      refreshCart();
    } else {
      console.error('Error al agregar al carrito:', error.message);
    }
  };

  const removeFromCart = async (productId: number) => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (!error) {
      refreshCart();
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (!error) {
      refreshCart();
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, cartCount, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
