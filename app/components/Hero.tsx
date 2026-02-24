import { Link } from 'react-router';

export function Hero() {
    return (
        <section className="hero-section dark-mode">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="full-bleed-video"
                style={{ filter: 'grayscale(1) brightness(0.6)' }}
            >
                <source
                    src="https://cdn.pixabay.com/video/2021/04/12/70860-536906232_large.mp4"
                    type="video/mp4"
                />
            </video>
            <div className="hero-overlay"></div>

            <div className="hero-alchemy-matrix">
                {/* Orbital Rings */}
                <div className="matrix-circle outer"></div>
                <div className="matrix-circle middle"></div>
                <div className="matrix-circle inner"></div>

                {/* Sacred Geometry */}
                <div className="matrix-polygon triangle"></div>
                <div className="matrix-polygon square"></div>

                {/* Mathematical Crosshairs */}
                <div className="matrix-line horizontal"></div>
                <div className="matrix-line vertical"></div>

                {/* Floating Runes */}
                <div className="matrix-rune rune-1">❖</div>
                <div className="matrix-rune rune-2">⚗︎</div>
                <div className="matrix-rune rune-3">△</div>
                <div className="matrix-rune rune-4">⎔</div>

                {/* Tracking Data */}
                <span className="alchemy-text t-top">MYCELIUM_NETWORK // C-12 H-22 O-11</span>
                <span className="alchemy-text t-bottom">TRANSMUTATION // STAGE_01</span>
                <span className="alchemy-text t-side">DECODING_ANCIENT_ALCHEMY</span>
            </div>

            <div className="hero-content">
                <div className="hero-branding-layer">
                    <h3 className="technical-label" style={{ color: 'var(--color-accent-gold)' }}>MUSHROOM EXTRACTS & INFUSED HONEYS</h3>
                    <h1 className="hero-title-refined">
                        Decoding Ancient Alchemy. <br />
                        <span className="text-italic" style={{ opacity: 0.9 }}>For the Modern Mind.</span>
                    </h1>
                    <p className="hero-description-minimal" style={{ fontSize: '1.2rem' }}>
                        Clinical-grade woodland extracts locked in a natural honey matrix. High-efficiency physical and cognitive fuel designed for maximum absorption.
                    </p>
                    <div className="hero-actions-minimal">
                        <Link to="/collections/all" className="btn-minimal-white" style={{ background: 'var(--color-light)', color: 'var(--color-dark)', border: 'none', fontWeight: 600 }}>
                            [ EXPLORE SYSTEMS ]
                        </Link>
                    </div>
                </div>

                <div className="hero-technical-specs panel-technical">
                    <div className="spec-item">
                        <span className="spec-key">PRIMARY_SOURCE</span>
                        <span className="spec-value">ANCIENT_WOODLAND</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-key">PURITY_INDEX</span>
                        <span className="spec-value">99.8%</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-key">SYSTEM_STATUS</span>
                        <span className="spec-value">VALIDATED</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
