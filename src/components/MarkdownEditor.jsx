import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownEditor({ value, onChange, placeholder }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full bg-gray-50/50 border-0 rounded-none p-4 text-sm font-mono text-gray-900 focus:ring-0 outline-none resize-none"
      />
      <div className="w-full h-full bg-gray-50/50 border-0 rounded-none p-4 overflow-y-auto prose prose-sm max-w-none text-gray-900">
        {value ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
        ) : (
          <p className="text-gray-500 italic">Preview will appear here...</p>
        )}
      </div>
    </div>
  )
}
