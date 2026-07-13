import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'

const services = [
    'Home Cleaning',
    'Office Cleaning',
    'Move-in / Move-out',
]

const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM',
]

export default function BookingPage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        service: 'Home Cleaning',
        date: '',
        time: '08:00 AM',
        address: '',
        notes: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Get today's date in YYYY-MM-DD format for the min date attribute
    const today = new Date().toISOString().split('T')[0]

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setError('')
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!form.address.trim()) {
            setError('Please enter the address to be cleaned.')
            return
        }

        if (!form.date) {
            setError('Please select a date.')
            return
        }

        setLoading(true)
        setError('')

        const { error: insertError } = await supabase.from('bookings').insert({
            user_id: user.id,
            service: form.service,
            date: new Date(form.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }),
            time: form.time,
            address: form.address.trim(),
            notes: form.notes.trim(),
            status: 'Pending',
        })

        setLoading(false)

        if (insertError) {
            console.error(insertError)
            setError('Failed to submit booking. Please try again.')
            return
        }

        setSuccess(true)
    }

    if (success) {
        return (
            <section className="auth-page container">
                <div className="auth-card" style={{ textAlign: 'center', maxWidth: '480px' }}>
                    <div className="booking-success-icon">✓</div>
                    <h2 style={{ marginBottom: '0.6rem' }}>Booking submitted!</h2>
                    <p style={{ color: 'var(--text-soft)', marginBottom: '1.6rem' }}>
                        Your booking is <strong>pending confirmation</strong>. We'll be in
                        touch shortly to confirm your slot.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={() => navigate('/dashboard')}
                        >
                            View dashboard
                        </button>
                        <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={() => {
                                setSuccess(false)
                                setForm({ service: 'Home Cleaning', date: '', time: '08:00 AM', address: '', notes: '' })
                            }}
                        >
                            Book another
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="auth-page container" style={{ alignItems: 'flex-start', paddingBlock: '2.5rem' }}>
            <div className="auth-card" style={{ width: 'min(560px, 100%)' }}>
                <p className="auth-card__eyebrow">Book a clean</p>
                <h1 style={{ marginBottom: '0.4rem' }}>Schedule a session</h1>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
                    Fill in the details below and we'll confirm your booking within 24 hours.
                </p>

                <form className="form" onSubmit={handleSubmit}>
                    {error && <p className="form-error">{error}</p>}

                    <label>
                        Service type
                        <select name="service" value={form.service} onChange={handleChange}>
                            {services.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </label>

                    <div className="booking-row">
                        <label>
                            Date
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                min={today}
                                required
                            />
                        </label>

                        <label>
                            Time
                            <select name="time" value={form.time} onChange={handleChange}>
                                {timeSlots.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <label>
                        Address
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="e.g. 12 Main Street, Lagos"
                            required
                        />
                    </label>

                    <label>
                        Special instructions
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Anything we should know — pets, access codes, areas to focus on…"
                        />
                    </label>

                    <button type="submit" className="btn btn--primary" disabled={loading}>
                        {loading ? 'Submitting…' : 'Submit booking'}
                    </button>
                </form>
            </div>
        </section>
    )
}