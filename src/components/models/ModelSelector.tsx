import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'
import { fetchOllamaModels } from '../../lib/api'
import { ModelInfo } from '../../types'

interface ModelSelectorProps {
  currentModel: string
}

export default function ModelSelector({ currentModel }: ModelSelectorProps) {
  const { setDefaultModel, apiConfigs } = useSettingsStore()
  const [isOpen, setIsOpen] = useState(false)
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadModels()
  }, [apiConfigs])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const loadModels = async () => {
    setLoading(true)
    const allModels: ModelInfo[] = []

    // Load Ollama models
    const ollamaConfig = apiConfigs.find(c => c.provider === 'ollama' && c.enabled)
    if (ollamaConfig) {
      try {
        const ollamaModels = await fetchOllamaModels(ollamaConfig.baseUrl)
        ollamaModels.forEach((model: any) => {
          allModels.push({
            id: `ollama:${model.name}`,
            name: model.name,
            provider: 'ollama',
            size: model.size,
            contextLength: model.details?.parameter_size,
            quantization: model.details?.quantization_level,
          })
        })
      } catch (error) {
        console.error('Failed to load Ollama models:', error)
      }
    }

    // Add models from other enabled API configs
    apiConfigs
      .filter(c => c.enabled && c.provider !== 'ollama')
      .forEach(config => {
        if (config.models) {
          allModels.push(...config.models)
        } else {
          // Default models for known providers
          const defaultModels = getDefaultModels(config.provider)
          defaultModels.forEach(modelName => {
            allModels.push({
              id: `${config.provider}:${modelName}`,
              name: modelName,
              provider: config.provider,
            })
          })
        }
      })

    setModels(allModels)
    setLoading(false)
  }

  const getDefaultModels = (provider: string): string[] => {
    switch (provider) {
      case 'openai':
        return ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo']
      case 'anthropic':
        return ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
      case 'google':
        return ['gemini-pro', 'gemini-pro-vision']
      case 'groq':
        return ['llama3-70b', 'llama3-8b', 'mixtral-8x7b']
      default:
        return []
    }
  }

  const handleSelectModel = (modelId: string) => {
    setDefaultModel(modelId)
    setIsOpen(false)
  }

  const getCurrentModelDisplay = () => {
    const model = models.find(m => m.id === currentModel)
    if (model) {
      return (
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-600 dark:text-blue-500" />
          <span className="font-medium">{model.name}</span>
          {model.size && (
            <span className="text-xs text-gray-500">({model.size})</span>
          )}
        </div>
      )
    }
    return (
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-gray-400" />
        <span className="text-gray-600 dark:text-gray-400">Select Model</span>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white dark:bg-dark-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex items-center justify-between gap-2"
      >
        {getCurrentModelDisplay()}
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full max-w-md glass rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading models...</div>
              ) : models.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No models available. Configure API providers in settings.
                </div>
              ) : (
                <div className="py-2">
                  {Object.entries(groupModelsByProvider(models)).map(([provider, providerModels]) => (
                    <div key={provider}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {provider}
                      </div>
                      {providerModels.map(model => (
                        <button
                          key={model.id}
                          onClick={() => handleSelectModel(model.id)}
                          className={`
                            w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors
                            ${model.id === currentModel ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{model.name}</span>
                            {model.size && (
                              <span className="text-xs text-gray-500">{model.size}</span>
                            )}
                          </div>
                          {model.quantization && (
                            <div className="text-xs text-gray-500 mt-1">
                              {model.quantization}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function groupModelsByProvider(models: ModelInfo[]): Record<string, ModelInfo[]> {
  return models.reduce((acc, model) => {
    const provider = model.provider
    if (!acc[provider]) {
      acc[provider] = []
    }
    acc[provider].push(model)
    return acc
  }, {} as Record<string, ModelInfo[]>)
}
