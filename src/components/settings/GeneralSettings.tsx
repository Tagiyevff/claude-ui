import { useSettingsStore } from '../../stores/settingsStore'
import { useThemeStore } from '../../stores/themeStore'

export default function GeneralSettings() {
  const { language, streaming, generationConfig, updateSettings, updateGenerationConfig } = useSettingsStore()
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="space-y-6 text-text-100">
      <section>
        <h3 className="text-base font-semibold mb-3">Profile</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-bg-200 rounded-xl">
            <span className="text-sm text-text-300">Avatar</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white font-medium">
              U
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-bg-200 rounded-xl">
            <span className="text-sm text-text-300">Full name</span>
            <input type="text" defaultValue="User" className="text-right bg-transparent border-0 outline-none text-sm text-text-100 w-32" />
          </div>
          <div className="p-3 bg-bg-200 rounded-xl">
            <div className="text-sm text-text-300 mb-2">Instructions for TagUI</div>
            <textarea defaultValue="" placeholder="e.g. keep explanations brief and to the point" rows={3}
              className="w-full bg-transparent border-0 outline-none text-sm text-text-100 placeholder:text-text-400 resize-none" />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold mb-3">Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-bg-200 rounded-xl">
            <span className="text-sm text-text-300">Appearance</span>
            <div className="flex gap-1 p-1 bg-bg-300 rounded-lg">
              <button onClick={() => setTheme('light')}
                className={`p-1.5 rounded-md transition-all ${theme === 'light' ? 'bg-bg-100 text-text-100' : 'text-text-400 hover:text-text-200'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              </button>
              <button onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-md transition-all ${theme === 'dark' ? 'bg-bg-100 text-text-100' : 'text-text-400 hover:text-text-200'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-bg-200 rounded-xl">
            <span className="text-sm text-text-300">Language</span>
            <select value={language} onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'tr' })}
              className="bg-transparent border-0 outline-none text-sm text-text-100 cursor-pointer">
              <option value="en">English</option><option value="tr">Türkçe</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-bg-200 rounded-xl">
            <div>
              <div className="text-sm text-text-300">Streaming</div>
              <div className="text-xs text-text-400">Stream responses word by word</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={streaming} onChange={(e) => updateSettings({ streaming: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-bg-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold mb-3">Generation Settings</h3>
        <div className="space-y-3">
          <div className="p-3 bg-bg-200 rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-300">Temperature</span>
              <span className="text-text-100 font-medium">{generationConfig.temperature}</span>
            </div>
            <input type="range" min="0" max="2" step="0.1" value={generationConfig.temperature}
              onChange={(e) => updateGenerationConfig({ temperature: parseFloat(e.target.value) })}
              className="w-full accent-accent" />
            <div className="flex justify-between text-xs text-text-400 mt-1"><span>Focused</span><span>Creative</span></div>
          </div>

          <div className="p-3 bg-bg-200 rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-300">Top P</span>
              <span className="text-text-100 font-medium">{generationConfig.topP}</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={generationConfig.topP}
              onChange={(e) => updateGenerationConfig({ topP: parseFloat(e.target.value) })}
              className="w-full accent-accent" />
          </div>

          <div className="flex items-center justify-between p-3 bg-bg-200 rounded-xl">
            <span className="text-sm text-text-300">Max Tokens</span>
            <input type="number" min="1" max="32000" value={generationConfig.maxTokens}
              onChange={(e) => updateGenerationConfig({ maxTokens: parseInt(e.target.value) })}
              className="w-24 text-right bg-transparent border-0 outline-none text-sm text-text-100" />
          </div>

          <div className="p-3 bg-bg-200 rounded-xl">
            <div className="text-sm text-text-300 mb-2">System Prompt</div>
            <textarea value={generationConfig.systemPrompt || ''}
              onChange={(e) => updateGenerationConfig({ systemPrompt: e.target.value })}
              placeholder="You are a helpful assistant..." rows={3}
              className="w-full bg-transparent border-0 outline-none text-sm text-text-100 placeholder:text-text-400 resize-none" />
          </div>
        </div>
      </section>
    </div>
  )
}
