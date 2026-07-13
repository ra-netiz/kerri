import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
]

export default function Navbar() {
    const { user, profile, logout } = useAuth()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    async function handleLogout() {
        await logout()
        setOpen(false)
        navigate('/')
    }

    const name = profile?.name || user?.user_metadata?.name || ''
    const initials = name
        ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    return (
        <header className="navbar">
            <NavLink to="/" className="navbar__logo" onClick={() => setOpen(false)}>
                <span className="navbar__logo-dot" />
                Kerri Cleaner
            </NavLink>

            <button
                type="button"
                className={`navbar__toggle ${open ? 'navbar__toggle--open' : ''}`}
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((p) => !p)}
            >
                <span /><span /><span />
            </button>

            <div className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
                {publicLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                            `navbar__link${isActive ? ' navbar__link--active' : ''}`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}

                <div className="navbar__auth">
                    {user ? (
                        <>
                            <NavLink
                                to="/dashboard"
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `navbar__link${isActive ? ' navbar__link--active' : ''}`
                                }
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <span className="navbar__avatar">{initials}</span>
                                {name.split(' ')[0] || 'Dashboard'}
                            </NavLink>
                            <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `navbar__link${isActive ? ' navbar__link--active' : ''}`
                                }
                            >
                                Log in
                            </NavLink>
                            <NavLink to="/register" onClick={() => setOpen(false)} className="btn btn--primary btn--sm">
                                Register
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}