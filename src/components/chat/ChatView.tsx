import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../../stores/chatStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { ApiService } from '../../lib/api'
import MessageList from '../messages/MessageList'
import ClaudeChatInput from '../ui/claude-style-chat-input'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function ChatView() {
  const { chatId } = useParams()
  const { chats, activeChat, setActiveChat, createChat, addMessage, updateMessage, getChatById } = useChatStore()
  const { defaultModel, generationConfig, apiConfigs } = useSettingsStore()
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (chatId) {
      setActiveChat(chatId)
    } else if (!initialized.current && chats.length === 0) {
      const newChatId = createChat(defaultModel)
      setActiveChat(newChatId)
      initialized.current = true
    }
  }, [chatId, chats.length, setActiveChat, createChat, defaultModel])

  const currentChat = chats.find(c => c.id === activeChat)
  const hasMessages = currentChat && currentChat.messages.length > 0

  const handleSendMessage = async (data: {
    message: string;
    files: any[];
    pastedContent: any[];
    model: string;
    isThinkingEnabled: boolean;
  }) => {
    if (!currentChat) return

    addMessage(currentChat.id, {
      role: 'user',
      content: data.message,
      attachments: data.files.length > 0 ? data.files : undefined,
    })

    const apiMessages = currentChat.messages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    apiMessages.push({
      role: 'user',
      content: data.message,
    })

    if (generationConfig.systemPrompt) {
      apiMessages.unshift({
        role: 'system',
        content: generationConfig.systemPrompt,
      })
    }

    const modelId = data.model || defaultModel
    const [provider] = modelId.split(':')
    const apiConfig = apiConfigs.find(c => c.provider === provider && c.enabled)

    if (!apiConfig) {
      toast.error(`No API configuration found for ${provider}`)
      addMessage(currentChat.id, {
        role: 'assistant',
        content: `Error: No API configuration found for ${provider}.`,
      })
      return
    }

    addMessage(currentChat.id, {
      role: 'assistant',
      content: '',
      streaming: true,
    })

    setIsStreaming(true)
    abortControllerRef.current = new AbortController()

    try {
      const apiService = new ApiService(apiConfig, generationConfig)
      let fullContent = ''

      for await (const chunk of apiService.streamCompletion(apiMessages, modelId)) {
        if (abortControllerRef.current?.signal.aborted) break
        fullContent += chunk.content
        const chat = getChatById(currentChat.id)
        if (chat) {
          const lastMessage = chat.messages[chat.messages.length - 1]
          if (lastMessage.role === 'assistant') {
            updateMessage(currentChat.id, lastMessage.id, fullContent)
          }
        }
      }

      const finalChat = getChatById(currentChat.id)
      if (finalChat) {
        const lastMsg = finalChat.messages[finalChat.messages.length - 1]
        if (lastMsg?.role === 'assistant') lastMsg.streaming = false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Error: ${errorMessage}`)
      const chat = getChatById(currentChat.id)
      if (chat) {
        const lastMsg = chat.messages[chat.messages.length - 1]
        if (lastMsg?.role === 'assistant') {
          updateMessage(currentChat.id, lastMsg.id, `Error: ${errorMessage}`)
          lastMsg.streaming = false
        }
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const currentHour = new Date().getHours()
  let greeting = 'Good morning'
  if (currentHour >= 12 && currentHour < 18) greeting = 'Good afternoon'
  else if (currentHour >= 18) greeting = 'Good evening'

  return (
    <div className="h-full flex flex-col bg-bg-0">
      {!hasMessages ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="max-w-3xl w-full flex flex-col items-center justify-center flex-1">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Sparkles size={40} className="text-accent" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-light text-text-200 mb-2 tracking-tight">
                {greeting}
              </h1>
              <p className="text-sm text-text-400">Your intelligent AI assistant is ready to help</p>
            </div>
          </div>

          <div className="w-full max-w-2xl px-4 pb-8">
            <ClaudeChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <MessageList messages={currentChat.messages} chatId={currentChat.id} />
          </div>
          <div className="px-4 pb-4 pt-2">
            <ClaudeChatInput onSendMessage={handleSendMessage} />
          </div>
        </>
      )}
    </div>
  )
}
