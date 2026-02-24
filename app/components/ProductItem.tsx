import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
  | CollectionItemFragment
  | ProductItemFragment
  | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <div className="product-image-container">
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        </div>
      )}
      <div className="product-info">
        <span className="technical-label" style={{ fontSize: '0.6rem', marginBottom: '0.5rem', display: 'block' }}>
          SERIES // 00{Math.floor(Math.random() * 9) + 1}
        </span>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', textTransform: 'none' }}>{product.title}</h4>
        <small className="product-price" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: '0.8rem' }}>
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </div>
    </Link>
  );
}
