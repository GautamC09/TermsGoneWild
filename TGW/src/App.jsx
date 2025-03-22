import React, { useState } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, FileText, Globe, Loader2 } from 'lucide-react';

function App() {
  const [inputType, setInputType] = useState('url');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post('http://localhost:5000/analyze', {
        [inputType]: input
      });
      setResults(response.data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the terms');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms & Conditions Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze Terms & Conditions for potential privacy issues, financial concerns, 
            legal risks, and unfair terms using advanced AI.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setInputType('url')}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  inputType === 'url' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Globe className="h-5 w-5 mr-2" />
                URL
              </button>
              <button
                type="button"
                onClick={() => setInputType('text')}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  inputType === 'text' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                Direct Text
              </button>
            </div>

            <div>
              {inputType === 'url' ? (
                <input
                  type="url"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter the URL of the Terms & Conditions page"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              ) : (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste the Terms & Conditions text here"
                  className="w-full h-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Analyzing...
                </>
              ) : (
                'Analyze Terms'
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex-grow">
                    {result.Clause}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result['Risk Level'])}`}>
                    {result['Risk Level']} Risk
                  </span>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Concern:</span> {result.Concern}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Explanation:</span> {result.Explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;