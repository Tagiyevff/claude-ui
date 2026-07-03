import { useState } from 'react'
import { Search, X, Settings as SettingsIcon, Puzzle, Code } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import GeneralSettings from './GeneralSettings'
import ApiSettings from './ApiSettings'
import ModelSettings from './ModelSettings'

interface SettingsModalProps {
  onClose: () => void
}

type SettingsTab = 'general' | 'api' | 'models'

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  const tabs = [
    { id: 'general' as const, label: 'General', icon: SettingsIcon },
    { id: 'api' as const, label: 'API Providers', icon: Puzzle },
    { id: 'models' as const, label: 'Models', icon: Code },
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-[900px] h-[680px] bg-bg-100 rounded-2xl shadow-2xl overflow-hidden flex"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-[220px] bg-bg-0 flex flex-col shrink-0">
            <div className="p-3 pb-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-400" />
                <input type="text" placeholder="Search"
                  className="w-full pl-8 pr-3 py-2 bg-bg-200 rounded-xl focus:outline-none text-sm text-text-100 placeholder:text-text-400" />
              </div>
            </div>
            <div className="px-3 py-3 text-[11px] font-semibold text-text-400 uppercase tracking-wider">Settings</div>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-2 space-y-0.5">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                    activeTab === tab.id ? 'bg-bg-200 text-text-100 font-medium' : 'text-text-300 hover:text-text-100 hover:bg-bg-200/50'
                  }`}>
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-semibold text-text-100">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <button onClick={onClose} className="p-2 hover:bg-bg-200 rounded-xl transition-colors text-text-300 hover:text-text-100">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-6 pb-6">
              {activeTab === 'general' && <GeneralSettings />}
              {activeTab === 'api' && <ApiSettings />}
              {activeTab === 'models' && <ModelSettings />}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
