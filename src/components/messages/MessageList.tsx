import { useRef, useEffect, useState } from 'react'
import { Message as MessageType } from '../../types'
import Message from './Message'
import { useChatStore } from '../../stores/chatStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { ApiService } from '../../lib/api'
import { toast } from 'sonner'

interface MessageListProps {
  messages: MessageType[]
  chatId: string
}

export default function MessageList({ messages, chatId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const { addMessage, updateMessage, getChatById } = useChatStore()
  const { generationConfig, apiConfigs, defaultModel } = useSettingsStore()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleRegenerate = async (messageId: string) => {
    const chat = getChatById(chatId)
    if (!chat) return

    // Find the message index
    const msgIndex = chat.messages.findIndex(m => m.id === messageId)
    if (msgIndex < 0) return

    // Get messages up to and including the PREVIOUS user message
    // Find the last user message before this assistant message
    let lastUserIndex = -1
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (chat.messages[i].role === 'user') {
        lastUserIndex = i
        break
      }
    }
    if (lastUserIndex < 0) return

    // Remove messages from this assistant onward
    const messagesToKeep = chat.messages.slice(0, lastUserIndex + 1)
    const apiMessages = messagesToKeep.map(m => ({
      role: m.role,
      content: m.content,
    }))

    // Add system prompt if exists
    if (generationConfig.systemPrompt) {
      apiMessages.unshift({
        role: 'system',
        content: generationConfig.systemPrompt,
      })
    }

    // Find API config
    const modelId = defaultModel
    const [provider] = modelId.split(':')
    const apiConfig = apiConfigs.find(c => c.provider === provider && c.enabled)

    if (!apiConfig) {
      toast.error(`No API configuration found for ${provider}`)
      return
    }

    // Add new assistant message placeholder
    addMessage(chatId, {
      role: 'assistant',
      content: '',
      streaming: true,
    })

    try {
      const apiService = new ApiService(apiConfig, generationConfig)
      let fullContent = ''

      for await (const chunk of apiService.streamCompletion(apiMessages, modelId)) {
        fullContent += chunk.content
        const currentChat = getChatById(chatId)
        if (currentChat) {
          const lastMsg = currentChat.messages[currentChat.messages.length - 1]
          if (lastMsg.role === 'assistant') {
            updateMessage(chatId, lastMsg.id, fullContent)
          }
        }
      }

      const finalChat = getChatById(chatId)
      if (finalChat) {
        const lastMsg = finalChat.messages[finalChat.messages.length - 1]
        if (lastMsg.role === 'assistant') lastMsg.streaming = false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Error: ${errorMessage}`)
      const currentChat = getChatById(chatId)
      if (currentChat) {
        const lastMsg = currentChat.messages[currentChat.messages.length - 1]
        if (lastMsg.role === 'assistant') {
          updateMessage(chatId, lastMsg.id, `Error: ${errorMessage}`)
          lastMsg.streaming = false
        }
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          chatId={chatId}
          onRegenerate={message.role === 'assistant' ? handleRegenerate : undefined}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
