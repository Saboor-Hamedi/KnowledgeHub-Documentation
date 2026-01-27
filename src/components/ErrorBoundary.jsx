import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-3 bg-red-50 text-red-500 rounded-full">
                <AlertTriangle size={32} />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              We're sorry, but an unexpected error occurred. The application has shut down to protect your data.
            </p>

            <div className="p-4 bg-gray-50 rounded-lg mb-6 text-left overflow-auto max-h-32 border border-gray-200">
               <code className="text-xs text-gray-600 font-mono break-all">
                 {this.state.error?.toString() || "Unknown Error"}
               </code>
            </div>

            <button
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
            
            <p className="mt-6 text-xs text-gray-400">
              If this persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
