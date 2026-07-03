// Core types for TagUI

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  model?: string
  attachments?: FileAttachment[]
  streaming?: boolean
  metadata?: Record<string, unknown>
}

export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  url?: string
  data?: string | ArrayBuffer
  preview?: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  model: string
  systemPrompt?: string
  pinned?: boolean
  folderId?: string
}

export interface Folder {
  id: string
  name: string
  createdAt: number
  order: number
}

export type ModelProvider =
  | 'ollama'
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'groq'
  | 'openrouter'
  | 'lmstudio'
  | 'vllm'
  | 'textgen'
  | 'koboldcpp'
  | 'custom'

export interface ModelInfo {
  id: string
  name: string
  provider: ModelProvider
  contextLength?: number
  size?: string
  quantization?: string
  favorite?: boolean
  capabilities?: {
    streaming?: boolean
    vision?: boolean
    functionCalling?: boolean
  }
}

export interface ApiConfig {
  id: string
  provider: ModelProvider
  name: string
  apiKey?: string
  baseUrl?: string
  enabled: boolean
  models?: ModelInfo[]
}

export interface GenerationConfig {
  temperature: number
  topP: number
  topK?: number
  maxTokens: number
  seed?: number
  stream: boolean
  systemPrompt?: string
}

export interface AppSettings {
  theme: 'light' | 'dark'
  language: 'en' | 'tr'
  defaultModel: string
  streaming: boolean
  generationConfig: GenerationConfig
  apiConfigs: ApiConfig[]
  proxyUrl?: string
}

export interface StreamChunk {
  content: string
  done: boolean
  model?: string
}
