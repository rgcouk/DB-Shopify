import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div className="product-price" style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--color-muted)' }}>
      {compareAtPrice ? (
        <div className="product-price-on-sale" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {price ? <Money data={price} /> : null}
          <s style={{ fontSize: '0.9rem', opacity: 0.5 }}>
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
