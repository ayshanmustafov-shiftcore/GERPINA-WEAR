'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const StoreContext = createContext(null);

function normaliseCart(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    ...item,
    selectedSize: item.selectedSize || null,
    cartKey: item.cartKey || `${item.id}::${item.selectedSize || 'default'}`,
    stockQuantity: item.stockQuantity || 1,
  }));
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setCart(normaliseCart(JSON.parse(localStorage.getItem('gerpina-cart-inventory-v1') || '[]')));
      setFavorites(JSON.parse(localStorage.getItem('gerpina-favorites-inventory-v1') || '[]'));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('gerpina-cart-inventory-v1', JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('gerpina-favorites-inventory-v1', JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const api = useMemo(() => ({
    cart,
    favorites,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    addToCart(product, selectedSize = null) {
      if (product.status !== 'in_stock') return;
      const cartKey = `${product.id}::${selectedSize || 'default'}`;
      setCart((current) => {
        const existing = current.find((item) => item.cartKey === cartKey);
        if (existing) {
          const max = product.stockQuantity || 1;
          return current.map((item) => item.cartKey === cartKey ? { ...item, quantity: Math.min(item.quantity + 1, max) } : item);
        }
        return [...current, {
          id: product.id,
          cartKey,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          selectedSize,
          stockQuantity: product.stockQuantity || 1,
          quantity: 1,
        }];
      });
    },
    updateQuantity(cartKey, quantity) {
      if (quantity <= 0) return setCart((current) => current.filter((item) => item.cartKey !== cartKey));
      setCart((current) => current.map((item) => item.cartKey === cartKey ? { ...item, quantity: Math.min(quantity, item.stockQuantity || 1) } : item));
    },
    removeFromCart(cartKey) {
      setCart((current) => current.filter((item) => item.cartKey !== cartKey));
    },
    toggleFavorite(id) {
      setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    },
  }), [cart, favorites]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore must be used inside StoreProvider');
  return value;
}
