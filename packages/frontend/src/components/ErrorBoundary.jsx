/**
 * ECONEURA - Error Boundary Component
 * Enterprise-grade error handling para React
 */

import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar estado para mostrar UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error a servicio de monitoreo
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Enviar error a Application Insights (si está disponible)
    if (window.appInsights) {
      window.appInsights.trackException({
        exception: error,
        properties: {
          componentStack: errorInfo.componentStack,
          errorCount: this.state.errorCount
        }
      });
    }

    // Si hay demasiados errores, recargar la página
    if (this.state.errorCount >= 5) {
      console.error('Too many errors, reloading page...');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // UI de error personalizada
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl max-w-2xl w-full p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Algo salió mal
                </h1>
                <p className="text-slate-300 mt-1">
                  Se ha producido un error inesperado en la aplicación
                </p>
              </div>
            </div>

            {/* Error Details (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-black/30 rounded-lg border border-red-500/30">
                <h3 className="text-red-400 font-semibold mb-2">
                  Error Details (Development Only):
                </h3>
                <p className="text-sm text-red-300 font-mono mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                      Component Stack
                    </summary>
                    <pre className="text-xs text-slate-400 mt-2 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Mensaje para el usuario */}
            <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <p className="text-sm text-blue-300">
                📌 <strong>¿Qué puedes hacer?</strong>
              </p>
              <ul className="text-sm text-slate-300 mt-2 space-y-1 ml-4 list-disc">
                <li>Intenta recargar la página</li>
                <li>Vuelve a la página principal</li>
                <li>Si el problema persiste, contacta con soporte</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-5 h-5" />
                Intentar de nuevo
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-200 border border-white/20"
              >
                <Home className="w-5 h-5" />
                Ir al inicio
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-200 border border-white/20"
              >
                <RefreshCw className="w-5 h-5" />
                Recargar página
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-slate-400 text-center">
                Si el problema persiste, contacta con soporte en{' '}
                <a
                  href="mailto:support@econeura.com"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  support@econeura.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export default ErrorBoundary;


