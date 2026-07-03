import { Sparkles, Zap, FileText, Code } from 'lucide-react'

export default function EmptyState() {
  const suggestions = [
    {
      icon: Code,
      title: 'Write code',
      description: 'Help me build a React component',
    },
    {
      icon: FileText,
      title: 'Explain concepts',
      description: 'Teach me about async/await in JavaScript',
    },
    {
      icon: Zap,
      title: 'Debug issues',
      description: 'Why is my API call failing?',
    },
    {
      icon: Sparkles,
      title: 'Brainstorm ideas',
      description: 'Give me project ideas for learning',
    },
  ]

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
            <Sparkles size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
            Welcome to TagUI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your intelligent AI assistant is ready to help
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="glass glass-hover p-6 rounded-xl text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <suggestion.icon size={24} className="text-blue-600 dark:text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Start a conversation by typing a message below</p>
        </div>
      </div>
    </div>
  )
}
