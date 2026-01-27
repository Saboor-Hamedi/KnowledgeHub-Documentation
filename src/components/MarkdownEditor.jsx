import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Eye, Edit3, Columns } from 'lucide-react'
import CodeBlock from './ui/CodeBlock'

export default function MarkdownEditor({ value, onChange, placeholder }) {
  const [view, setView] = useState('write') // 'write', 'preview', 'split'

  return (
    <div className="flex flex-col h-[500px]">
      {/* Toolbar */}
      <div className="flex items-center gap-1 py-2 border-b border-gray-100">
        <button
          onClick={() => setView('write')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            view === 'write' 
              ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' 
              : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'
          }`}
        >
          <Edit3 size={14} />
          <span>Write</span>
        </button>
        <button
          onClick={() => setView('preview')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            view === 'preview' 
              ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' 
              : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'
          }`}
        >
          <Eye size={14} />
          <span>Preview</span>
        </button>
        <div className="hidden md:block w-px h-4 bg-gray-200 mx-1" />
        <button
          onClick={() => setView('split')}
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            view === 'split' 
              ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' 
              : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'
          }`}
        >
          <Columns size={14} />
          <span>Split</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="relative flex-1 min-h-0 bg-white">
        {/* Write Mode */}
        <div className={`${view === 'write' ? 'block' : 'hidden'} h-full`}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 resize-none focus:ring-0 border-0 outline-none text-sm font-mono text-gray-800 leading-relaxed custom-scrollbar"
            spellCheck="false"
          />
        </div>

        {/* Preview Mode */}
        <div className={`${view === 'preview' ? 'block' : 'hidden'} h-full overflow-y-auto custom-scrollbar`}>
          <div className="p-6 prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-indigo-600 prose-pre:bg-transparent prose-pre:p-0">
            {value ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  pre: ({children}) => children,
                  code: CodeBlock
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                <Eye size={48} className="mb-2" />
                <p>Preview will appear here...</p>
              </div>
            )}
          </div>
        </div>

        {/* Split Mode */}
        <div className={`${view === 'split' ? 'grid' : 'hidden'} grid-cols-2 h-full divide-x divide-gray-100`}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 resize-none focus:ring-0 border-0 outline-none text-sm font-mono text-gray-800 leading-relaxed bg-gray-50/10 custom-scrollbar"
            spellCheck="false"
          />
          <div className="h-full overflow-y-auto custom-scrollbar bg-white">
             <div className="p-6 prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-indigo-600 prose-pre:bg-transparent prose-pre:p-0">
                {value ? (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      pre: ({children}) => children,
                      code: CodeBlock
                    }}
                  >
                    {value}
                  </ReactMarkdown>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                    <Eye size={32} className="mb-2" />
                    <p className="text-xs">Preview</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
