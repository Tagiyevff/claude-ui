import { Menu, Moon, Sun, Settings, Bell } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'
import { useState } from 'react'
import SettingsModal from '../settings/SettingsModal'

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useThemeStore()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-bg-200 rounded-xl transition-all duration-200 text-text-300 hover:text-text-100"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
              <rect x="4" y="4" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M10 16L14 20L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-lg font-semibold text-accent">TagUI</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-bg-200 rounded-xl transition-all duration-200 text-text-300 hover:text-text-100">
            <Bell size={20} />
          </button>
          <button onClick={toggleTheme} className="p-2 hover:bg-bg-200 rounded-xl transition-all duration-200 text-text-300 hover:text-text-100">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-bg-200 rounded-xl transition-all duration-200 text-text-300 hover:text-text-100">
            <Settings size={20} />
          </button>
          <div className="ml-2 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
            U
          </div>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
