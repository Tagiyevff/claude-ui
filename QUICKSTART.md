# TagUI - Quick Start Guide

## Project Overview

TagUI is a modern AI chat interface built with React, TypeScript, and Tailwind CSS. The project has been successfully created with the following structure:

```
tagui/
├── public/
│   └── tagui-icon.svg          # App icon
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatView.tsx    # Main chat view
│   │   │   └── EmptyState.tsx  # Welcome screen
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Top navigation bar
│   │   │   ├── MainLayout.tsx  # App layout wrapper
│   │   │   └── Sidebar.tsx     # Left sidebar with chat list
│   │   ├── messages/
│   │   │   ├── CodeBlock.tsx   # Code syntax highlighting
│   │   │   ├── MarkdownRenderer.tsx  # Markdown display
│   │   │   ├── Message.tsx     # Individual message
│   │   │   ├── MessageInput.tsx # Input area with file upload
│   │   │   └── MessageList.tsx # Message container
│   │   ├── models/
│   │   │   └── ModelSelector.tsx # Model dropdown
│   │   └── settings/
│   │       ├── ApiSettings.tsx     # API provider config
│   │       ├── GeneralSettings.tsx # General preferences
│   │       ├── ModelSettings.tsx   # Model management
│   │       └── SettingsModal.tsx   # Settings dialog
│   ├── lib/
│   │   ├── api.ts              # API service & streaming
│   │   └── utils.ts            # Utility functions
│   ├── stores/
│   │   ├── chatStore.ts        # Chat state (Zustand)
│   │   ├── settingsStore.ts    # Settings state
│   │   └── themeStore.ts       # Theme state
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── .env.example                # Environment variables template
├── .eslintrc.cjs              # ESLint configuration
├── .gitignore                 # Git ignore rules
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT License
├── README.md                  # Project documentation
├── index.html                 # HTML template
├── package.json               # Dependencies
├── postcss.config.js          # PostCSS config
├── tailwind.config.js         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
├── tsconfig.node.json         # Node TypeScript config
└── vite.config.ts             # Vite build config
```

## Installation Steps

### 1. Install Dependencies

Run in the project directory:

```bash
npm install
```

This will install:
- React 18.3 (UI framework)
- TypeScript 5.4 (Type safety)
- Vite 5.2 (Build tool)
- Tailwind CSS 3.4 (Styling)
- Framer Motion 11.1 (Animations)
- Zustand 4.5 (State management)
- TanStack Query 5.35 (Data fetching)
- React Markdown 9.0 (Markdown rendering)
- React Dropzone 14.2 (File uploads)
- Sonner 1.4 (Toast notifications)
- Lucide React 0.378 (Icons)
- And more...

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3000

### 3. Configure API Providers (First Run)

1. Open the app in your browser
2. Click the Settings icon (⚙️) in the top right
3. Go to "API Providers" tab
4. Add at least one provider:

**For Ollama (Local Models):**
- Provider: Ollama
- Base URL: http://localhost:11434 (default)
- No API key needed
- Make sure Ollama is running: `ollama serve`

**For OpenAI:**
- Provider: OpenAI
- API Key: Your OpenAI API key (sk-...)
- Base URL: (optional, uses default)

**For Other Providers:**
- Follow similar steps for Anthropic, Google Gemini, Groq, etc.

### 4. Start Chatting

1. Select a model from the dropdown in the top center
2. Type your message in the input area at the bottom
3. Press Enter to send (Shift+Enter for new line)
4. Enjoy real-time streaming responses!

## Features Implemented

### ✅ Core Features
- [x] Modern glassmorphism UI design
- [x] Dark mode (default) and light mode
- [x] Smooth animations and transitions
- [x] Responsive design (mobile-friendly)

### ✅ Chat Features
- [x] Multiple chat conversations
- [x] Chat history with timestamps
- [x] Pin important chats
- [x] Search chats
- [x] Rename and delete chats
- [x] Folder organization (structure ready)
- [x] Auto-save to localStorage

