import {
  Await,
  useLoaderData,
  Link,
} from 'react-router';
import type { Route } from './+types/_index';
import { Suspense } from 'react';
import { Image } from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import { ProductItem } from '~/components/ProductItem';
import { Hero } from '~/components/Hero';

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Druid & Bear | High-Precision Extraction. Ancient Woodland Source.' },
    {
      name: 'description',
      content: 'Clinical-grade mushroom extracts infused in raw woodland honey. System-ready fuel for focus, strength, and restoration.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const { storefront } = args.context;
  const [{ collections }] = await Promise.all([
    storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return {
    featuredCollection: collections.nodes[0],
    recommendedProducts,
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context }: Route.LoaderArgs) {
  const [{ collections }] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}


import focusImg from '~/assets/focus.png';
import primalImg from '~/assets/primal.png';
import restImg from '~/assets/rest.png';

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Hero />

      {/* SECTION 1.5: The Core Systems (3 Honeys Feature) */}
      <section className="section-dark" style={{ borderBottom: 'var(--border-delicate)' }}>
        <div className="container">
          <span className="technical-label">CORE_SYSTEMS</span>
          <h2 className="section-title">The Three Pillars.</h2>

          <div className="core-systems-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)', marginTop: 'var(--space-12)' }}>

            {/* System 01: Focus */}
            <Link to="/products/focus-honey" className="system-card panel-technical" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
              <div className="system-image" style={{ aspectRatio: '1/1', overflow: 'hidden', borderBottom: 'var(--border-delicate)', margin: 'calc(var(--space-8) * -1) calc(var(--space-8) * -1) var(--space-8)' }}>
                <img src={focusImg} alt="FOCUS" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.1)', transition: 'var(--transition-liquid)' }} className="hover-grayscale-off" />
              </div>
              <span className="technical-label" style={{ color: 'var(--color-light)' }}>// SYSTEM_01</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-light)', margin: 'var(--space-2) 0' }}>FOCUS</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: 'var(--space-8)', flexGrow: 1 }}>
                Deep work and flow state. LION'S MANE / HERICENE complex. Formulated for mental precision and sustained focus without the crash.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-delicate)', paddingTop: 'var(--space-4)' }}>
                <span className="technical-label">THE_OWL</span>
                <span style={{ color: 'var(--color-light)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>[ ACCESS &rarr; ]</span>
              </div>
            </Link>

            {/* System 02: Primal */}
            <Link to="/products/primal-honey" className="system-card panel-technical" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
              <div className="system-image" style={{ aspectRatio: '1/1', overflow: 'hidden', borderBottom: 'var(--border-delicate)', margin: 'calc(var(--space-8) * -1) calc(var(--space-8) * -1) var(--space-8)' }}>
                <img src={primalImg} alt="PRIMAL" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.1)', transition: 'var(--transition-liquid)' }} className="hover-grayscale-off" />
              </div>
              <span className="technical-label" style={{ color: 'var(--color-light)' }}>// SYSTEM_02</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-light)', margin: 'var(--space-2) 0' }}>PRIMAL</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: 'var(--space-8)', flexGrow: 1 }}>
                Sustained energy and athletic output. CORDYCEPS / MILITARIN complex. The ultimate fuel for your physical quest.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-delicate)', paddingTop: 'var(--space-4)' }}>
                <span className="technical-label">THE_GREAT_BEAR</span>
                <span style={{ color: 'var(--color-light)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>[ ACCESS &rarr; ]</span>
              </div>
            </Link>

            {/* System 03: Rest */}
            <Link to="/products/rest-honey" className="system-card panel-technical" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
              <div className="system-image" style={{ aspectRatio: '1/1', overflow: 'hidden', borderBottom: 'var(--border-delicate)', margin: 'calc(var(--space-8) * -1) calc(var(--space-8) * -1) var(--space-8)' }}>
                <img src={restImg} alt="REST" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.1)', transition: 'var(--transition-liquid)' }} className="hover-grayscale-off" />
              </div>
              <span className="technical-label" style={{ color: 'var(--color-light)' }}>// SYSTEM_03</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-light)', margin: 'var(--space-2) 0' }}>REST</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: 'var(--space-8)', flexGrow: 1 }}>
                Nervous system mute and deep REM. REISHI / TRITERPENE complex. Designed for deep, restorative sleep and recovery.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-delicate)', paddingTop: 'var(--space-4)' }}>
                <span className="technical-label">THE_SLUMBERING_BEAR</span>
                <span style={{ color: 'var(--color-light)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>[ ACCESS &rarr; ]</span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* SECTION 2: Clinical Ingredient Analysis */}
      <section className="section-dark">
        <div className="container">
          <span className="technical-label">BIOLOGICAL_COMPONENTS</span>
          <h2 className="section-title">Rooted in the Woodland. <br /> Proven by Science.</h2>

          <div className="ingredient-grid">
            <div className="ingredient-card panel-technical">
              <span className="benefit-tag">COGNITIVE_REPAIR</span>
              <span className="ingredient-icon">🍄</span>
              <h3 style={{ color: 'var(--color-light)', marginBottom: 'var(--space-2)' }}>Lion's Mane</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Contains hericenones and erinacines that stimulate Nerve Growth Factor (NGF) for neural plasticity and focus.
              </p>
              <ul className="benefit-list">
                <li>ACCELERATED_FLOW_STATE</li>
                <li>NEURAL_DENSITY_SUPPORT</li>
                <li>COGNITIVE_PRECISION</li>
              </ul>
            </div>

            <div className="ingredient-card panel-technical">
              <span className="benefit-tag">ADENOSINE_MODULATION</span>
              <span className="ingredient-icon">⚡</span>
              <h3 style={{ color: 'var(--color-light)', marginBottom: 'var(--space-2)' }}>Cordyceps Militaris</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Enhances cellular ATP production and oxygen utilization. Primal energy without the central nervous system crash.
              </p>
              <ul className="benefit-list">
                <li>ATP_SYNTHESIS_UPREGULATION</li>
                <li>MAX_VO2_OPTIMIZATION</li>
                <li>ADAPTOGENIC_RESILIENCE</li>
              </ul>
            </div>

            <div className="ingredient-card panel-technical">
              <span className="benefit-tag">HOMEOSTATIC_RECOVERY</span>
              <span className="ingredient-icon">🌿</span>
              <h3 style={{ color: 'var(--color-light)', marginBottom: 'var(--space-2)' }}>Ganoderma (Reishi)</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                The 'Mushroom of Immortality.' Rich in triterpenes that modulate the stress response and promote deep REM.
              </p>
              <ul className="benefit-list">
                <li>CORTISOL_MODULATION</li>
                <li>REM_CYCLE_AMPLIFICATION</li>
                <li>SYMPATHETIC_SYSTEM_RESET</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: The Delivery System */}
      <section className="section-light">
        <div className="container">
          <div className="delivery-system-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div>
              <span className="technical-label">BIOAVAILABILITY_PROTOCOL</span>
              <h2 className="section-title">The Honey Matrix.</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-8)' }}>
                Standard extracts are often wasted by the digestive system. We infuse our dual-extracts into <strong>Raw Woodland Honey</strong>—a natural enzyme-rich medium that protects the bioactives and ensures rapid mucosal absorption.
              </p>
              <div className="medical-graphic">
                <div style={{ position: 'relative', zIndex: 2, padding: 'var(--space-6)' }}>
                  <span className="technical-label" style={{ color: 'var(--color-accent-gold)' }}>ABSORPTION_RATE_ANALYSIS</span>
                  <div className="potency-chart" style={{ marginTop: 'var(--space-4)' }}>
                    <div className="potency-bar-refined">
                      <div className="bar-labels"><span>HONEY_MATRIX_DELIVERY</span><span>98%_</span></div>
                      <div className="bar-bg"><div className="bar-fill" style={{ width: '98%' }}></div></div>
                    </div>
                    <div className="potency-bar-refined">
                      <div className="bar-labels"><span>STANDARD_CAPSULE</span><span>34%_</span></div>
                      <div className="bar-bg"><div className="bar-fill" style={{ width: '34%', background: 'var(--color-muted)' }}></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-technical" style={{ padding: 'var(--space-12)' }}>
              <span className="technical-label">CORE_BENEFITS</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
                <div style={{ borderBottom: 'var(--border-delicate)', paddingBottom: 'var(--space-4)' }}>
                  <h4 style={{ color: 'var(--color-light)', marginBottom: 'var(--space-2)' }}>01 // MENTAL_CLARITY</h4>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Eliminate brain fog and stabilize cognitive load during deep work sessions.</p>
                </div>
                <div style={{ borderBottom: 'var(--border-delicate)', paddingBottom: 'var(--space-4)' }}>
                  <h4 style={{ color: 'var(--color-light)', marginBottom: 'var(--space-2)' }}>02 // ENDOCRINE_SUPPORT</h4>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Support hormonal balance and adrenal health through adaptogenic signaling.</p>
                </div>
                <div style={{ borderBottom: 'var(--border-delicate)', paddingBottom: 'var(--space-4)' }}>
                  <h4 style={{ color: 'var(--color-light)', marginBottom: 'var(--space-2)' }}>03 // IMMUNE_VALIDATION</h4>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Beta-glucan complexity reinforces natural killer cell activity and defense.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: The Ritual of the Spoon */}
      <section className="section-dark ritual-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="technical-label">BEHAVIORAL_RESET</span>
          <h2 className="section-title">Health is not a chore. <br /> It’s a ritual.</h2>
          <div className="ritual-video-container panel-technical" style={{ background: 'transparent', padding: 'var(--space-2)', margin: 'var(--space-12) auto' }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, filter: 'grayscale(1)' }}
            >
              <source
                src="https://cdn.pixabay.com/video/2018/06/15/16766-274808390_large.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <p style={{ maxWidth: '600px', margin: '0 auto var(--space-8)', fontSize: '1.2rem', lineHeight: '1.7', color: 'var(--color-muted)' }}>
            We replace the pill-popping routine with a sensory awakening. Each jar is a save point—a moment of wild self-care that tastes as good as it feels.
          </p>
          <Link to="/collections/all" className="btn-minimal-white">[ DISCOVER YOUR RITUAL ]</Link>
        </div>
      </section>

      {/* SECTION 5: The Druid’s Log */}
      <section className="section-light log-section">
        <div className="container">
          <span className="technical-label">APOTHECARY_STUDIES</span>
          <h2 className="section-title">Study the Apothecary.</h2>
          <div className="log-grid">
            <Link to="/quiz" className="log-card lead panel-technical" style={{ textDecoration: 'none' }}>
              <span className="technical-label" style={{ color: 'var(--color-success)' }}>// VIRAL_IDENTIFICATION</span>
              <h3>SNACK OR TRAP?</h3>
              <p style={{ color: 'var(--color-muted)' }}>The interactive mushroom identification quiz.</p>
              <span className="technical-label" style={{ marginTop: 'var(--space-4)', display: 'block' }}>[ BEGIN_ASSESSMENT &rarr; ]</span>
            </Link>
            <div className="log-card panel-technical" style={{ background: 'url("https://images.unsplash.com/photo-1546816757-9cc91136b6cb?q=80&w=800&auto=format&fit=crop") center/cover' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span className="technical-label" style={{ color: 'var(--color-light)' }}>LOG_082</span>
                <h3 style={{ color: 'white', fontSize: '1.2rem' }}>The Ritual of the Spoon</h3>
                <p style={{ color: 'white', opacity: 0.7, fontSize: '0.8rem' }}>A sensory guide.</p>
              </div>
            </div>
            <div className="log-card panel-technical" style={{ background: 'url("https://images.unsplash.com/photo-1579152276532-83b0ad6aee4f?q=80&w=800&auto=format&fit=crop") center/cover' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span className="technical-label" style={{ color: 'var(--color-light)' }}>LOG_045</span>
                <h3 style={{ color: 'white', fontSize: '1.2rem' }}>Dual-Extraction Science</h3>
                <p style={{ color: 'white', opacity: 0.7, fontSize: '0.8rem' }}>Potency explained.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: 'var(--space-16) 0' }}>
        <RecommendedProducts products={data.recommendedProducts} />
      </div>
    </div>
  );
}



function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <div className="section-header">
        <h2 className="section-title">RESTOCK THE APOTHECARY</h2>
        <div className="section-divider"></div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => {
            if (!response) return null;
            const nodes = response.products.nodes;

            // Sort to ensure honeys are first, then others
            const sortedProducts = [...nodes].sort((a, b) => {
              const weight = (p: any) => {
                const title = p.title.toLowerCase();
                if (title.includes('honey')) return 1;
                if (title.includes('tincture') || title.includes('extract')) return 2;
                if (title.includes('gummy') || title.includes('gummies')) return 3;
                return 4;
              };
              return weight(a) - weight(b);
            });

            return (
              <div className="recommended-products-grid">
                {sortedProducts.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            );
          }}
        </Await>

      </Suspense>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 9, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
