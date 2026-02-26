import {
  Await,
  useLoaderData,
  Link,
} from 'react-router';
import type { Route } from './+types/_index';
import { Suspense, useState, useMemo } from 'react';
import { Image } from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import { ProductItem } from '~/components/ProductItem';
import { Hero } from '~/components/Hero';

import focusImg from '~/assets/focus.png';
import primalImg from '~/assets/primal.png';
import restImg from '~/assets/rest.png';

import lionsManeImg from '~/assets/ingredients/lions_mane.png';
import cordycepsImg from '~/assets/ingredients/cordyceps.png';
import reishiImg from '~/assets/ingredients/reishi.png';
import honeyMatrixImg from '~/assets/ingredients/honey_matrix.png';

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

  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY).then(res => {
    const nodes = res.products.nodes;
    return {
      all: nodes,
      honeys: nodes.filter(n => n.productType === 'Infused Honey' || n.tags.includes('Honey')),
      tinctures: nodes.filter(n => n.productType === 'Liquid Tincture' || n.tags.includes('Tincture')),
      gummies: nodes.filter(n => n.productType === 'Mushroom Gummy' || n.tags.includes('Gummy') || n.tags.includes('Orbs')),
    };
  });

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

      {/* SECTION 2: Mushroom Synergy & Biological Components */}
      <section id="synergy" className="section-dark" style={{ position: 'relative', padding: 'var(--space-24) 0' }}>
        <div className="container">
          <span className="technical-label">BIOLOGICAL_SYNERGY</span>
          <h2 className="section-title" style={{ fontSize: '3.5rem', maxWidth: '800px' }}>Precision Extraction. <br /> Maximum Biological Yield.</h2>

          <div className="synergy-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-12)', marginTop: 'var(--space-16)' }}>

            {/* LION'S MANE */}
            <div className="synergy-card panel-technical" style={{ position: 'relative', overflow: 'hidden', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'var(--space-10)' }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img src={lionsManeImg} alt="Lion's Mane" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-dark) 20%, transparent 100%)' }}></div>
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="benefit-tag" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>NEURAL_GENESIS</span>
                <h3 style={{ fontSize: '2.4rem', color: 'var(--color-light)', margin: 'var(--space-4) 0' }}>Lion's Mane</h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: 'var(--space-6)' }}>
                  Dual-extracted concentration of Hericenones for NGF stimulation. Engineered for mental precision and long-term cognitive health.
                </p>
                <div className="technical-specs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', borderTop: 'var(--border-delicate)', paddingTop: 'var(--space-6)' }}>
                  <div>
                    <span className="technical-label" style={{ fontSize: '0.6rem', display: 'block' }}>BIOACTIVE_COMPLEX</span>
                    <span style={{ color: 'white', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>HERICENE_A+B</span>
                  </div>
                  <div>
                    <span className="technical-label" style={{ fontSize: '0.6rem', display: 'block' }}>SYSTEM_IMPACT</span>
                    <span style={{ color: 'white', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>COGNITIVE_REPAIR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CORDYCEPS */}
            <div className="synergy-card panel-technical" style={{ position: 'relative', overflow: 'hidden', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'var(--space-10)' }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img src={cordycepsImg} alt="Cordyceps" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-dark) 20%, transparent 100%)' }}></div>
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="benefit-tag" style={{ background: 'rgba(255, 77, 77, 0.1)', borderColor: 'rgba(255, 77, 77, 0.3)', color: '#FF7D7D' }}>ADENOSINE_FLOW</span>
                <h3 style={{ fontSize: '2.4rem', color: 'var(--color-light)', margin: 'var(--space-4) 0' }}>Cordyceps</h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: 'var(--space-6)' }}>
                  Optimized for cellular ATP production. Increases oxygen utilization and physical endurance without catecholamine exhaustion.
                </p>
                <div className="technical-specs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', borderTop: 'var(--border-delicate)', paddingTop: 'var(--space-6)' }}>
                  <div>
                    <span className="technical-label" style={{ fontSize: '0.6rem', display: 'block' }}>BIOACTIVE_COMPLEX</span>
                    <span style={{ color: 'white', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>CORDYCEPIN_3%</span>
                  </div>
                  <div>
                    <span className="technical-label" style={{ fontSize: '0.6rem', display: 'block' }}>SYSTEM_IMPACT</span>
                    <span style={{ color: 'white', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>ATP_MODULATION</span>
                  </div>
                </div>
              </div>
            </div>

            {/* REISHI */}
            <div className="synergy-card panel-technical" style={{ position: 'relative', overflow: 'hidden', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'var(--space-10)' }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img src={reishiImg} alt="Reishi" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-dark) 20%, transparent 100%)' }}></div>
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="benefit-tag" style={{ background: 'rgba(77, 255, 171, 0.1)', borderColor: 'rgba(77, 255, 171, 0.3)', color: 'var(--color-success)' }}>HOMEOSTATIC_RESET</span>
                <h3 style={{ fontSize: '2.4rem', color: 'var(--color-light)', margin: 'var(--space-4) 0' }}>Reishi</h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: 'var(--space-6)' }}>
                  High-potency triterpene profile for parasympathetic activation. Modulates cortisol and facilitates deep REM cycles.
                </p>
                <div className="technical-specs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', borderTop: 'var(--border-delicate)', paddingTop: 'var(--space-6)' }}>
                  <div>
                    <span className="technical-label" style={{ fontSize: '0.6rem', display: 'block' }}>BIOACTIVE_COMPLEX</span>
                    <span style={{ color: 'white', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>GANODERIC_ACID</span>
                  </div>
                  <div>
                    <span className="technical-label" style={{ fontSize: '0.6rem', display: 'block' }}>SYSTEM_IMPACT</span>
                    <span style={{ color: 'white', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>CORTISOL_STABILITY</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: The Delivery System (The Honey Matrix) */}
      <section className="section-dark" style={{ borderTop: 'var(--border-delicate)', borderBottom: 'var(--border-delicate)', overflow: 'hidden' }}>
        <div className="container">
          <div className="delivery-system-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-16)', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <span className="technical-label">BIOAVAILABILITY_PROTOCOL</span>
              <h2 className="section-title" style={{ fontSize: '4rem' }}>The Honey <br /><span className="text-italic">Matrix.</span></h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: 'var(--space-10)', maxWidth: '500px' }}>
                Standard extracts often fail the digestive bypass. We lock our clinical dual-extracts into <strong>Raw Woodland Honey</strong>—a bioactive medium that bypasses degradation and ensures rapid mucosal absorption.
              </p>

              <div className="matrix-analysis-box panel-technical" style={{ padding: 'var(--space-8)', borderLeft: '3px solid var(--color-success)' }}>
                <span className="technical-label" style={{ color: 'var(--color-success)', marginBottom: 'var(--space-2)', display: 'block' }}>// ABSORPTION_VALIDATION</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-light)' }}>
                  Enzymatic honey structures act as a biological carrier, delivering 98% of fungal triterpenes directly to the bloodstream.
                </p>
              </div>
            </div>

            <div className="matrix-visual panel-technical" style={{ position: 'relative', padding: '0', overflow: 'hidden', aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={honeyMatrixImg} alt="Honey Matrix" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, var(--color-dark) 100%)' }}></div>

              {/* Dynamic HUD Data overlay */}
              <div style={{ position: 'relative', zIndex: 2, width: '80%', height: '80%', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="technical-label" style={{ fontSize: '0.5rem' }}>SCAN_PHASE: 04</span>
                  <span className="technical-label" style={{ fontSize: '0.5rem' }}>POTENCY: 100%</span>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '120px', height: '120px', border: '1px solid var(--color-success)', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 3s infinite' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-success)' }}>OPTIMAL_BIND</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div className="potency-chart-mini" style={{ width: '100px' }}>
                    <div style={{ height: '2px', background: 'var(--color-success)', width: '100%', marginBottom: '4px' }}></div>
                    <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', width: '40%' }}></div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', opacity: 0.5 }}>REF_ID: WOODLAND_BEE_082</span>
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
  products: Promise<{
    all: RecommendedProductFragment[];
    honeys: RecommendedProductFragment[];
    tinctures: RecommendedProductFragment[];
    gummies: RecommendedProductFragment[];
  } | null>;
}) {
  const [activeCategory, setActiveCategory] = useState<'honeys' | 'tinctures' | 'gummies'>('honeys');

  return (
    <div id="apothecary" className="recommended-products">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
          <span className="technical-label">SYSTEM_CATEGORIES</span>
          <h2 className="section-title" style={{ fontSize: '3rem' }}>Select Your Delivery System.</h2>
          <div className="category-toggle" style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-8)', marginTop: 'var(--space-8)' }}>
            {(['honeys', 'tinctures', 'gummies'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: activeCategory === cat ? 'white' : 'var(--color-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: 'var(--space-2) 0',
                  borderBottom: activeCategory === cat ? '2px solid white' : '2px solid transparent',
                  transition: 'var(--transition-standard)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--color-muted)', padding: 'var(--space-20)' }}>CALIBRATING_SENSORS...</div>}>
          <Await resolve={products}>
            {(response) => {
              if (!response) return null;
              const displayProducts = response[activeCategory];

              return (
                <div className="category-showcase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)' }}>
                  {displayProducts.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-16)' }}>
          <Link to="/collections/all" className="technical-label" style={{ color: 'white', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', padding: 'var(--space-4) var(--space-8)', display: 'inline-block' }}>
            [ VIEW_ALL_PRODUCTS // FULL_INVENTORY ]
          </Link>
        </div>
      </div>
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
    productType
    tags
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
    products(first: 50, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
