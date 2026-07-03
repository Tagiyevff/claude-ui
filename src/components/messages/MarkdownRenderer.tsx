import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import CodeBlock from './CodeBlock'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''
          const code = String(children).replace(/\n$/, '')

          if (!inline && code) {
            return <CodeBlock code={code} language={language} />
          }

          return (
            <code
              className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-800 text-sm font-mono text-pink-600 dark:text-pink-400"
              {...props}
            >
              {children}
            </code>
          )
        },
        a({ node, children, href, ...props }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              {...props}
            >
              {children}
            </a>
          )
        },
        table({ node, children, ...props }) {
          return (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props}>
                {children}
              </table>
            </div>
          )
        },
        th({ node, children, ...props }) {
          return (
            <th
              className="px-4 py-2 text-left text-sm font-semibold bg-gray-100 dark:bg-dark-800"
              {...props}
            >
              {children}
            </th>
          )
        },
        td({ node, children, ...props }) {
          return (
            <td className="px-4 py-2 text-sm border-t border-gray-200 dark:border-gray-700" {...props}>
              {children}
            </td>
          )
        },
        blockquote({ node, children, ...props }) {
          return (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300"
              {...props}
            >
              {children}
            </blockquote>
          )
        },
        ul({ node, children, ...props }) {
          return (
            <ul className="list-disc list-inside my-2 space-y-1" {...props}>
              {children}
            </ul>
          )
        },
        ol({ node, children, ...props }) {
          return (
            <ol className="list-decimal list-inside my-2 space-y-1" {...props}>
              {children}
            </ol>
          )
        },
        h1({ node, children, ...props }) {
          return (
            <h1 className="text-3xl font-bold mt-6 mb-4" {...props}>
              {children}
            </h1>
          )
        },
        h2({ node, children, ...props }) {
          return (
            <h2 className="text-2xl font-bold mt-5 mb-3" {...props}>
              {children}
            </h2>
          )
        },
        h3({ node, children, ...props }) {
          return (
            <h3 className="text-xl font-bold mt-4 mb-2" {...props}>
              {children}
            </h3>
          )
        },
        h4({ node, children, ...props }) {
          return (
            <h4 className="text-lg font-semibold mt-3 mb-2" {...props}>
              {children}
            </h4>
          )
        },
        p({ node, children, ...props }) {
          return (
            <p className="my-2 leading-relaxed" {...props}>
              {children}
            </p>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
