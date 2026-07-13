import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                const currentUser = session?.user ?? null
                setUser(currentUser)
                if (currentUser) {
                    await fetchProfile(currentUser.id)
                } else {
                    setProfile(null)
                    setLoading(false)
                }
            }
        )
        return () => subscription.unsubscribe()
    }, [])

    async function fetchProfile(userId) {
        setLoading(true)
        try {
            let data = null
            let error = null
            for (let attempt = 0; attempt < 3; attempt++) {
                const result = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single()
                data = result.data
                error = result.error
                if (error?.code === 'PGRST116' && attempt < 2) {
                    await new Promise((r) => setTimeout(r, 800))
                    continue
                }
                break
            }
            setProfile(data || null)
        } catch (err) {
            console.error('fetchProfile:', err)
            setProfile(null)
        } finally {
            setLoading(false)
        }
    }

    async function register({ name, email, password }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
        })
        if (error) throw new Error(error.message)
        return data
    }

    async function login({ email, password }) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw new Error(error.message)
        return data
    }

    async function logout() {
        const { error } = await supabase.auth.signOut()
        if (error) throw new Error(error.message)
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}