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
          <p>{language === 'bg' ? 'Разгледай наличните продукти и добави артикул.' : 'Browse the available products and add an item.'}</p>
          <Link href="/shop">{language === 'bg' ? 'Пазарувай сега' : 'Shop now'}</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.cartKey}>
                <Link href={`/product/${item.slug}`} className="cart-thumb">
                  {item.image ? <Image src={item.image} alt={item.name[language]} fill sizes="150px" /> : <div className="mini-image-placeholder"><b>GERPINA</b><span>{language === 'bg' ? 'Снимка скоро' : 'Photo soon'}</span></div>}
                </Link>
                <div className="cart-item-copy">
                  <span>{item.brand || 'GERPINA Selection'}</span>
                  <Link href={`/product/${item.slug}`}>{item.name[language]}</Link>
                  <small>{language === 'bg' ? 'Размер' : 'Size'}: <b>{item.selectedSize || (language === 'bg' ? 'Неуточнен' : 'Unspecified')}</b></small>
                  <div className="cart-pricing-row">
                    <div><small>{language === 'bg' ? 'Единична цена' : 'Unit price'}</small><strong>€{item.price.toFixed(2)}</strong></div>
                    <div><small>{language === 'bg' ? 'Общо за артикула' : 'Line total'}</small><strong>€{(item.price * item.quantity).toFixed(2)}</strong></div>
                  </div>
                  <div className="cart-quantity-row">
                    <span>{language === 'bg' ? 'Количество' : 'Quantity'}</span>
                    <div className="quantity-control">
                      <button type="button" aria-label={language === 'bg' ? 'Намали количеството' : 'Decrease quantity'} onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}>−</button>
                      <b>{item.quantity}</b>
                      <button type="button" disabled={item.quantity >= (item.stockQuantity || 1)} aria-label={language === 'bg' ? 'Увеличи количеството' : 'Increase quantity'} onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}>+</button>
                    </div>
                    {(item.stockQuantity || 1) === 1 && <small className="stock-limit-note">{language === 'bg' ? '1 бр. налична' : '1 pc available'}</small>}
                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(item.cartKey)}>{language === 'bg' ? 'Премахни' : 'Remove'}</button>
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
            <p>{language === 'bg' ? 'Доставката и наложеният платеж ще бъдат финализирани чрез Еконт.' : 'Delivery and cash on delivery will be finalized through Econt.'}</p>
          </aside>
        </div>
      )}
    </main>
  );
}
