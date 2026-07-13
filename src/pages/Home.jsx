import { Link } from 'react-router-dom'

const services = [
    {
        label: 'Home Cleaning',
        desc: 'Full deep clean of every room — kitchens, bathrooms, bedrooms, and living areas.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        label: 'Office Cleaning',
        desc: 'Keep your workspace spotless and professional with scheduled cleaning visits.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
        ),
    },
    {
        label: 'Move-in / Move-out',
        desc: 'Leave the old place spotless or start fresh in your new home.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <polyline points="5 9 2 12 5 15" /><polyline points="19 9 22 12 19 15" /><line x1="2" y1="12" x2="22" y2="12" />
            </svg>
        ),
    },
]

export default function Home() {
    return (
        <>
            <section className="hero">
                <div className="container">
                    <div className="hero__inner">
                        <div>
                            <span className="hero__tag">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="6" /></svg>
                                Professional Cleaning Service
                            </span>
                            <h1>A cleaner home, every time.</h1>
                            <p className="hero__sub">
                                Kerri Cleaner delivers reliable, thorough cleaning services for homes
                                and offices. Book your session and come back to spotless.
                            </p>
                            <div className="hero__actions">
                                <Link to="/register" className="btn btn--primary btn--lg">Get started free</Link>
                                <Link to="/about" className="btn btn--ghost btn--lg">Learn more</Link>
                            </div>
                        </div>
                        <div className="hero__img-placeholder">
                            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 40h32M12 40V20l12-12 12 12v20" /><rect x="18" y="28" width="12" height="12" />
                            </svg>
                            Your photo here
                        </div>
                    </div>
                </div>
            </section>

            <section className="section container">
                <h2>What we offer</h2>
                <p style={{ color: 'var(--text-soft)', marginTop: '0.5rem' }}>
                    Flexible cleaning packages for every need.
                </p>
                <div className="services-grid">
                    {services.map((s) => (
                        <div className="service-card" key={s.label}>
                            <div className="service-card__icon">{s.icon}</div>
                            <h3>{s.label}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <h2>Ready for a cleaner space?</h2>
                    <p>Create a free account and book your first session today.</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn btn--outline btn--lg">Create account</Link>
                        <Link to="/login" className="btn btn--lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'transparent' }}>Log in</Link>
                    </div>
                </div>
            </section>
        </>
    )
}