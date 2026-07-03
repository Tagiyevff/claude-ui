import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppSettings, ApiConfig, GenerationConfig, ModelProvider } from '../types'
import { generateId } from '../lib/utils'

const defaultGenerationConfig: GenerationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxTokens: 2048,
  stream: true,
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'en',
  defaultModel: 'ollama:llama2',
  streaming: true,
  generationConfig: defaultGenerationConfig,
  apiConfigs: [],
}

interface SettingsState extends AppSettings {
  // Settings operations
  updateSettings: (settings: Partial<AppSettings>) => void
  updateGenerationConfig: (config: Partial<GenerationConfig>) => void

  // API Config operations
  addApiConfig: (config: Omit<ApiConfig, 'id'>) => string
  updateApiConfig: (id: string, config: Partial<ApiConfig>) => void
  deleteApiConfig: (id: string) => void
  toggleApiConfig: (id: string) => void

  // Model operations
  setDefaultModel: (modelId: string) => void

  // Reset
  resetToDefaults: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (settings) => {
        set((state) => ({ ...state, ...settings }))
      },

      updateGenerationConfig: (config) => {
        set((state) => ({
          generationConfig: {
            ...state.generationConfig,
            ...config,
          },
        }))
      },

      addApiConfig: (config) => {
        const id = generateId()
        const newConfig: ApiConfig = { ...config, id }
        set((state) => ({
          apiConfigs: [...state.apiConfigs, newConfig],
        }))
        return id
      },

      updateApiConfig: (id, config) => {
        set((state) => ({
          apiConfigs: state.apiConfigs.map((c) =>
            c.id === id ? { ...c, ...config } : c
          ),
        }))
      },

      deleteApiConfig: (id) => {
        set((state) => ({
          apiConfigs: state.apiConfigs.filter((c) => c.id !== id),
        }))
      },

      toggleApiConfig: (id) => {
        set((state) => ({
          apiConfigs: state.apiConfigs.map((c) =>
            c.id === id ? { ...c, enabled: !c.enabled } : c
          ),
        }))
      },

      setDefaultModel: (modelId) => {
        set({ defaultModel: modelId })
      },

      resetToDefaults: () => {
        set(defaultSettings)
      },
    }),
    {
      name: 'settings-storage',
    }
  )
)
