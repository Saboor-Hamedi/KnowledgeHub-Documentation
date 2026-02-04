import React from 'react'

export default function SidebarLayout({ sidebar, children, variant = 'docs' }) {
  const isBlog = variant === 'blog'
  
  // Layout configuration based on variant
  // Blog: Wider sidebar (72/18rem), larger margin (80/20rem), more padding right in sidebar
  // Docs: Standard sidebar (64/16rem), standard margin (72/18rem)
  
  const sidebarClasses = isBlog 
    ? "w-72 pr-8"  // Blog specific
    : "w-64 pr-6"  // Docs specific
    
  const mainClasses = isBlog
    ? "lg:ml-80"   // Blog specific
    : "lg:ml-72"   // Docs specific

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex pt-12 pb-24 border-border">
        {/* Sidebar */}
        <aside className={`hidden lg:block fixed top-20 bottom-0 overflow-y-auto py-4 z-40 ${sidebarClasses}`}>
          {sidebar}
        </aside>

        {/* Main Content */}
        <main className={`flex-1 min-w-0 px-4 sm:px-6 lg:px-8 lg:pr-12 min-h-[80vh] ${mainClasses}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
