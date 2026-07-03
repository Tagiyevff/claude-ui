import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Chat, Message, Folder } from '../types'
import { generateId } from '../lib/utils'

interface ChatState {
  chats: Chat[]
  folders: Folder[]
  activeChat: string | null

  // Chat operations
  createChat: (model: string, systemPrompt?: string) => string
  deleteChat: (chatId: string) => void
  updateChatTitle: (chatId: string, title: string) => void
  pinChat: (chatId: string) => void
  moveChatToFolder: (chatId: string, folderId: string | undefined) => void

  // Message operations
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  updateMessage: (chatId: string, messageId: string, content: string) => void
  deleteMessage: (chatId: string, messageId: string) => void
  regenerateMessage: (chatId: string, messageId: string) => void

  // Folder operations
  createFolder: (name: string) => string
  deleteFolder: (folderId: string) => void
  renameFolder: (folderId: string, name: string) => void

  // UI state
  setActiveChat: (chatId: string | null) => void
  getChatById: (chatId: string) => Chat | undefined
  getChatsInFolder: (folderId: string | undefined) => Chat[]
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      folders: [],
      activeChat: null,

      createChat: (model, systemPrompt) => {
        const id = generateId()
        const chat: Chat = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model,
          systemPrompt,
        }
        set((state) => ({
          chats: [chat, ...state.chats],
          activeChat: id,
        }))
        return id
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter((c) => c.id !== chatId),
          activeChat: state.activeChat === chatId ? null : state.activeChat,
        }))
      },

      updateChatTitle: (chatId, title) => {
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? { ...c, title, updatedAt: Date.now() }
              : c
          ),
        }))
      },

      pinChat: (chatId) => {
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId ? { ...c, pinned: !c.pinned } : c
          ),
        }))
      },

      moveChatToFolder: (chatId, folderId) => {
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId ? { ...c, folderId } : c
          ),
        }))
      },

      addMessage: (chatId, message) => {
        const fullMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: Date.now(),
        }

        set((state) => ({
          chats: state.chats.map((c) => {
            if (c.id !== chatId) return c

            const updatedChat = {
              ...c,
              messages: [...c.messages, fullMessage],
              updatedAt: Date.now(),
            }

            // Auto-generate title from first user message
            if (c.title === 'New Chat' && message.role === 'user' && c.messages.length === 0) {
              updatedChat.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
            }

            return updatedChat
          }),
        }))
      },

      updateMessage: (chatId, messageId, content) => {
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, content } : m
                  ),
                  updatedAt: Date.now(),
                }
              : c
          ),
        }))
      },

      deleteMessage: (chatId, messageId) => {
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.filter((m) => m.id !== messageId),
                  updatedAt: Date.now(),
                }
              : c
          ),
        }))
      },

      regenerateMessage: (chatId, messageId) => {
        // Implementation will be handled by the chat component
        console.log('Regenerate message:', chatId, messageId)
      },

      createFolder: (name) => {
        const id = generateId()
        const folder: Folder = {
          id,
          name,
          createdAt: Date.now(),
          order: get().folders.length,
        }
        set((state) => ({
          folders: [...state.folders, folder],
        }))
        return id
      },

      deleteFolder: (folderId) => {
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== folderId),
          chats: state.chats.map((c) =>
            c.folderId === folderId ? { ...c, folderId: undefined } : c
          ),
        }))
      },

      renameFolder: (folderId, name) => {
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === folderId ? { ...f, name } : f
          ),
        }))
      },

      setActiveChat: (chatId) => {
        set({ activeChat: chatId })
      },

      getChatById: (chatId) => {
        return get().chats.find((c) => c.id === chatId)
      },

      getChatsInFolder: (folderId) => {
        return get().chats.filter((c) => c.folderId === folderId)
      },
    }),
    {
      name: 'chat-storage',
    }
  )
)
