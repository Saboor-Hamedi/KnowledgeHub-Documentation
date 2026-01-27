import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export default function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''

  if (inline) {
    return (
      <code className={`${className} bg-gray-100 text-gray-800 rounded px-1 py-0.5 text-sm font-mono`} {...props}>
        {children}
      </code>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-4 rounded-xl bg-gray-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-100/50">
        <span className="text-xs font-medium text-gray-500 uppercase font-mono not-italic">
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
      </div>
      <div className="overflow-x-auto p-4 bg-white/50">
        <code className={`${className} !bg-transparent !p-0 text-sm font-mono text-gray-800 leading-relaxed block not-italic`} {...props}>
          {children}
        </code>
      </div>
    </div>
  )
}
