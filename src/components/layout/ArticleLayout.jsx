import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Calendar, User, Edit3, Trash2 } from 'lucide-react'
import CodeBlock from '../../components/ui/CodeBlock'

export default function ArticleLayout({ 
  post, 
  user, 
  onEdit, 
  onDelete, 
  className = "" 
}) {
  if (!post) return null

  return (
    <article className={`group relative ${className}`}>
      {/* Metadata */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} />
          {new Date(post.created_at).toLocaleDateString()}
        </span>
        <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
        <span className="flex items-center gap-1.5">
          <User size={12} /> {post.profiles?.username || "Admin"}
        </span>
      </div>

      {/* Action Buttons */}
      {user && (
        <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={() => onEdit(post)}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            title="Edit this post"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
            title="Delete this post"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* Title */}
      <div className="w-full px-4 sm:px-0">
        <h1
          className="text-3xl sm:text-md lg:text-3xl font-bold tracking-tight text-gray-900 mb-3 leading-normal break-words hyphens-auto 
                w-full sm:max-w-[calc(100%-0rem)] mx-auto"
        >
          {post.title}
        </h1>
      </div>

      {/* Content */}
      <div className="prose max-w-none text-gray-700 prose-lg prose-headings:text-gray-900 prose-a:text-indigo-600 prose-strong:text-gray-900 prose-pre:bg-white prose-pre:border prose-pre:border-gray-100">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            pre: ({ children }) => children,
            code: CodeBlock,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
