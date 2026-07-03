import { useEffect, useState } from 'react'
import { Star, RefreshCw, Download, Trash2 } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { fetchOllamaModels } from '../../lib/api'
import { formatFileSize } from '../../lib/utils'
import { toast } from 'sonner'

export default function ModelSettings() {
  const { apiConfigs } = useSettingsStore()
  const [ollamaModels, setOllamaModels] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadOllamaModels()
  }, [apiConfigs])

  const loadOllamaModels = async () => {
    setLoading(true)
    const ollamaConfig = apiConfigs.find(c => c.provider === 'ollama' && c.enabled)
    if (ollamaConfig) {
      try {
        const models = await fetchOllamaModels(ollamaConfig.baseUrl)
        setOllamaModels(models)
        if (models.length > 0) {
          toast.success(`${models.length} Ollama model bulundu`)
        }
      } catch (error) {
        toast.error('Ollama modelleri yüklenemedi. Ollama çalışıyor mu?')
      }
    } else {
      toast.info('Ollama yapılandırılmamış. Otomatik algılama için Ollama\'yı başlatın.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Ollama Modelleri</h3>
          <p className="text-sm text-gray-500 mt-1">
            Yerel Ollama modellerinizi görüntüleyin ve yönetin
          </p>
        </div>
        <button
          onClick={loadOllamaModels}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Yenile
        </button>
      </div>

      {!apiConfigs.find(c => c.provider === 'ollama') && (
        <div className="glass p-6 rounded-xl text-center">
          <div className="text-gray-500 mb-4">
            <p className="font-medium mb-2">Ollama Algılanmadı</p>
            <p className="text-sm">
              Ollama'yı yükleyin ve bir model çekin:
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-dark-900 rounded-lg p-4 text-left font-mono text-sm space-y-2">
            <div># 1. Ollama'yı yükleyin:</div>
            <div className="text-blue-600 dark:text-blue-400">https://ollama.ai</div>
            <div className="mt-3"># 2. Bir model çekin:</div>
            <div className="text-green-600 dark:text-green-400">ollama pull llama2</div>
            <div className="mt-3"># 3. Bu sayfayı yenileyin</div>
          </div>
        </div>
      )}

      {ollamaModels.length === 0 && apiConfigs.find(c => c.provider === 'ollama') ? (
        <div className="text-center py-12 text-gray-500">
          {loading ? 'Modeller yükleniyor...' : 'Ollama model bulunamadı. Terminal\'de "ollama pull llama2" komutunu çalıştırın.'}
        </div>
      ) : (
        <div className="space-y-3">
          {ollamaModels.map((model: any) => (
            <ModelCard key={model.name} model={model} />
          ))}
        </div>
      )}

      {ollamaModels.length > 0 && (
        <div className="glass p-4 rounded-lg text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium mb-2">💡 İpucu:</p>
          <p>Daha fazla model eklemek için:</p>
          <code className="block mt-2 bg-gray-100 dark:bg-dark-900 p-2 rounded">
            ollama pull mistral<br/>
            ollama pull codellama<br/>
            ollama pull llama3
          </code>
        </div>
      )}
    </div>
  )
}

interface ModelCardProps {
  model: any
}

function ModelCard({ model }: ModelCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="glass p-4 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{model.name}</h4>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-gray-400 hover:text-yellow-500 transition-colors"
              aria-label="Favorilere ekle"
            >
              <Star size={16} className={isFavorite ? 'fill-yellow-500 text-yellow-500' : ''} />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            {model.size && (
              <div>
                <span className="text-gray-500">Boyut:</span>{' '}
                <span className="font-medium">{formatFileSize(parseInt(model.size))}</span>
              </div>
            )}
            {model.details?.parameter_size && (
              <div>
                <span className="text-gray-500">Parametreler:</span>{' '}
                <span className="font-medium">{model.details.parameter_size}</span>
              </div>
            )}
            {model.details?.quantization_level && (
              <div>
                <span className="text-gray-500">Quantization:</span>{' '}
                <span className="font-medium">{model.details.quantization_level}</span>
              </div>
            )}
            {model.details?.family && (
              <div>
                <span className="text-gray-500">Aile:</span>{' '}
                <span className="font-medium capitalize">{model.details.family}</span>
              </div>
            )}
          </div>

          {model.modified_at && (
            <div className="mt-2 text-xs text-gray-500">
              Güncellenme: {new Date(model.modified_at).toLocaleString('tr-TR')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
