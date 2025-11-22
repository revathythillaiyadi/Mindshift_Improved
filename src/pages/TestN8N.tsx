import { useState } from 'react';
import { testN8NConnection, N8N_WEBHOOK_URL } from '../lib/n8n';

export default function TestN8N() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleTest = async () => {
    setStatus('testing');
    setError('');
    setResult(null);

    try {
      const testResult = await testN8NConnection();
      
      if (testResult.success) {
        setStatus('success');
        setResult(testResult);
      } else {
        setStatus('error');
        setError(testResult.message);
        setResult(testResult.details);
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Unknown error');
    }
  };

  const envVarUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  const isUsingEnvVar = !!envVarUrl;
  const currentUrl = N8N_WEBHOOK_URL;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50/30 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-[#187E5F] mb-6">🔍 n8n Connection Test</h1>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-3">ℹ️ Configuration Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <strong className="text-blue-800 min-w-[180px]">Webhook URL:</strong>
                <code className="text-blue-600 break-all">{currentUrl}</code>
              </div>
              <div className="flex items-start gap-2">
                <strong className="text-blue-800 min-w-[180px]">Using Env Variable:</strong>
                <span className={isUsingEnvVar ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                  {isUsingEnvVar ? 'Yes ✅' : 'No (using default)'}
                </span>
              </div>
              {isUsingEnvVar && (
                <div className="flex items-start gap-2">
                  <strong className="text-blue-800 min-w-[180px]">Env Var Value:</strong>
                  <code className="text-blue-600 break-all text-xs">{envVarUrl}</code>
                </div>
              )}
              <div className="flex items-start gap-2">
                <strong className="text-blue-800 min-w-[180px]">Environment Mode:</strong>
                <span className="text-gray-600">{import.meta.env.MODE || 'unknown'}</span>
              </div>
            </div>
          </div>

          {/* Warning if env var looks wrong */}
          {isUsingEnvVar && !envVarUrl.startsWith('http') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Warning: Invalid Webhook URL</h3>
              <p className="text-sm text-yellow-800 mb-2">
                Your <code>VITE_N8N_WEBHOOK_URL</code> environment variable doesn't look like a valid webhook URL.
              </p>
              <p className="text-sm text-yellow-800 mb-2">
                It should start with <code>https://</code> and look like:
              </p>
              <code className="text-xs bg-yellow-100 p-2 rounded block">
                VITE_N8N_WEBHOOK_URL=https://trevathy.app.n8n.cloud/webhook/dbb33ceb-ed53-4dc1-8781-4d2786571d68
              </code>
              <p className="text-sm text-yellow-800 mt-2">
                If you have an n8n API token, that's different from a webhook URL. Webhook URLs are the endpoints that receive POST requests.
              </p>
            </div>
          )}

          {/* Test Button */}
          <button
            onClick={handleTest}
            disabled={status === 'testing'}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
              status === 'testing'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#187E5F] hover:bg-[#0B5844] text-white hover:shadow-lg'
            }`}
          >
            {status === 'testing' ? '⏳ Testing Connection...' : '🚀 Test n8n Connection'}
          </button>

          {/* Status Display */}
          {status === 'testing' && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                <span className="text-yellow-800 font-medium">Testing connection...</span>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ Connection Successful!</h3>
              <p className="text-sm text-green-800 mb-3">{result?.message}</p>
              {result?.details && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-green-800">
                    View Details
                  </summary>
                  <pre className="mt-2 text-xs bg-green-100 p-3 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">❌ Connection Failed</h3>
              <p className="text-sm text-red-800 mb-3">{error}</p>
              
              {error.includes('404') || error.includes('not active') ? (
                <div className="bg-red-100 border border-red-300 rounded p-3 mt-3">
                  <h4 className="font-semibold text-red-900 mb-2">💡 Solution:</h4>
                  <ol className="list-decimal list-inside text-sm text-red-800 space-y-1">
                    <li>Go to <a href="https://trevathy.app.n8n.cloud" target="_blank" rel="noopener noreferrer" className="underline">n8n dashboard</a></li>
                    <li>Open your workflow in the editor</li>
                    <li>Toggle the workflow to <strong>ACTIVE</strong> (top-right switch)</li>
                    <li>Run this test again</li>
                  </ol>
                </div>
              ) : error.includes('timeout') ? (
                <div className="bg-red-100 border border-red-300 rounded p-3 mt-3">
                  <p className="text-sm text-red-800">
                    The request took too long. Your n8n workflow might be slow or timing out.
                  </p>
                </div>
              ) : null}

              {result && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-red-800">
                    View Error Details
                  </summary>
                  <pre className="mt-2 text-xs bg-red-100 p-3 rounded overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-3">📋 Instructions</h2>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
              <li>Make sure your n8n workflow is <strong>ACTIVE</strong> in the n8n dashboard</li>
              <li>Click the "Test n8n Connection" button above</li>
              <li>Check the results - you should see a success message if connected</li>
              <li>If you get a 404 error, activate your workflow in n8n first</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

