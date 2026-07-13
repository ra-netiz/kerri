import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/dashboard'
    const successMsg = location.state?.message || ''

    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setError('')
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await login({ email: form.email.trim(), password: form.password })
            navigate(from, { replace: true })
        } catch (err) {
            const msg = err.message || ''
            if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
                setError('Email or password is incorrect.')
            } else if (msg.includes('Email not confirmed')) {
                setError('Please confirm your email first. Check your inbox.')
            } else if (msg.includes('too many') || msg.includes('rate limit')) {
                setError('Too many attempts. Wait a few minutes and try again.')
            } else {
                setError(msg || 'Something went wrong. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="auth-page container">
            <div className="auth-card">
                <p className="auth-card__eyebrow">Welcome back</p>
                <h1>Log in</h1>
                <p className="auth-card__sub">
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-link">Register here</Link>
                </p>

                <form className="form" onSubmit={handleSubmit}>
                    {successMsg && <p className="form-success">{successMsg}</p>}
                    {error && <p className="form-error">{error}</p>}

                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            placeholder="you@example.com"
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            placeholder="Your password"
                            required
                        />
                    </label>

                    <button type="submit" className="btn btn--primary" disabled={loading}>
                        {loading ? 'Logging in…' : 'Log in'}
                    </button>

                    <p>
                        New here?{' '}
                        <Link to="/register" className="auth-link">Create a free account</Link>
                    </p>
                </form>
            </div>
        </section>
    )
}