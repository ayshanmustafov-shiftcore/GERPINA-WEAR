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
                <Link href={`/product/${item.slug}`} className="cart-thumb"><Image src={item.image} alt={item.name[language]} fill sizes="150px" /></Link>
                <div className="cart-item-copy">
                  <span>{item.brand || 'GERPINA Selection'}</span>
                  <Link href={`/product/${item.slug}`}>{item.name[language]}</Link>
                  <small>{language === 'bg' ? 'Размер: предстои' : 'Size: pending'}</small>
                  <div className="cart-pricing-row">
                    <div><small>{language === 'bg' ? 'Единична цена' : 'Unit price'}</small><strong>€{item.price.toFixed(2)}</strong></div>
                    <div><small>{language === 'bg' ? 'Общо за артикула' : 'Line total'}</small><strong>€{(item.price * item.quantity).toFixed(2)}</strong></div>
                  </div>
                  <div className="cart-quantity-row">
                    <span>{language === 'bg' ? 'Количество' : 'Quantity'}</span>
                    <div className="quantity-control">
                      <button type="button" aria-label={language === 'bg' ? 'Намали количеството' : 'Decrease quantity'} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <b>{item.quantity}</b>
                      <button type="button" aria-label={language === 'bg' ? 'Увеличи количеството' : 'Increase quantity'} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(item.id)}>{language === 'bg' ? 'Премахни' : 'Remove'}</button>
                </div>
              </article>
            ))}
          </section>
          <aside className="cart-summary">
            <h2>{language === 'bg' ? 'Обобщение' : 'Summary'}</h2>
            <div><span>{language === 'bg' ? 'Продукти' : 'Items'}</span><b>€{cartTotal.toFixed(2)}</b></div>
            <div><span>{language === 'bg' ? 'Доставка' : 'Delivery'}</span><b>{language === 'bg' ? 'Изчислява се при поръчка' : 'Calculated at checkout'}</b></div>
            <div className="cart-total"><span>{language === 'bg' ? 'Общо продукти' : 'Items total'}</span><strong>€{cartTotal.toFixed(2)}</strong></div>
            <Link href="/checkout" className="checkout-button">{t.common.checkout}</Link>
            <p>{language === 'bg' ? 'Checkout страницата вече е налична като демо. Финалното изпращане и връзката с Еконт ще бъдат активирани по-късно.' : 'The checkout page is now available as a demo. Final submission and the Econt connection will be activated later.'}</p>
          </aside>
        </div>
      )}
    </main>
  );
}
