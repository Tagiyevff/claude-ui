import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  initializeTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      initializeTheme: () => {
        const stored = localStorage.getItem('theme-storage')
        if (stored) {
          try {
            const { state } = JSON.parse(stored)
            if (state?.theme) {
              set({ theme: state.theme })
            }
          } catch (e) {
            console.error('Failed to parse theme storage', e)
          }
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)
