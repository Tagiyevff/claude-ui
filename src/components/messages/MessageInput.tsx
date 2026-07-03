import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { Send, Paperclip, Mic, X, Image as ImageIcon, StopCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '../../stores/chatStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { ApiService } from '../../lib/api'
import { FileAttachment } from '../../types'
import { generateId, formatFileSize, isImageFile } from '../../lib/utils'
import { toast } from 'sonner'

interface MessageInputProps {
  chatId: string
  model: string
}

export default function MessageInput({ chatId, model }: MessageInputProps) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const { addMessage, updateMessage, getChatById } = useChatStore()
  const { generationConfig, apiConfigs } = useSettingsStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const attachment: FileAttachment = {
          id: generateId(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result as string,
        }

        if (isImageFile(file.name)) {
          attachment.preview = reader.result as string
        }

        setAttachments(prev => [...prev, attachment])
        toast.success(`Added ${file.name}`)
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  })

  const handleFileSelect = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      onDrop(files)
    }
    input.click()
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return
    if (isStreaming) return

    const userMessage = input.trim()
    setInput('')
    const userAttachments = [...attachments]
    setAttachments([])

    // Add user message
    addMessage(chatId, {
      role: 'user',
      content: userMessage,
      attachments: userAttachments.length > 0 ? userAttachments : undefined,
    })

    // Prepare messages for API
    const chat = getChatById(chatId)
    if (!chat) return

    const apiMessages = chat.messages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    // Add the new user message to API messages
    apiMessages.push({
      role: 'user',
      content: userMessage,
    })

    // Add system prompt if exists
    if (generationConfig.systemPrompt) {
      apiMessages.unshift({
        role: 'system',
        content: generationConfig.systemPrompt,
      })
    }

    // Find API config for the model
    const [provider] = model.split(':')
    const apiConfig = apiConfigs.find(
      c => c.provider === provider && c.enabled
    )

    if (!apiConfig) {
      toast.error(`No API configuration found for ${provider}`)
      addMessage(chatId, {
        role: 'assistant',
        content: `Error: No API configuration found for ${provider}. Please configure it in settings.`,
      })
      return
    }

    // Create assistant message placeholder
    const assistantMessageId = generateId()
    addMessage(chatId, {
      role: 'assistant',
      content: '',
      streaming: true,
    })

    setIsStreaming(true)
    abortControllerRef.current = new AbortController()

    try {
      const apiService = new ApiService(apiConfig, generationConfig)
      let fullContent = ''

      for await (const chunk of apiService.streamCompletion(apiMessages, model)) {
        if (abortControllerRef.current?.signal.aborted) {
          break
        }

        fullContent += chunk.content

        // Update the message with accumulated content
        const currentChat = getChatById(chatId)
        if (currentChat) {
          const lastMessage = currentChat.messages[currentChat.messages.length - 1]
          if (lastMessage.role === 'assistant') {
            updateMessage(chatId, lastMessage.id, fullContent)
          }
        }
      }

      // Mark streaming as complete
      const finalChat = getChatById(chatId)
      if (finalChat) {
        const lastMessage = finalChat.messages[finalChat.messages.length - 1]
        if (lastMessage.role === 'assistant') {
          updateMessage(chatId, lastMessage.id, fullContent)
          // Remove streaming flag
          lastMessage.streaming = false
        }
      }
    } catch (error) {
      console.error('Streaming error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Error: ${errorMessage}`)

      const currentChat = getChatById(chatId)
      if (currentChat) {
        const lastMessage = currentChat.messages[currentChat.messages.length - 1]
        if (lastMessage.role === 'assistant') {
          updateMessage(
            chatId,
            lastMessage.id,
            `Error: ${errorMessage}\n\nPlease check your API configuration and try again.`
          )
          lastMessage.streaming = false
        }
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
      toast.info('Stopped generating')
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div {...getRootProps()} className="relative">
          <input {...getInputProps()} />

          {/* Drag overlay */}
          <AnimatePresence>
            {isDragActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm border-2 border-dashed border-blue-500 rounded-xl"
              >
                <div className="text-center">
                  <Paperclip size={48} className="mx-auto mb-2 text-blue-600" />
                  <p className="text-lg font-medium text-blue-600">Drop files here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map(attachment => (
                <AttachmentPreview
                  key={attachment.id}
                  attachment={attachment}
                  onRemove={() => removeAttachment(attachment.id)}
                />
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="glass rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="w-full px-4 py-3 bg-transparent resize-none outline-none max-h-48 scrollbar-thin"
              rows={3}
              disabled={isStreaming}
            />

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFileSelect}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                  aria-label="Attach file"
                  disabled={isStreaming}
                >
                  <Paperclip size={20} />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                  aria-label="Voice input"
                  disabled={isStreaming}
                >
                  <Mic size={20} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {input.length} characters
                </span>
                {isStreaming ? (
                  <button
                    onClick={handleStop}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <StopCircle size={18} />
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() && attachments.length === 0}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Send size={18} />
                    Send
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AttachmentPreviewProps {
  attachment: FileAttachment
  onRemove: () => void
}

function AttachmentPreview({ attachment, onRemove }: AttachmentPreviewProps) {
  return (
    <div className="relative group">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {attachment.preview ? (
          <img
            src={attachment.preview}
            alt={attachment.name}
            className="w-8 h-8 object-cover rounded"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-200 dark:bg-dark-700 rounded flex items-center justify-center">
            <ImageIcon size={16} />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium truncate max-w-[150px]">
            {attachment.name}
          </span>
          <span className="text-xs text-gray-500">{formatFileSize(attachment.size)}</span>
        </div>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
          aria-label="Remove attachment"
        >
          <X size={16} className="text-red-600" />
        </button>
      </div>
    </div>
  )
}
