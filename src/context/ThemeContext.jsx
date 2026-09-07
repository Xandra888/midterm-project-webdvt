import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'ledger-theme'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    // fall back to the user's OS preference on first visit
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Reflect the theme on <html data-theme="..."> so plain CSS variables can react to it
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  // Memoize the context value so components that only read `theme`/`toggleTheme`
  // don't re-render just because ThemeProvider's own render happened again.
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside a ThemeProvider')
  return ctx
}
