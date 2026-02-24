import { Suspense } from 'react';
import { Await, NavLink, Link } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer dark-mode" style={{ padding: '6rem 0 2rem' }}>
            <div className="container" style={{ textAlign: 'center' }}>
              <h2 className="section-title" style={{ color: 'var(--color-gold)', marginBottom: '1rem' }}>Consider this your save point.</h2>
              <div className="newsletter-section" style={{ maxWidth: '600px', margin: '4rem auto' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Join the Vesper Circle.</h3>
                <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Secret rituals, early access, and performance insights.</p>
                <form style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <input type="email" placeholder="YOUR EMAIL" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-gold)', color: 'white', padding: '0.75rem 1rem', flex: 1, maxWidth: '300px' }} />
                  <button type="submit" className="btn-ancient" style={{ padding: '0.75rem 2rem' }}>[ JOIN ]</button>
                </form>
              </div>
            </div>

            <div className="container footer-content" style={{ marginTop: '6rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem' }}>
              <div className="footer-brand">
                <img src="/logo.png" alt="Druid & Bear" className="brand-logo-img" style={{ marginBottom: '1rem', height: '60px' }} />
                <p className="brand-tagline">Nectar for the Modern Quest.</p>
              </div>
              {footer?.menu && header.shop.primaryDomain?.url && (
                <FooterMenu
                  menu={footer.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              )}
              <div className="footer-links-manual" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/compliance" style={{ opacity: 0.7, textDecoration: 'none' }}>FBO Compliance</Link>
                <Link to="/lab-reports" style={{ opacity: 0.7, textDecoration: 'none' }}>Lab Reports</Link>
                <Link to="/community" style={{ opacity: 0.7, textDecoration: 'none' }}>Community (Modern Guardians)</Link>
              </div>
            </div>

            <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
              <div className="footer-copyright">
                <p>&copy; {new Date().getFullYear()} Druid & Bear. UK Sourced. Lab Verified.</p>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? '700' : undefined,
    color: isPending ? 'rgba(255,255,255,0.5)' : 'var(--color-light)',
    textDecoration: isActive ? 'underline' : 'none',
  };
}
