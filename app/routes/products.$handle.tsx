import * as React from 'react';
import {
  redirect,
  useLoaderData,
} from 'react-router';
import type { Route } from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import { ProductPrice } from '~/components/ProductPrice';
import { ProductImage } from '~/components/ProductImage';
import { ProductForm } from '~/components/ProductForm';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: `Hydrogen | ${data?.product.title ?? ''}` },
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: product });

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context, params }: Route.LoaderArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const { product } = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml, description, tags = [] } = product;
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();

  const animal = titleLower.includes('focus') ? { name: 'THE_OWL', icon: '🦉', ritual: 'THE_SIGHT_OF_THE_OWL' }
    : titleLower.includes('primal') ? { name: 'THE_GREAT_BEAR', icon: '🐻', ritual: 'THE_HIBERNATE_STRENGTH' }
      : titleLower.includes('rest') ? { name: 'THE_SLUMBERING_BEAR', icon: '🐾', ritual: 'THE_RITUAL_OF_THE_SPOON' }
        : { name: 'DRUID_COMPANION', icon: '🍃', ritual: 'ANCIENT_WISDOM' };

  // --- DIGITAL ALCHEMY KNOWLEDGE BASE --- //
  const INGREDIENT_KNOWLEDGE_BASE = {
    "LION'S MANE": {
      keywords: ["lion's mane", "lions mane", "focus"],
      components: ['HERICENONES', 'ERINACINES', 'BETA-GLUCANS'],
      benefits: ['> NEUROGENESIS_PROMOTION', '> COGNITIVE_REPAIR', '> FLOW_STATE_SUSTAIN'],
      hexText: "C-14 H-20",
    },
    "CORDYCEPS MILITARIS": {
      keywords: ["cordyceps", "militaris", "primal", "energy"],
      components: ['CORDYCEPIN', 'ADENOSINE', 'BETA-GLUCANS'],
      benefits: ['> ATP_SYNTHESIS', '> OXYGEN_UPTAKE', '> ATHLETIC_ENDURANCE'],
      hexText: "C-10 H-13",
    },
    "REISHI": {
      keywords: ["reishi", "ganoderma", "rest", "sleep"],
      components: ['TRITERPENES', 'POLYSACCHARIDES', 'GANODERIC_ACID'],
      benefits: ['> NERVOUS_SYSTEM_MUTE', '> DEEP_REM_ACTIVATION', '> IMMUNE_VALIDATION'],
      hexText: "C-30 H-44",
    },
    "CHAGA": {
      keywords: ["chaga", "inonotus", "immunity"],
      components: ['BETULINIC_ACID', 'MELANIN', 'ANTIOXIDANTS'],
      benefits: ['> OXIDATIVE_SHIELD', '> IMMUNE_FORTIFICATION', '> DNA_PROTECTION'],
      hexText: "C-30 H-48",
    },
  };

  const clinicalSpecs = React.useMemo(() => {
    // 1. Search for known ingredients in title/description/tags
    const searchString = `${titleLower} ${descLower} ${tags.join(' ').toLowerCase()}`;

    // Find the first matching ingredient
    const detectedKey = Object.keys(INGREDIENT_KNOWLEDGE_BASE).find(key =>
      INGREDIENT_KNOWLEDGE_BASE[key as keyof typeof INGREDIENT_KNOWLEDGE_BASE].keywords.some(kw => searchString.includes(kw))
    );

    if (detectedKey) {
      return {
        ingredient: detectedKey,
        ...INGREDIENT_KNOWLEDGE_BASE[detectedKey as keyof typeof INGREDIENT_KNOWLEDGE_BASE]
      };
    }

    // Fallback default
    return {
      ingredient: "WOODLAND EXTRACT",
      components: ['RAW_UK_HONEY', 'BETA-GLUCANS', 'ANTIOXIDANTS'],
      benefits: ['> BIOLOGICAL_ASSIMILATION', '> SYSTEM_NOURISHMENT', '> VITALITY_RECOVERY'],
      hexText: "H-2 O",
    };
  }, [titleLower, descLower, tags]);

  const seriesNumber = React.useMemo(() => `00${Math.floor(Math.random() * 9) + 1}`, []);

  // Function to clean description of shapeshift tags
  const cleanDescription = (html: string) => {
    return html.replace(/\[SHAPESHIFT:.*?\]/g, '');
  };

  return (
    <div className="product-page">
      <div className="product-layout container mb-32">
        <div className="product-image-side">
          <ProductImage image={selectedVariant?.image} />
          <div className="clinical-view panel-technical" style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <div className="spec-grid">
              <div className="spec-group">
                <span className="spec-key">BASE_MEDIUM</span>
                <span className="spec-value">RAW_UK_HONEY</span>
              </div>
              <div className="spec-group">
                <span className="spec-key">SYNTHESIS</span>
                <span className="spec-value">DUAL_EXTRACT</span>
              </div>
              <div className="spec-group">
                <span className="spec-key">PURITY</span>
                <span className="spec-value">99.8%_FRUITING_BODY</span>
              </div>
              <div className="spec-group">
                <span className="spec-key">STATUS</span>
                <span className="spec-value status-validated">VALIDATED</span>
              </div>
            </div>
            <div className="clinical-visuals" style={{ borderTop: 'var(--border-delicate)', paddingTop: 'var(--space-6)' }}>
              <div className="potency-chart">
                <div className="potency-bar-refined">
                  <div className="bar-labels">
                    <span>BETA-GLUCANS</span>
                    <span>92%_</span>
                  </div>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="potency-bar-refined">
                  <div className="bar-labels">
                    <span>TERPENES</span>
                    <span>88%_</span>
                  </div>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="product-main">
          <div className="product-header">
            <div className="technical-series">
              SERIES // {seriesNumber} // SYSTEM_READY
            </div>
            <div className="totem-link" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <span className="animal-icon" style={{ fontSize: '1.5rem' }}>{animal.icon}</span>
              <span className="animal-name" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.25em' }}>{animal.name}</span>
            </div>
            <h1>{title}</h1>
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </div>

          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />

          <div className="product-narrative" style={{ marginTop: 'var(--space-8)', borderTop: 'var(--border-delicate)', paddingTop: 'var(--space-8)' }}>
            <div className="ancient-view">
              <h3 className="ritual-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontStyle: 'italic', marginBottom: 'var(--space-6)', color: 'var(--color-light)' }}>{animal.ritual}</h3>
              <div
                className="product-description"
                style={{ color: 'var(--color-muted)', lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: cleanDescription(descriptionHtml) }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CLINICAL DATA SECTION */}
      <section className="product-clinical-analysis section-dark" style={{ borderTop: 'var(--border-delicate)', paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-12)' }}>
        <div className="container">
          <span className="technical-label" style={{ color: 'var(--color-accent-gold)' }}>// CLINICAL_DEEP_DIVE</span>
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-8)' }}>Biological Validation.</h2>

          <div className="ingredient-grid">
            <div className="ingredient-card panel-technical">
              <span className="technical-label">TARGET_INGREDIENT</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 'var(--space-4) 0', color: 'var(--color-light)' }}>{clinicalSpecs.ingredient}</h3>
              <div className="benefit-list" style={{ marginTop: 'var(--space-6)' }}>
                {clinicalSpecs.benefits.map((benefit, i) => (
                  <li key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: 'var(--space-2)' }}>{benefit}</li>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="technical-label">EXTRACTION_METHOD</span>
                <p style={{ marginTop: 'var(--space-2)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-light)' }}>DUAL_EXTRACTION (WATER/ALCOHOL)</p>
              </div>
            </div>

            <div className="ingredient-card panel-technical" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '300px' }}>
              <div className="hero-alchemy-matrix" style={{ position: 'relative', width: '200px', height: '200px', opacity: 0.5, transform: 'none', top: 'auto', left: 'auto', pointerEvents: 'auto' }}>
                <div className="matrix-circle outer" style={{ animationDuration: '60s' }}></div>
                <div className="matrix-circle middle" style={{ animationDuration: '45s' }}></div>
                <div className="matrix-polygon triangle" style={{ width: '80%', height: '80%', border: '1px solid var(--color-accent-gold)' }}></div>
                <span className="alchemy-text" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', letterSpacing: '0.1em', fontSize: '0.8rem' }}>{clinicalSpecs.hexText}</span>
              </div>
            </div>

            <div className="ingredient-card panel-technical">
              <span className="technical-label">ACTIVE_COMPONENTS</span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-4) 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-light)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {clinicalSpecs.components.map((comp, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 'var(--space-2)' }}>
                    <span>{comp}</span>
                    <span style={{ color: 'var(--color-accent-gold)' }}>[ 99.8% ]</span>
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: 'var(--space-6)', fontSize: '0.9rem', color: 'var(--color-muted)', lineHeight: '1.6' }}>
                Infused natively into a Raw UK Honey matrix to bypass standard digestive degradation, increasing cellular bioavailability by a factor of 3.4x compared to standardized capsule extractions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    tags
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
