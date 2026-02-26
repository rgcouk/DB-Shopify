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

// Asset Imports
import lionsManeImg from '~/assets/ingredients/pdp/lions-mane.png';
import reishiImg from '~/assets/ingredients/pdp/reishi.png';
import chagaImg from '~/assets/ingredients/pdp/chaga.png';
import cordycepsImg from '~/assets/ingredients/pdp/cordyceps.png';

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
      benefits: ['NEUROGENESIS_PROMOTION', 'COGNITIVE_REPAIR', 'FLOW_STATE_SUSTAIN'],
      hexText: "C-14 H-20",
      image: lionsManeImg,
      clinicalSummary: "Stimulates Nerve Growth Factor (NGF) synthesis through specialized Hericenones, facilitating neural pathway repair and sustained focus."
    },
    "CORDYCEPS MILITARIS": {
      keywords: ["cordyceps", "militaris", "primal", "energy"],
      components: ['CORDYCEPIN', 'ADENOSINE', 'BETA-GLUCANS'],
      benefits: ['ATP_SYNTHESIS', 'OXYGEN_UPTAKE', 'ATHLETIC_ENDURANCE'],
      hexText: "C-10 H-13",
      image: cordycepsImg,
      clinicalSummary: "Optimizes cellular energy recycling (ATP) and increases VO2 max efficiency for consistent physical output without systemic crash."
    },
    "REISHI": {
      keywords: ["reishi", "ganoderma", "rest", "sleep"],
      components: ['TRITERPENES', 'POLYSACCHARIDES', 'GANODERIC_ACID'],
      benefits: ['NERVOUS_SYSTEM_MUTE', 'DEEP_REM_ACTIVATION', 'IMMUNE_VALIDATION'],
      hexText: "C-30 H-44",
      image: reishiImg,
      clinicalSummary: "Modulates the sympathetic nervous system, leveraging Triterpenes to signal deep restoration and immune system reconnaissance."
    },
    "CHAGA": {
      keywords: ["chaga", "inonotus", "immunity"],
      components: ['BETULINIC_ACID', 'MELANIN', 'ANTIOXIDANTS'],
      benefits: ['OXIDATIVE_SHIELD', 'IMMUNE_FORTIFICATION', 'DNA_PROTECTION'],
      hexText: "C-30 H-48",
      image: chagaImg,
      clinicalSummary: "High-density antioxidant shield that neutralizes oxidative stress and fortifies DNA integrity against environmental aging factors."
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
      benefits: ['BIOLOGICAL_ASSIMILATION', 'SYSTEM_NOURISHMENT', 'VITALITY_RECOVERY'],
      hexText: "H-2 O",
      image: lionsManeImg, // Fallback image
      clinicalSummary: "Native forest extract synergy for foundational biological support."
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
          <div className="product-image-wrapper">
            <ProductImage image={selectedVariant?.image} />
            <div className="image-technical-overlay">
              <span className="technical-label">FIDELITY_CHECK // PASSED</span>
              <div className="purity-marker">99.8%</div>
            </div>
          </div>
          <div className="clinical-summary-box-v2">
            <div className="bioactive-header">
              <span className="technical-label">BIOACTIVE_SYNOPSIS</span>
              <h3 className="clinical-title">{clinicalSpecs.ingredient}</h3>
            </div>
            <div className="clinical-body">
              <p>{clinicalSpecs.clinicalSummary || "Clinical-grade extraction optimized for systemic bioavailability."}</p>
              <div className="benefit-pills">
                {clinicalSpecs.benefits.map((benefit, i) => (
                  <span key={i} className="benefit-pill">{benefit.replace('> ', '')}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="product-main">
          <div className="product-header">
            <div className="technical-series">
              SERIES // {seriesNumber} // SYSTEM_READY
            </div>
            <div className="totem-link">
              <span className="animal-icon">{animal.icon}</span>
              <span className="animal-name">{animal.name}</span>
            </div>
            <h1 className="pdp-title">{title}</h1>
            <div className="price-wrapper">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>
          </div>

          <div className="pdp-form-container">
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
          </div>

          <div className="product-narrative-v2">
            <h3 className="ritual-title">{animal.ritual}</h3>
            <div
              className="product-description-v2"
              dangerouslySetInnerHTML={{ __html: cleanDescription(descriptionHtml) }}
            />
          </div>
        </div>
      </div>

      {/* IMMERSIVE NARRATIVE SECTION */}
      <section className="pdp-immersive-narrative" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(${clinicalSpecs.image})` }}>
        <div className="container">
          <div className="narrative-content">
            <span className="technical-label" style={{ color: 'var(--color-accent-gold)' }}>// SPECIES_NARRATIVE</span>
            <h2 className="narrative-title">Molecular Precision.</h2>
            <div className="narrative-grid">
              <div className="narrative-text-block">
                <p className="large-p">
                  Our extraction protocol targets the specific bio-structures of the <strong>{clinicalSpecs.ingredient}</strong>. By isolating active components like <em>{clinicalSpecs.components[0]}</em> and <em>{clinicalSpecs.components[1]}</em> at the molecular level, we ensure a therapeutic yield that standard powders cannot match.
                </p>
                <div className="component-breakdown-hud">
                  {clinicalSpecs.components.map((comp, i) => (
                    <div key={i} className="component-callout">
                      <span className="comp-name">{comp}</span>
                      <div className="comp-bar"><div className="comp-fill" style={{ width: '99.8%' }}></div></div>
                      <span className="comp-val">99.8%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="narrative-visual">
                <div className="hero-alchemy-matrix-large">
                  <div className="matrix-circle outer"></div>
                  <div className="matrix-circle middle"></div>
                  <div className="matrix-polygon triangle"></div>
                  <span className="alchemy-text-large">{clinicalSpecs.hexText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE HONEY MATRIX HUD - PD VERSION */}
      <section className="pdp-honey-matrix">
        <div className="container">
          <div className="matrix-hud-container">
            <div className="hud-header">
              <span className="technical-label">DELIVERY_SYSTEM // BIOAVAILABILITY_PROTOCOL</span>
              <h2 className="hud-title">The Honey Matrix.</h2>
            </div>
            <div className="hud-features">
              <div className="hud-feature">
                <div className="hud-icon">01</div>
                <div className="hud-info">
                  <h4>Oral Mucosal Pathway</h4>
                  <p>Raw honey enables sublingual absorption, bypassing digestive acids for faster systemic entry.</p>
                </div>
              </div>
              <div className="hud-feature">
                <div className="hud-icon">02</div>
                <div className="hud-info">
                  <h4>Enzyme Shield</h4>
                  <p>Natural enzymes in the honey matrix protect fragile fungal compounds from thermal degradation.</p>
                </div>
              </div>
              <div className="hud-feature">
                <div className="hud-icon">03</div>
                <div className="hud-info">
                  <h4>Targeted Synthesis</h4>
                  <p>Increased bioavailability factor of 3.4x vs standardized capsule-based extractions.</p>
                </div>
              </div>
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
