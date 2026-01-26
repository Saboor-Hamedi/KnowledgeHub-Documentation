export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-white text-gray-900 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center sm:text-left">
        <div className="max-w-3xl mx-auto sm:ml-0">
          <span className="inline-block rounded-full bg-indigo-50 px-4 py-1 text-sm text-indigo-600 font-medium">
            Built for developers
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl text-gray-900 leading-tight">
            Store, organize, and reuse
            <span className="block text-indigo-600">
              code snippets effortlessly
            </span>
          </h1>

          <div className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto sm:ml-0">
            Dev Snippet is your personal knowledge base for code. Save snippets,
            tag them, and access everything instantly — without context
            switching.
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <a
              href="#get-started"
              className="rounded-xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white hover:bg-indigo-500 transition shadow-xl shadow-indigo-500/20"
            >
              Get Started
            </a>

            <a
              href="#docs"
              className="rounded-xl border border-gray-200 bg-white px-8 py-4 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              View Docs
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-indigo-50 via-transparent to-transparent opacity-50" />
    </section>
  );
}
