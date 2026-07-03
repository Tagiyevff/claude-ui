import { motion } from 'framer-motion'
import { User, Bot, Copy, RefreshCw, Trash2, Edit2, Check, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useState } from 'react'
import { Message as MessageType } from '../../types'
import { useChatStore } from '../../stores/chatStore'
import { copyToClipboard } from '../../lib/utils'
import { toast } from 'sonner'
import MarkdownRenderer from './MarkdownRenderer'

interface MessageProps {
  message: MessageType
  chatId: string
  onRegenerate?: (messageId: string) => void
}

export default function Message({ message, chatId, onRegenerate }: MessageProps) {
  const { deleteMessage, updateMessage } = useChatStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [showActions, setShowActions] = useState(false)

  const handleCopy = async () => {
    try {
      await copyToClipboard(message.content)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const handleDelete = () => {
    if (confirm('Delete this message?')) {
      deleteMessage(chatId, message.id)
    }
  }

  const handleEdit = () => setIsEditing(true)

  const handleSaveEdit = () => {
    updateMessage(chatId, message.id, editContent)
    setIsEditing(false)
    toast.success('Message updated')
  }

  const handleCancelEdit = () => {
    setEditContent(message.content)
    setIsEditing(false)
  }

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id)
    }
  }

  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse justify-start' : 'flex-row'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className="shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-[#D97757] dark:bg-[#D2996E]'
              : 'bg-[#F0EEE6] dark:bg-[#30302E] border border-bg-300'
          }`}
        >
          {isUser ? (
            <User size={16} className="text-white" />
          ) : (
            <Bot size={16} className="text-text-200" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 max-w-[85%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div
          className={`
            px-4 py-3
            ${isUser
              ? 'bg-[#D97757] dark:bg-[#D2996E] text-white rounded-2xl rounded-br-sm'
              : 'text-text-100'
            }
          `}
        >
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[100px] input-field resize-y"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button onClick={handleSaveEdit} className="px-3 py-1 bg-accent text-white rounded-lg flex items-center gap-1 text-sm">
                  <Check size={16} />
                  Save
                </button>
                <button onClick={handleCancelEdit} className="px-3 py-1 bg-bg-200 text-text-100 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {isUser ? (
                <p className="text-sm leading-relaxed">{message.content}</p>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {message.streaming ? (
                    <>
                      <MarkdownRenderer content={message.content} />
                      <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-1" />
                    </>
                  ) : (
                    <MarkdownRenderer content={message.content} />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons - only for non-user messages */}
        {!isUser && showActions && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 mt-2 px-1"
          >
            <button onClick={handleCopy} className="p-1.5 hover:bg-bg-200 rounded-lg transition-colors text-text-400 hover:text-text-200" aria-label="Copy">
              <Copy size={14} />
            </button>
            <button onClick={handleRegenerate} className="p-1.5 hover:bg-bg-200 rounded-lg transition-colors text-text-400 hover:text-text-200" aria-label="Regenerate">
              <RefreshCw size={14} />
            </button>
            <button onClick={handleDelete} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors text-text-400" aria-label="Delete">
              <Trash2 size={14} />
            </button>
            <span className="mx-1 text-bg-300">|</span>
            <button className="p-1.5 hover:bg-bg-200 rounded-lg transition-colors text-text-400 hover:text-text-200" aria-label="Like">
              <ThumbsUp size={14} />
            </button>
            <button className="p-1.5 hover:bg-bg-200 rounded-lg transition-colors text-text-400 hover:text-text-200" aria-label="Dislike">
              <ThumbsDown size={14} />
            </button>
          </motion.div>
        )}

        {/* Edit button for user messages */}
        {isUser && showActions && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 mt-2 px-1"
          >
            <button onClick={handleEdit} className="p-1.5 hover:bg-bg-200 rounded-lg transition-colors text-text-400 hover:text-text-200" aria-label="Edit">
              <Edit2 size={14} />
            </button>
            <button onClick={handleDelete} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors text-text-400" aria-label="Delete">
              <Trash2 size={14} />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
