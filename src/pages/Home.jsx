import { motion } from 'framer-motion'
import { Code, Share2, Search, Zap, Layers, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const features = [
    {
      icon: <Code className="w-6 h-6 text-indigo-400" />,
      title: "Syntax Highlighting",
      desc: "Beautiful support for over 100+ languages out of the box."
    },
    {
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      title: "Smart Organization",
      desc: "Group snippets by tags, collections, or projects effortlessly."
    },
    {
      icon: <Search className="w-6 h-6 text-blue-400" />,
      title: "Instant Search",
      desc: "Find exactly what you need with lightning-fast semantic search."
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Keyboard First",
      desc: "Designed for speed with built-in shortcuts for every action."
    },
    {
      icon: <Share2 className="w-6 h-6 text-green-400" />,
      title: "Simple Sharing",
      desc: "Share your knowledge with your team or keep it private."
    },
    {
      icon: <Shield className="w-6 h-6 text-red-400" />,
      title: "Cloud Sync",
      desc: "Your snippets are safe and synced across all your devices."
    }
  ]

  return (
    <div className="relative isolate bg-white pt-14">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-100 to-purple-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* Hero Section */}
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-4xl py-24 sm:py-32 md:py-48 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center space-x-2 rounded-full px-3 py-1 text-sm font-medium leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-500/10 bg-indigo-50/50 mb-8">
              <span>KnowledgeHub v1.0 is here.</span>
              <Link to="/docs" className="flex items-center gap-1 font-semibold text-indigo-500">
                Read what's new <span aria-hidden="true">&rarr;</span>
              </Link>
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl leading-tight">
              Modern workflow for your <span className="gradient-text">code snippets</span>
            </h1>
            <div className="mt-6 text-lg leading-8 text-gray-600">
              The ultimate developer companion. Store, manage, and share your most valuable code fragments in a unified, beautiful workspace.
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/signup"
                className="rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105"
              >
                Sign up for free
              </Link>
              <Link to="/docs" className="text-lg font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition">
                Live Preview <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 sm:py-32 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 uppercase tracking-wide">Everything you need</h2>
            <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Better code management.
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col glass p-8 rounded-3xl hover:border-indigo-500/50 transition-colors group"
                >
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                    <div className="p-3 rounded-xl bg-gray-50 group-hover:bg-indigo-50 transition-colors">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <div className="flex-auto">{feature.desc}</div>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl glass px-8 py-20 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-blue-50/50 -z-10" />
             <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ready to upgrade your workflow?</h2>
             <div className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">Join thousands of developers using KnowledgeHub to build better software.</div>
             <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                <Link to="/signup" className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition">Get started now</Link>
                <Link to="/docs" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition">Contact Sales <span aria-hidden="true">→</span></Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}
