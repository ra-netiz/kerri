import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'

const statusClass = {
    Confirmed: 'badge--green',
    Pending: 'badge--amber',
    Completed: 'badge--muted',
    Cancelled: 'badge--muted',
}

export default function Dashboard() {
    const { user, profile, logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('bookings')
    const [bookings, setBookings] = useState([])
    const [bookingsLoading, setBookingsLoading] = useState(true)

    useEffect(() => {
        if (user) fetchBookings()
    }, [user])

    async function fetchBookings() {
        setBookingsLoading(true)
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        if (!error) setBookings(data || [])
        setBookingsLoading(false)
    }

    async function handleLogout() {
        await logout()
        navigate('/')
    }

    const name = profile?.name || user?.user_metadata?.name || 'Member'
    const email = profile?.email || user?.email || ''
    const joinedAt = profile?.joined_at || user?.created_at

    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const upcoming = bookings.filter((b) =>
        ['Pending', 'Confirmed'].includes(b.status)
    )
    const past = bookings.filter((b) =>
        ['Completed', 'Cancelled'].includes(b.status)
    )

    return (
        <div className="container dashboard" style={{ paddingBlock: '2rem' }}>
            {/* Sidebar */}
            <aside className="dash-sidebar">
                <div className="dash-avatar">{initials}</div>
                <p className="dash-name">{name}</p>
                <p className="dash-email">{email}</p>
                <p className="dash-joined">
                    Since{' '}
                    {new Date(joinedAt).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric',
                    })}
                </p>

                <nav className="dash-nav">
                    {[
                        { key: 'bookings', label: 'Bookings' },
                        { key: 'history', label: 'History' },
                        { key: 'profile', label: 'Profile' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            className={`dash-nav__btn ${activeTab === tab.key ? 'dash-nav__btn--active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <button
                    type="button"
                    className="btn btn--ghost btn--sm dash-logout"
                    onClick={handleLogout}
                >
                    Log out
                </button>
            </aside>

            {/* Main */}
            <div className="dash-main">
                {activeTab === 'bookings' && (
                    <>
                        <div className="dash-main__header">
                            <div>
                                <p className="dash-eyebrow">Dashboard</p>
                                <h2>Upcoming bookings</h2>
                            </div>
                            {/* Fixed: now points to /booking */}
                            <Link to="/booking" className="btn btn--primary btn--sm">
                                Book a clean
                            </Link>
                        </div>

                        {bookingsLoading ? (
                            <div className="dash-empty"><p>Loading bookings…</p></div>
                        ) : upcoming.length === 0 ? (
                            <div className="dash-empty">
                                <p>No upcoming bookings yet.</p>
                                <Link
                                    to="/booking"
                                    className="btn btn--outline btn--sm"
                                    style={{ marginTop: '1rem' }}
                                >
                                    Book your first clean
                                </Link>
                            </div>
                        ) : (
                            <div className="booking-list">
                                {upcoming.map((b) => (
                                    <BookingCard key={b.id} booking={b} />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'history' && (
                    <>
                        <div className="dash-main__header">
                            <div>
                                <p className="dash-eyebrow">Dashboard</p>
                                <h2>Booking history</h2>
                            </div>
                        </div>

                        {bookingsLoading ? (
                            <div className="dash-empty"><p>Loading history…</p></div>
                        ) : past.length === 0 ? (
                            <div className="dash-empty">
                                <p>No past bookings recorded yet.</p>
                            </div>
                        ) : (
                            <div className="booking-list">
                                {past.map((b) => (
                                    <BookingCard key={b.id} booking={b} muted />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'profile' && (
                    <>
                        <div className="dash-main__header">
                            <div>
                                <p className="dash-eyebrow">Dashboard</p>
                                <h2>Your profile</h2>
                            </div>
                        </div>

                        <div className="profile-grid">
                            <div className="profile-field">
                                <span className="profile-field__label">Name</span>
                                <span className="profile-field__value">{name}</span>
                            </div>
                            <div className="profile-field">
                                <span className="profile-field__label">Email</span>
                                <span className="profile-field__value">{email}</span>
                            </div>
                            <div className="profile-field">
                                <span className="profile-field__label">Member since</span>
                                <span className="profile-field__value">
                                    {new Date(joinedAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="profile-field">
                                <span className="profile-field__label">Total cleans</span>
                                <span className="profile-field__value">
                                    {past.length} completed
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

function BookingCard({ booking, muted = false }) {
    return (
        <div className={`booking-card ${muted ? 'booking-card--muted' : ''}`}>
            <div>
                <p className="booking-card__service">{booking.service}</p>
                <p className="booking-card__meta">
                    {booking.date} · {booking.time}
                </p>
                <p className="booking-card__meta">{booking.address}</p>
                {booking.notes && (
                    <p className="booking-card__notes">{booking.notes}</p>
                )}
            </div>
            <span className={`badge ${statusClass[booking.status] || 'badge--muted'}`}>
                {booking.status}
            </span>
        </div>
    )
}