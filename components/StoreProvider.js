'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem('gerpina-cart') || '[]'));
      setFavorites(JSON.parse(localStorage.getItem('gerpina-favorites') || '[]'));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('gerpina-cart', JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('gerpina-favorites', JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const api = useMemo(() => ({
    cart,
    favorites,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    addToCart(product) {
      setCart((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        return [...current, { id: product.id, slug: product.slug, name: product.name, brand: product.brand, image: product.image, price: product.price, originalPrice: product.originalPrice, quantity: 1 }];
      });
    },
    updateQuantity(id, quantity) {
      if (quantity <= 0) return setCart((current) => current.filter((item) => item.id !== id));
      setCart((current) => current.map((item) => item.id === id ? { ...item, quantity } : item));
    },
    removeFromCart(id) {
      setCart((current) => current.filter((item) => item.id !== id));
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
