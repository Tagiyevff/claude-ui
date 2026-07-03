import { useState } from 'react'
import { Copy, Check, Download, Maximize2, ChevronDown, ChevronRight } from 'lucide-react'
import { copyToClipboard, downloadFile } from '../../lib/utils'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface CodeBlockProps {
  code: string
  language: string
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleCopy = async () => {
    try {
      await copyToClipboard(code)
      setCopied(true)
      toast.success('Code copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const handleDownload = () => {
    const extension = getFileExtension(language)
    downloadFile(code, `code.${extension}`, 'text/plain')
    toast.success('Code downloaded')
  }

  const handleFullScreen = () => {
    // This would open a modal with the code - simplified for now
    toast.info('Full screen view coming soon')
  }

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-dark-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-dark-700 rounded transition-colors"
            aria-label={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {language || 'text'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-200 dark:hover:bg-dark-700 rounded transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-200 dark:hover:bg-dark-700 rounded transition-colors"
            aria-label="Download code"
          >
            <Download size={16} />
          </button>
          <button
            onClick={handleFullScreen}
            className="p-2 hover:bg-gray-200 dark:hover:bg-dark-700 rounded transition-colors"
            aria-label="Full screen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Code content */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <pre className="p-4 overflow-x-auto scrollbar-thin">
              <code className="text-sm font-mono leading-relaxed">
                {code.split('\n').map((line, i) => (
                  <div key={i} className="table-row">
                    <span className="table-cell pr-4 text-right select-none text-gray-400 dark:text-gray-600 w-8">
                      {i + 1}
                    </span>
                    <span className="table-cell">{line || ' '}</span>
                  </div>
                ))}
              </code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    java: 'java',
    csharp: 'cs',
    cpp: 'cpp',
    c: 'c',
    go: 'go',
    rust: 'rs',
    php: 'php',
    ruby: 'rb',
    swift: 'swift',
    kotlin: 'kt',
    scala: 'scala',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    yaml: 'yaml',
    xml: 'xml',
    sql: 'sql',
    bash: 'sh',
    shell: 'sh',
    markdown: 'md',
  }

  return extensions[language.toLowerCase()] || 'txt'
}
