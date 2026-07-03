import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, MessageSquare, Search, Pin, Trash2, User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '../../stores/chatStore'
import { useSettingsStore } from '../../stores/settingsStore'

interface SidebarProps {
  collapsed: boolean
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate()
  const { chats, activeChat, createChat, deleteChat, pinChat, setActiveChat } = useChatStore()
  const { defaultModel } = useSettingsStore()
  const [searchQuery, setSearchQuery] = useState('')

  const handleNewChat = () => {
    const chatId = createChat(defaultModel)
    setActiveChat(chatId)
    navigate(`/chat/${chatId}`)
  }

  const handleChatClick = (chatId: string) => {
    setActiveChat(chatId)
    navigate(`/chat/${chatId}`)
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this chat?')) deleteChat(chatId)
  }

  const handlePinChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    pinChat(chatId)
  }

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pinnedChats = filteredChats.filter(c => c.pinned && !c.folderId)
  const regularChats = filteredChats.filter(c => !c.pinned && !c.folderId)

  if (collapsed) {
    return (
      <div className="w-14 h-full bg-bg-0 flex flex-col items-center py-3 gap-2">
        <button onClick={handleNewChat} className="p-2 rounded-xl bg-bg-200 hover:bg-bg-300 text-text-300 hover:text-text-100 transition-all duration-200" aria-label="New chat">
          <Plus size={18} />
        </button>
        <button className="p-2 rounded-xl hover:bg-bg-200 text-text-300 hover:text-text-100 transition-all duration-200" aria-label="Search">
          <Search size={18} />
        </button>
        <div className="flex-1" />
        <button className="p-2 rounded-xl hover:bg-bg-200 text-text-300 hover:text-text-100 transition-all duration-200" aria-label="Profile">
          <User size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="w-[280px] h-full bg-bg-0 flex flex-col overflow-hidden">
      <div className="p-3 pb-2">
        <button
          onClick={handleNewChat}
          className="w-full px-3 py-2.5 bg-bg-200 hover:bg-bg-300 text-text-100 rounded-xl transition-all duration-200 flex items-center justify-start gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      <div className="px-3 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-bg-200 rounded-xl focus:outline-none focus:bg-bg-200 text-sm text-text-100 placeholder:text-text-400 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
        <AnimatePresence>
          {pinnedChats.length > 0 && (
            <div className="mb-3">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-text-400 uppercase tracking-wider">Pinned</div>
              {pinnedChats.map(chat => (
                <ChatItem key={chat.id} chat={chat} active={chat.id === activeChat} onChatClick={handleChatClick} onDelete={handleDeleteChat} onPin={handlePinChat} />
              ))}
            </div>
          )}

          {regularChats.length > 0 && (
            <div>
              <div className="px-2 py-1.5 text-[11px] font-semibold text-text-400 uppercase tracking-wider">Recents</div>
              {regularChats.map(chat => (
                <ChatItem key={chat.id} chat={chat} active={chat.id === activeChat} onChatClick={handleChatClick} onDelete={handleDeleteChat} onPin={handlePinChat} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface ChatItemProps {
  chat: { id: string; title: string; pinned?: boolean }
  active: boolean
  onChatClick: (id: string) => void
  onDelete: (id: string, e: React.MouseEvent) => void
  onPin: (id: string, e: React.MouseEvent) => void
}

function ChatItem({ chat, active, onChatClick, onDelete, onPin }: ChatItemProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <motion.div
      layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className={`relative group mb-0.5 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
        active ? 'bg-bg-200 text-text-100' : 'hover:bg-bg-200/50 text-text-300 hover:text-text-100'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onChatClick(chat.id)}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <MessageSquare size={14} className="shrink-0 opacity-50" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{chat.title}</div>
        </div>
        <AnimatePresence>
          {showActions && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-1">
              <button onClick={(e) => onPin(chat.id, e)} className="p-1 hover:bg-bg-300 rounded-lg transition-colors" aria-label={chat.pinned ? 'Unpin' : 'Pin'}>
                <Pin size={12} className={chat.pinned ? 'fill-current' : ''} />
              </button>
              <button onClick={(e) => onDelete(chat.id, e)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors" aria-label="Delete">
                <Trash2 size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