### ✅ Message Features
- [x] Real-time streaming responses
- [x] Markdown rendering
- [x] Code blocks with syntax highlighting
- [x] Copy, download, collapse code blocks
- [x] Math equations (LaTeX/KaTeX)
- [x] Tables and lists
- [x] Edit messages
- [x] Delete messages
- [x] Regenerate responses (UI ready)
- [x] Message timestamps

### ✅ Model Support
- [x] Ollama (local models)
- [x] OpenAI (GPT-4, GPT-3.5, etc.)
- [x] Anthropic (Claude models)
- [x] Google Gemini
- [x] Groq
- [x] OpenRouter
- [x] LM Studio
- [x] Custom OpenAI-compatible APIs
- [x] Auto-detect Ollama models
- [x] Model information display

### ✅ File Upload
- [x] Drag and drop files
- [x] Click to select files
- [x] Image preview
- [x] Multiple file attachments
- [x] File size display
- [x] Remove attachments

### ✅ Settings
- [x] Theme switcher (light/dark)
- [x] Language selection (EN/TR)
- [x] API provider management
- [x] Multiple API keys per provider
- [x] Generation parameters:
  - [x] Temperature
  - [x] Top P
  - [x] Top K
  - [x] Max Tokens
  - [x] Seed
- [x] System prompt
- [x] Streaming toggle

### ✅ UI Components
- [x] Collapsible sidebar
- [x] Model selector dropdown
- [x] Settings modal with tabs
- [x] Toast notifications
- [x] Empty state with suggestions
- [x] Loading states
- [x] Error handling

## Build Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production (output: dist/)
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## Technology Stack

- **React 18.3** - UI framework
- **TypeScript 5.4** - Type safety
- **Vite 5.2** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first CSS
- **Framer Motion 11.1** - Animation library
- **Zustand 4.5** - State management
- **TanStack Query 5.35** - Server state management
- **React Markdown 9.0** - Markdown rendering
- **Shiki** - Syntax highlighting
- **React Dropzone 14.2** - File uploads
- **Sonner 1.4** - Toast notifications
- **Lucide React** - Icon library

## API Integration

The app supports multiple AI providers through a unified streaming API interface:

### Streaming Implementation
All providers support real-time token streaming for a smooth chat experience:

```typescript
// src/lib/api.ts
async *streamCompletion(messages, model) {
  // Provider-specific streaming implementation
  // Yields chunks as they arrive
}
```

### Supported Providers
Each provider has its own streaming protocol implementation:

- **Ollama** - Local models via HTTP streaming
- **OpenAI** - Server-Sent Events (SSE)
- **Anthropic** - SSE with specific event format
- **Google Gemini** - Custom streaming format
- **Others** - OpenAI-compatible streaming

## Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy Options

1. **Vercel** (Recommended)
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Netlify**
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod
   ```

3. **Static Hosting**
   - Upload `dist/` folder to any static host
   - Configure SPA redirects (all routes → index.html)

4. **Docker**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   FROM nginx:alpine
   COPY --from=0 /app/dist /usr/share/nginx/html
   ```

## Troubleshooting

### Ollama Connection Issues
- Ensure Ollama is running: `ollama serve`
- Check base URL: http://localhost:11434
- Try pulling a model: `ollama pull llama2`

### API Key Errors
- Verify API key is correct
- Check if the key has proper permissions
- Ensure billing is set up (for paid APIs)

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Update Node.js to v18 or higher

### Streaming Not Working
- Check browser console for errors
- Verify API provider is enabled in settings
- Ensure network requests aren't blocked by firewall/proxy

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Configure API providers** in Settings
4. **Start chatting** with AI models
5. **Customize** theme, models, and settings

## Support

- 📖 Documentation: See README.md
- 🐛 Issues: Report bugs and request features
- 💬 Community: Join discussions
- 🤝 Contributing: See CONTRIBUTING.md

## License

MIT License - see LICENSE file for details

---

**Built with ❤️ using modern web technologies**

Enjoy your AI chat experience with TagUI!
