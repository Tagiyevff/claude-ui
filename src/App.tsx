import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useThemeStore } from './stores/themeStore'
import { useSettingsStore } from './stores/settingsStore'
import { fetchOllamaModels } from './lib/api'
import MainLayout from './components/layout/MainLayout'
import ChatView from './components/chat/ChatView'
import ChatboxDemo from './components/ui/claude-chat-demo'

function App() {
  const { theme, setTheme } = useThemeStore()
  const { apiConfigs, addApiConfig } = useSettingsStore()

  // Set dark class on html element whenever theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Auto-detect and configure Ollama
  useEffect(() => {
    const setupOllama = async () => {
      const hasOllama = apiConfigs.some(config => config.provider === 'ollama')

      if (!hasOllama) {
        try {
          const models = await fetchOllamaModels('http://localhost:11434')

          if (models.length > 0) {
            addApiConfig({
              provider: 'ollama',
              name: 'Ollama (Local)',
              baseUrl: 'http://localhost:11434',
              enabled: true,
            })
            console.log('✅ Ollama automatically detected and configured')
          }
        } catch (error) {
          console.log('ℹ️ Ollama not detected (install from ollama.ai)')
        }
      }
    }

    setupOllama()
  }, [apiConfigs, addApiConfig])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<ChatView />} />
          <Route path="chat/:chatId" element={<ChatView />} />
          <Route path="claude-demo" element={<ChatboxDemo />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
