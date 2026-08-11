'use client';

import { useLanguage } from '@/components/LanguageProvider';
import ConstructionBlock from '@/components/ConstructionBlock';

export default function CheckoutPage() {
  const { language } = useLanguage();
  const bg = language === 'bg';
  return (
    <main>
      <ConstructionBlock
        eyebrow="GERPINA WEAR / CHECKOUT"
        title={bg ? 'Поръчките ще бъдат активирани след инвентара.' : 'Ordering will activate after the inventory is loaded.'}
        description={bg ? 'Финалният checkout ще събира данни за клиента и доставка с Еконт до офис или адрес, след което ще изпраща поръчката по имейл.' : 'The final checkout will collect customer details and Econt office/address delivery information, then send the order by email.'}
      >
        <div className="checkout-preview">
          <div><span>1</span><b>{bg ? 'Данни за клиента' : 'Customer details'}</b></div>
          <div><span>2</span><b>{bg ? 'Еконт офис или адрес' : 'Econt office or address'}</b></div>
          <div><span>3</span><b>{bg ? 'Преглед и изпращане' : 'Review and submit'}</b></div>
        </div>
      </ConstructionBlock>
    </main>
  );
}
