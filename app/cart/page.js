'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';

export default function CartPage() {
  const { language, t } = useLanguage();
  const { cart, cartTotal, updateQuantity, removeFromCart } = useStore();

  return (
    <main className="cart-page page-width">
      <div className="plain-heading"><span>GERPINA</span><h1>{language === 'bg' ? 'Твоята количка' : 'Your bag'}</h1></div>
      {!cart.length ? (
        <div className="empty-state">
          <h2>{language === 'bg' ? 'Количката е празна.' : 'Your bag is empty.'}</h2>
          <p>{language === 'bg' ? 'Разгледай текущата демо селекция и добави продукт.' : 'Browse the current preview selection and add a product.'}</p>
          <Link href="/shop">{language === 'bg' ? 'Пазарувай сега' : 'Shop now'}</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.id}>
                <Link href={`/product/${item.slug}`} className="cart-thumb"><Image src={item.image} alt={item.name[language]} fill sizes="140px" /></Link>
                <div className="cart-item-copy">
                  <span>GERPINA Selection</span>
                  <Link href={`/product/${item.slug}`}>{item.name[language]}</Link>
                  <small>{language === 'bg' ? 'Размер: предстои' : 'Size: pending'}</small>
                  <strong>€{item.price.toFixed(2)}</strong>
                  <div className="quantity-control"><button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button><b>{item.quantity}</b><button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button></div>
                  <button className="remove-item" onClick={() => removeFromCart(item.id)}>{language === 'bg' ? 'Премахни' : 'Remove'}</button>
                </div>
              </article>
            ))}
          </section>
          <aside className="cart-summary">
            <h2>{language === 'bg' ? 'Обобщение' : 'Summary'}</h2>
            <div><span>{language === 'bg' ? 'Продукти' : 'Items'}</span><b>€{cartTotal.toFixed(2)}</b></div>
            <div><span>{language === 'bg' ? 'Доставка' : 'Delivery'}</span><b>—</b></div>
            <div className="cart-total"><span>{language === 'bg' ? 'Общо' : 'Total'}</span><strong>€{cartTotal.toFixed(2)}</strong></div>
            <Link href="/checkout" className="checkout-button">{t.common.checkout}</Link>
            <p>{language === 'bg' ? 'Поръчването все още е деактивирано, докато уточним контактните данни и процеса с Еконт.' : 'Ordering is still disabled until the contact details and Econt flow are confirmed.'}</p>
          </aside>
        </div>
      )}
    </main>
  );
}
