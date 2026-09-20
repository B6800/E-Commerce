import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { MOCK_PRODUCTS, getCatalogProductImage } from '@/data/mockCatalog';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const localCartKey = user ? `techstore-local-cart:${user.id}` : null;
  const isLocalProduct = (productId: string) =>
    MOCK_PRODUCTS.some((product) => product.id === productId);

  const readLocalCart = (): CartItem[] => {
    if (!localCartKey) return [];

    try {
      return JSON.parse(localStorage.getItem(localCartKey) ?? '[]') as CartItem[];
    } catch {
      localStorage.removeItem(localCartKey);
      return [];
    }
  };

  const saveLocalCart = (cartItems: CartItem[]) => {
    if (!localCartKey) return;
    const localItems = cartItems.filter((item) => isLocalProduct(item.product_id));
    localStorage.setItem(localCartKey, JSON.stringify(localItems));
  };

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          product:products (
            id,
            name,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      const remoteItems: CartItem[] = (data ?? []).map((item) => ({
        ...item,
        product: {
          ...item.product,
          image_url: getCatalogProductImage(item.product.name, item.product.image_url),
        },
      }));
      setItems([...remoteItems, ...readLocalCart()]);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to cart",
        variant: "destructive"
      });
      return;
    }

    try {
      const existingItem = items.find(item => item.product_id === productId);

      if (isLocalProduct(productId)) {
        const product = MOCK_PRODUCTS.find((item) => item.id === productId)!;
        const nextItems = existingItem
          ? items.map((item) => item.product_id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item)
          : [...items, {
              id: `local-${product.id}`,
              product_id: product.id,
              quantity: 1,
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
              },
            }];

        setItems(nextItems);
        saveLocalCart(nextItems);
        toast({
          title: "Added to cart",
          description: "Item added to your cart successfully"
        });
        return;
      }
      
      if (existingItem) {
        await updateQuantity(productId, existingItem.quantity + 1);
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: 1
          });

        if (error) throw error;
        await fetchCartItems();
        
        toast({
          title: "Added to cart",
          description: "Item added to your cart successfully"
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    if (isLocalProduct(productId)) {
      const nextItems = items.filter((item) => item.product_id !== productId);
      setItems(nextItems);
      saveLocalCart(nextItems);
      toast({
        title: "Removed from cart",
        description: "Item removed from your cart"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await fetchCartItems();
      
      toast({
        title: "Removed from cart",
        description: "Item removed from your cart"
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || quantity < 0) return;

    if (quantity === 0) {
      await removeFromCart(productId);
      return;
    }

    if (isLocalProduct(productId)) {
      const nextItems = items.map((item) => item.product_id === productId
        ? { ...item, quantity }
        : item);
      setItems(nextItems);
      saveLocalCart(nextItems);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      if (localCartKey) localStorage.removeItem(localCartKey);
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
//Comment
