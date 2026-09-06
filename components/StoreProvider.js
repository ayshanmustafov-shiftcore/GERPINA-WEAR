'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products } from '@/data/products';

const StoreContext = createContext(null);
const VALID_AUDIENCES = ['women', 'men', 'kids'];
const PRODUCT_MAP = new Map(products.map((product) => [product.id, product]));

function getVariantStock(product, selectedSize = null) {
  if (selectedSize && product.sizes?.length) {
    const variant = product.sizes.find((size) => size.label === selectedSize);
    if (!variant || variant.available === false) return 0;
    if (variant.quantity != null) return Math.max(0, Number(variant.quantity) || 0);
  }
  return Math.max(0, Number(product.stockQuantity) || 1);
}

function normaliseCart(items) {
  if (!Array.isArray(items)) return [];

  return items.flatMap((item) => {
    const product = PRODUCT_MAP.get(item.id);
    if (!product || product.status !== 'in_stock') return [];

    const selectedSize = item.selectedSize || null;
    const stockQuantity = getVariantStock(product, selectedSize);
    if (stockQuantity <= 0) return [];

    return [{
      id: product.id,
      cartKey: `${product.id}::${selectedSize || 'default'}`,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      selectedSize,
      stockQuantity,
      quantity: Math.min(Math.max(1, Number(item.quantity) || 1), stockQuantity),
    }];
  });
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeAudience, setActiveAudienceState] = useState('women');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('gerpina-cart-stock5-v1') || localStorage.getItem('gerpina-cart-stock4-v1') || localStorage.getItem('gerpina-cart-stock3-v1') || '[]');
      setCart(normaliseCart(storedCart));
      const storedFavorites = JSON.parse(localStorage.getItem('gerpina-favorites-inventory-v1') || '[]');
      setFavorites(Array.isArray(storedFavorites) ? storedFavorites.filter((id) => PRODUCT_MAP.has(id)) : []);
      const savedAudience = localStorage.getItem('gerpina-active-audience-v1');
      if (VALID_AUDIENCES.includes(savedAudience)) setActiveAudienceState(savedAudience);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('gerpina-cart-stock5-v1', JSON.stringify(cart));
      localStorage.removeItem('gerpina-cart-stock4-v1');
      localStorage.removeItem('gerpina-cart-stock3-v1');
    }
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('gerpina-favorites-inventory-v1', JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('gerpina-active-audience-v1', activeAudience);
  }, [activeAudience, hydrated]);

  const api = useMemo(() => ({
    cart,
    favorites,
    activeAudience,
    setActiveAudience(audience) {
      if (VALID_AUDIENCES.includes(audience)) setActiveAudienceState(audience);
    },
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    addToCart(product, selectedSize = null) {
      if (product.status !== 'in_stock') return;
      const cartKey = `${product.id}::${selectedSize || 'default'}`;
      setCart((current) => {
        const existing = current.find((item) => item.cartKey === cartKey);
        const max = getVariantStock(product, selectedSize);
        if (max <= 0) return current;
        if (existing) {
          return current.map((item) => item.cartKey === cartKey ? { ...item, quantity: Math.min(item.quantity + 1, max), stockQuantity: max } : item);
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
          stockQuantity: max,
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
    clearCart() {
      setCart([]);
    },
    toggleFavorite(id) {
      if (!PRODUCT_MAP.has(id)) return;
      setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    },
  }), [cart, favorites, activeAudience]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore must be used inside StoreProvider');
  return value;
}
