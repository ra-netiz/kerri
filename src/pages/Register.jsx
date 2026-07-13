import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
    const { register } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setError('')
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!form.name.trim()) { setError('Please enter your full name.'); return }
        if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }

        setLoading(true)
        setError('')

        try {
            await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
            navigate('/login', { replace: true, state: { message: 'Account created! Please log in.' } })
        } catch (err) {
            const msg = err.message || ''
            if (msg.includes('already registered') || msg.includes('already been registered')) {
                setError('An account with that email already exists.')
            } else if (msg.includes('invalid email')) {
                setError('Please enter a valid email address.')
            } else if (msg.includes('Password should')) {
                setError('Password must be at least 6 characters.')
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
                <p className="auth-card__eyebrow">Get started</p>
                <h1>Create account</h1>
                <p className="auth-card__sub">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">Log in here</Link>
                </p>

                <form className="form" onSubmit={handleSubmit}>
                    {error && <p className="form-error">{error}</p>}

                    <label>
                        Full name
                        <input type="text" name="name" value={form.name} onChange={handleChange} autoComplete="name" placeholder="e.g. Alex Johnson" required />
                    </label>

                    <label>
                        Email
                        <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" placeholder="you@example.com" required />
                    </label>

                    <label>
                        Password
                        <input type="password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" placeholder="At least 6 characters" required />
                    </label>

                    <label>
                        Confirm password
                        <input type="password" name="confirm" value={form.confirm} onChange={handleChange} autoComplete="new-password" placeholder="Repeat your password" required />
                    </label>

                    <button type="submit" className="btn btn--primary" disabled={loading}>
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>
            </div>
        </section>
    )
}