import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  
  // Magic Fix: Check if content starts with a language prefix (e.g. "js console.log")
  // This handles cases where users type ```js code``` inline without newlines
  const content = String(children)
  const langPrefixMatch = !match && /^(js|javascript|jsx|ts|tsx|python|py|css|html|bash|sh|json|sql)\s+/.exec(content)
  
  const language = match ? match[1] : (langPrefixMatch ? langPrefixMatch[1] : '')
  const displayContent = langPrefixMatch ? content.slice(langPrefixMatch[0].length) : content

  // Logic to determine if we should render as inline or block
  const isBlock = match || langPrefixMatch || (inline === false) || (content.trim().includes('\n'))

  // Inline Render
  if (!isBlock) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent.replace(/\n$/, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Block Render - with Syntax Highlighter
  return (
    <span className="group relative my-4 rounded-xl bg-gray-50 overflow-hidden block font-sans border border-gray-100 shadow-sm">
      <span className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <span className="text-xs font-bold text-gray-500 uppercase font-mono tracking-wider">
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-900"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          <span className="text-[10px] font-medium not-italic">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </span>
      <span className="block bg-white text-sm relative">
         <SyntaxHighlighter
           language={language || 'text'}
           style={oneLight}
           customStyle={{
             margin: 0,
             padding: '1.25rem',
             background: 'transparent',
             fontSize: '0.9rem',
             lineHeight: '1.6',
           }}
           wrapLongLines={true}
           {...props}
         >
           {displayContent.replace(/\n$/, '')}
         </SyntaxHighlighter>
      </span>
    </span>
  )
}
