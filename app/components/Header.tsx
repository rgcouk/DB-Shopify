import { Suspense, useState, useEffect } from 'react';
import { Await, NavLink, useAsyncValue } from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const { shop, menu } = header;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-logo-container">
        <NavLink prefetch="intent" to="/" className={activeLink} end onClick={() => setIsMobileMenuOpen(false)}>
          <img src="/logo.svg" alt="Druid & Bear" className="brand-logo-img" />
        </NavLink>
      </div>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <HeaderCtas
        isLoggedIn={isLoggedIn}
        cart={cart}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      {isMobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          <HeaderMenu
            menu={menu}
            viewport="mobile"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  onClose,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  onClose?: () => void;
}) {
  const className = `header-menu-${viewport}`;
  const { close: closeAside } = useAside();

  function handleClose() {
    closeAside();
    onClose?.();
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={handleClose}
          prefetch="intent"
          className={activeLink}
          to="/"
        >
          HOME
        </NavLink>
      )}
      {FALLBACK_HEADER_MENU.items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className={activeLink}
            end
            key={item.id}
            onClick={handleClose}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
  isMobileMenuOpen,
  onToggleMobileMenu,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'> & {
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}) {
  return (
    <nav className="header-ctas" role="navigation">
      <NavLink prefetch="intent" to="/account" className={activeLink}>
        <Suspense fallback="AUTH">
          <Await resolve={isLoggedIn} errorElement="AUTH">
            {(isLoggedIn) => (isLoggedIn ? 'ACCOUNT' : 'AUTH')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle isOpen={isMobileMenuOpen} onToggle={onToggleMobileMenu} />
    </nav>
  );
}

function HeaderMenuMobileToggle({ isOpen, onToggle }: { isOpen: boolean, onToggle: () => void }) {
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={onToggle}
      aria-label="Open Menu"
    >
      {isOpen ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="1" y1="1" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
          <line x1="19" y1="1" x2="1" y2="19" stroke="currentColor" strokeWidth="2" />
        </svg>
      ) : (
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="20" height="1" fill="currentColor" />
          <rect y="5" width="14" height="1" fill="currentColor" />
          <rect y="11" width="20" height="1" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}

function SearchToggle() {
  const { open } = useAside();
  return (
    <button
      className="header-menu-item"
      onClick={() => open('search')}
      style={{ border: 'none', background: 'transparent', cursor: 'pointer', outline: 'none' }}
    >
      SEARCH
    </button>
  );
}

function CartBadge({ count }: { count: number | null }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <a
      href="/cart"
      className="header-cart-cta"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <span className="cart-label">CART</span>
      <span className="cart-count">[{count === null ? '0' : count}]</span>
    </a>
  );
}

function CartToggle({ cart }: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'store',
      resourceId: null,
      tags: [],
      title: 'SYSTEMS',
      type: 'HTTP',
      url: '/collections/all',
      items: [],
    },
    {
      id: 'science',
      resourceId: null,
      tags: [],
      title: 'THE SCIENCE',
      type: 'HTTP',
      url: '/pages/about',
      items: [],
    },
    {
      id: 'assessment',
      resourceId: null,
      tags: [],
      title: 'ASSESSMENT',
      type: 'HTTP',
      url: '/quiz',
      items: [],
    },
    {
      id: 'log',
      resourceId: null,
      tags: [],
      title: 'THE LOG',
      type: 'HTTP',
      url: '/blogs/news',
      items: [],
    },
  ],
};

function activeLink({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return `header-menu-item ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`;
}
