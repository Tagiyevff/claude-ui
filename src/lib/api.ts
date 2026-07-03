import { ModelProvider, StreamChunk, ApiConfig, GenerationConfig } from '../types'

interface ChatCompletionRequest {
  model: string
  messages: Array<{
    role: string
    content: string
  }>
  stream?: boolean
  temperature?: number
  top_p?: number
  max_tokens?: number
  [key: string]: unknown
}

export class ApiService {
  private apiConfig: ApiConfig
  private generationConfig: GenerationConfig

  constructor(apiConfig: ApiConfig, generationConfig: GenerationConfig) {
    this.apiConfig = apiConfig
    this.generationConfig = generationConfig
  }

  async *streamCompletion(
    messages: Array<{ role: string; content: string }>,
    model: string
  ): AsyncGenerator<StreamChunk> {
    const provider = this.apiConfig.provider

    // Extract actual model name (remove provider prefix like "ollama:llama2" -> "llama2")
    const modelName = model.includes(':') ? model.split(':')[1] : model

    switch (provider) {
      case 'ollama':
        yield* this.streamOllama(messages, modelName)
        break
      case 'openai':
      case 'groq':
      case 'openrouter':
      case 'custom':
        yield* this.streamOpenAICompatible(messages, modelName)
        break
      case 'anthropic':
        yield* this.streamAnthropic(messages, modelName)
        break
      case 'google':
        yield* this.streamGoogle(messages, modelName)
        break
      default:
        throw new Error(`Provider ${provider} not implemented`)
    }
  }

  private async *streamOllama(
    messages: Array<{ role: string; content: string }>,
    model: string
  ): AsyncGenerator<StreamChunk> {
    const baseUrl = this.apiConfig.baseUrl || 'http://localhost:11434'
    const url = `${baseUrl}/api/chat`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        options: {
          temperature: this.generationConfig.temperature,
          top_p: this.generationConfig.topP,
          top_k: this.generationConfig.topK,
          num_predict: this.generationConfig.maxTokens,
          seed: this.generationConfig.seed,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line)
            if (data.message?.content) {
              yield {
                content: data.message.content,
                done: data.done || false,
                model: data.model,
              }
            }
          } catch (e) {
            console.error('Failed to parse Ollama response:', e)
          }
        }
      }
    }
  }

  private async *streamOpenAICompatible(
    messages: Array<{ role: string; content: string }>,
    model: string
  ): AsyncGenerator<StreamChunk> {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}/chat/completions`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiConfig.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: this.generationConfig.temperature,
        top_p: this.generationConfig.topP,
        max_tokens: this.generationConfig.maxTokens,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              yield {
                content,
                done: false,
                model: parsed.model,
              }
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e)
          }
        }
      }
    }
  }

  private async *streamAnthropic(
    messages: Array<{ role: string; content: string }>,
    model: string
  ): AsyncGenerator<StreamChunk> {
    const baseUrl = this.apiConfig.baseUrl || 'https://api.anthropic.com/v1'
    const url = `${baseUrl}/messages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiConfig.apiKey || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: this.generationConfig.maxTokens,
        temperature: this.generationConfig.temperature,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)

          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta') {
              const content = parsed.delta?.text
              if (content) {
                yield { content, done: false, model }
              }
            }
          } catch (e) {
            console.error('Failed to parse Anthropic response:', e)
          }
        }
      }
    }
  }

  private async *streamGoogle(
    messages: Array<{ role: string; content: string }>,
    model: string
  ): AsyncGenerator<StreamChunk> {
    // Google Gemini implementation
    const baseUrl = this.apiConfig.baseUrl || 'https://generativelanguage.googleapis.com/v1'
    const url = `${baseUrl}/models/${model}:streamGenerateContent?key=${this.apiConfig.apiKey}`

    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: this.generationConfig.temperature,
          topP: this.generationConfig.topP,
          topK: this.generationConfig.topK,
          maxOutputTokens: this.generationConfig.maxTokens,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line)
            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text
            if (content) {
              yield { content, done: false, model }
            }
          } catch (e) {
            console.error('Failed to parse Google response:', e)
          }
        }
      }
    }
  }

  private getBaseUrl(): string {
    if (this.apiConfig.baseUrl) return this.apiConfig.baseUrl

    switch (this.apiConfig.provider) {
      case 'openai':
        return 'https://api.openai.com/v1'
      case 'groq':
        return 'https://api.groq.com/openai/v1'
      case 'openrouter':
        return 'https://openrouter.ai/api/v1'
      default:
        return ''
    }
  }
}

export async function fetchOllamaModels(baseUrl = 'http://localhost:11434'): Promise<unknown[]> {
  try {
    const response = await fetch(`${baseUrl}/api/tags`)
    if (!response.ok) throw new Error('Failed to fetch Ollama models')
    const data = await response.json()
    return data.models || []
  } catch (error) {
    console.error('Error fetching Ollama models:', error)
    return []
  }
}
