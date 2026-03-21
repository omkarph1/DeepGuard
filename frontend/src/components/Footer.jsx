import { Link } from 'react-router-dom'
import { Shield, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t transition-colors duration-300
                       bg-white dark:bg-bg-dark border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary-light dark:text-primary" />
              <span className="text-lg font-bold text-slate-800 dark:text-white">
                Deep<span className="gradient-text">Guard</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              AI-powered deepfake detection using a 3-model ensemble trained on 343K+ images from 17 curated sources.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/detect', label: 'Detect' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-light dark:hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wider">
              Technology
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>ConvNeXt V2</li>
              <li>XceptionNet v3</li>
              <li>ResNeXt50-BiLSTM</li>
              <li>MTCNN Face Detection</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-light dark:hover:text-primary transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 DeepGuard v2. For research purposes only.
          </p>
        </div>
      </div>
    </footer>
  )
}
