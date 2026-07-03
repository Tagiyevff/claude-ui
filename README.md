# Claude UI 🤖✨

A premium, modern AI chat interface inspired by Anthropic's Claude.ai design, built from the ground up with **React**, **TypeScript**, and **Tailwind CSS**. It connects seamlessly to multiple LLM backends including Ollama (local), Anthropic, OpenAI, Google Gemini, Groq, OpenRouter, and more.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Tagiyevff/claude-ui)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎨 Key Features

### 💻 Claude-Style Aesthetics & UX
- **Beautiful Glassmorphism:** Clean, modern interface with blur effects, premium typography, and curated color palettes.
- **Dynamic Greeting & Modes:** Auto-adapts greetings based on your local time. Supports both **Dark Mode** (default) and **Light Mode**.
- **Micro-Animations:** Fluid layout shifts and smooth interactive states powered by **Framer Motion**.
- **Responsive Layout:** Pixel-perfect layout from desktop monitors to mobile screens.

### 🤖 Multi-Provider LLM Integration
- **Ollama (Local):** Automatically detects running local Ollama instances (`http://localhost:11434`) and loads your offline models.
- **Anthropic:** Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku, and more.
- **OpenAI:** GPT-4o, GPT-4, GPT-3.5-Turbo, and compatible endpoints.
- **Google Gemini:** Gemini Pro and Gemini Flash.
- **Groq & OpenRouter:** High-speed inference and access to hundreds of open-source models.
- **LM Studio / Custom APIs:** Compatible with any OpenAI-compatible API base.

### 💬 Complete Chat & File Management
- **Rich Conversations:** Keep multiple chats, search history, pin important threads, or organize conversations in folders.
- **File Uploads:** Drag-and-drop interface for attaching files (images, PDFs, documents) using React Dropzone.
- **Advanced Markdown:** Fully supports headers, tables, code blocks, syntax highlighting (powered by Shiki), LaTeX mathematics (via KaTeX), and diagrams (via Mermaid).
- **Export Formats:** Download chats as Markdown, JSON, TXT, or PDF.
- **Generation Controls:** Fine-tune temperature, max tokens, top-p, and set customized system prompts.

### 🔒 Privacy First
- **Secure Local Storage:** API keys are stored securely inside your browser's `localStorage` and sent directly to the respective providers. No middle-man backend servers.

---

## 📂 Project Structure

```text
claude-ui/
├── public/                 # Static assets & icons
└── src/
    ├── components/
    │   ├── chat/           # Main Chat view & welcome screens
    │   ├── layout/         # Header, Sidebar, and App Layout
    │   ├── messages/       # Message bubbles, CodeBlock, & Markdown rendering
    │   ├── models/         # Model Selector dropdown
    │   ├── settings/       # Settings modal (API, Model, & General panels)
    │   └── ui/             # Reusable Claude-style UI inputs & demos
    ├── lib/
    │   ├── api.ts          # Core API client & streaming logic
    │   └── utils.ts        # Helper utilities
    ├── stores/
    │   ├── chatStore.ts    # Chat conversation state (Zustand)
    │   ├── settingsStore.ts# API keys & model preference state
    │   └── themeStore.ts   # Dark/Light theme state
    ├── types/
    │   └── index.ts        # TypeScript typings
    ├── App.tsx             # Application router & setup
    ├── main.tsx            # React entry point
    └── index.css           # Global CSS variables & Tailwind directives
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or newer
- **npm**, **yarn**, or **pnpm** package manager
- (Optional) **Ollama** installed locally for offline model support

### 1. Installation
Clone the repository and install the project dependencies:
```bash
git clone https://github.com/Tagiyevff/claude-ui.git
cd claude-ui
npm install
```

### 2. Configure Environment (Optional)
If you want to pre-configure API keys or custom base URLs, copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```
*(Note: You can also configure all keys and custom URLs directly inside the application's Settings panel in the browser.)*

### 3. Run the Development Server
```bash
npm run dev
```
The application will launch locally at `http://localhost:3000` (or the next available port).

---

## 🛠️ Configuration & Customization

### Local Ollama Setup
1. Download and run Ollama from [ollama.ai](https://ollama.ai).
2. Download a model of your choice in your terminal:
   ```bash
   ollama pull llama3
   ```
3. Start the Claude UI app. It will auto-detect your local Ollama server running at `http://localhost:11434`.

### Building for Production
To bundle and optimize the project for static hosting:
```bash
npm run build
```
Preview the built version locally:
```bash
npm run preview
```

---

## 📦 Tech Stack

- **Core:** React (v18.3) & TypeScript
- **Bundler:** Vite (v5.2)
- **Styling:** Tailwind CSS (v3.4) & PostCSS
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Markdown & Renderers:** React Markdown, Rehype Raw, Remark GFM, Shiki, KaTeX, Mermaid
- **Toasts:** Sonner

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit Pull Requests to help improve the project.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Created with ❤️ by the Claude UI community. Explore the repository at [github.com/Tagiyevff/claude-ui](https://github.com/Tagiyevff/claude-ui).*
