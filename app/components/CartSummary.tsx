import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Money, type OptimisticCart } from '@shopify/hydrogen';
import { useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({ cart, layout }: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside panel-technical';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <h3 className="technical-label" style={{ marginBottom: 'var(--space-4)' }}>SUMMARY_TOTALS</h3>
      <dl className="cart-subtotal" style={{ borderBottom: 'var(--border-delicate)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <dt style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-muted)' }}>SUBTOTAL</dt>
        <dd style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <CartDiscounts discountCodes={cart?.discountCodes} />
      <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({ checkoutUrl }: { checkoutUrl?: string }) {
  if (!checkoutUrl) return null;

  return (
    <div style={{ marginTop: 'var(--space-8)' }}>
      <a href={checkoutUrl} target="_self" className="btn-minimal-white" style={{ width: '100%', textAlign: 'center' }}>
        [ CONTINUE TO CHECKOUT ]
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];

  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <dl hidden={!codes.length}>
        <div style={{ marginBottom: 'var(--space-2)' }}>
          <dt className="technical-label" style={{ fontSize: '0.6rem' }}>ACTIVE_DISCOUNTS</dt>
          <UpdateDiscountForm>
            <div className="cart-discount" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>{codes?.join(', ')}</code>
              <button type="submit" aria-label="Remove discount" className="btn-remove" style={{ marginLeft: '0' }}>
                [ X ]
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      <UpdateDiscountForm discountCodes={codes}>
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          <label htmlFor="discount-code-input" className="sr-only">
            Discount code
          </label>
          <input
            id="discount-code-input"
            type="text"
            name="discountCode"
            placeholder="DISCOUNT_CODE"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--color-light)',
              padding: 'var(--space-2) var(--space-4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              width: '100%'
            }}
          />
          <button type="submit" aria-label="Apply discount code" className="btn-qty" style={{ width: 'auto', padding: '0 var(--space-4)' }}>
            +
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({ key: 'gift-card-add' });

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current!.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl style={{ marginBottom: 'var(--space-2)' }}>
          <dt className="technical-label" style={{ fontSize: '0.6rem' }}>GIFT_CARDS</dt>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="cart-discount" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>***{giftCard.lastCharacters}</code>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}><Money data={giftCard.amountUsed} /></span>
                <button type="submit" className="btn-remove" style={{ marginLeft: '0' }}>[ X ]</button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          <input
            type="text"
            name="giftCardCode"
            placeholder="GIFT_CARD"
            ref={giftCardCodeInput}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--color-light)',
              padding: 'var(--space-2) var(--space-4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              width: '100%'
            }}
          />
          <button type="submit" disabled={giftCardAddFetcher.state !== 'idle'} className="btn-qty" style={{ width: 'auto', padding: '0 var(--space-4)' }}>
            +
          </button>
        </div>
      </AddGiftCardForm>
    </div>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}
