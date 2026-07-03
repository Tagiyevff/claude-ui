import { useState } from 'react'
import { Plus, Trash2, Eye, EyeOff, Check, X } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { ModelProvider } from '../../types'

export default function ApiSettings() {
  const { apiConfigs, addApiConfig, updateApiConfig, deleteApiConfig, toggleApiConfig } = useSettingsStore()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-100">API Providers</h3>
          <p className="text-sm text-text-400 mt-1">
            Configure API keys and endpoints for AI providers
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors flex items-center gap-2 font-medium"
        >
          <Plus size={18} />
          Add Provider
        </button>
      </div>

      {showForm && (
        <ApiConfigForm
          onSave={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-3">
        {apiConfigs.length === 0 ? (
          <div className="text-center py-12 text-text-400">
            No API providers configured. Add one to get started.
          </div>
        ) : (
          apiConfigs.map(config => (
            <div key={config.id} className="bg-bg-200 p-4 rounded-xl border border-bg-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold ${config.enabled ? 'bg-accent' : 'bg-text-400'}`}>
                    {config.provider[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-text-100">{config.name}</div>
                    <div className="text-sm text-text-400 capitalize">{config.provider}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleApiConfig(config.id)}
                    className={`p-2 rounded-lg transition-colors ${config.enabled ? 'bg-accent/10 text-accent' : 'bg-bg-300 text-text-400'}`}
                    aria-label={config.enabled ? 'Disable' : 'Enable'}
                  >
                    {config.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this API configuration?')) deleteApiConfig(config.id) }}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

interface ApiConfigFormProps {
  onSave: () => void
  onCancel: () => void
}

function ApiConfigForm({ onSave, onCancel }: ApiConfigFormProps) {
  const { addApiConfig } = useSettingsStore()
  const [provider, setProvider] = useState<ModelProvider>('openai')
  const [name, setName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addApiConfig({
      provider,
      name: name || provider,
      apiKey: apiKey || undefined,
      baseUrl: baseUrl || undefined,
      enabled: true,
    })
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-200 p-4 rounded-xl border border-bg-300 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-text-100">Provider</label>
        <select value={provider} onChange={(e) => setProvider(e.target.value as ModelProvider)}
          className="w-full px-4 py-2 bg-bg-100 border border-bg-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-text-100" required>
          <option value="ollama">Ollama</option>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="google">Google Gemini</option>
          <option value="groq">Groq</option>
          <option value="openrouter">OpenRouter</option>
          <option value="custom">Custom (OpenAI Compatible)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-text-100">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder={`My ${provider}`}
          className="w-full px-4 py-2 bg-bg-100 border border-bg-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-text-100" />
      </div>
      {provider !== 'ollama' && (
        <div>
          <label className="block text-sm font-medium mb-2 text-text-100">API Key</label>
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-2 bg-bg-100 border border-bg-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-text-100" />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-2 text-text-100">Base URL (Optional)</label>
        <input type="url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)}
          placeholder={provider === 'ollama' ? 'http://localhost:11434' : 'https://api...'}
          className="w-full px-4 py-2 bg-bg-100 border border-bg-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-text-100" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl flex items-center gap-2">
          <Check size={18} /> Save
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-bg-300 hover:bg-bg-300/70 text-text-100 rounded-xl flex items-center gap-2">
          <X size={18} /> Cancel
        </button>
      </div>
    </form>
  )
}
