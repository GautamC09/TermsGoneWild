import { useState } from 'react';
import { ArrowRight, Search, Shield, AlertTriangle } from 'lucide-react';
import { cn } from "../lib/utils";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [urlInput, setUrlInput] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidUrl(urlInput)) {
      setError('Please enter a valid URL.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      navigate('/results', { state: { analysisResults: data, url: urlInput } });
    } catch (error) {
      setError('Failed to analyze the URL. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden pattern-bg">
      {/* Abstract shape decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium text-primary bg-primary/10 rounded-full">
            Protect Yourself From Unfair Terms
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            Don't Sign Away Your Rights To <span className="highlight-text">Fine Print</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Our AI analyzes terms and conditions to identify unfair or harmful clauses, 
            helping you understand what you're really agreeing to.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Paste link to terms of service..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full glass-field rounded-full py-4 pl-5 pr-36 text-foreground"
              />
              <button 
                type="submit"
                className={cn(
                  "absolute right-1.5 top-1.5 rounded-full px-4 py-2.5 font-medium transition-all",
                  urlInput.trim() ? 
                    "bg-primary text-white hover:bg-primary/90" : 
                    "bg-muted text-muted-foreground"
                )}
                disabled={!urlInput.trim() || isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Analyze'} <ArrowRight size={16} className="ml-1 inline" />
              </button>
            </div>
          </form>
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield size={16} className="mr-2 text-primary" /> 
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center">
              <Search size={16} className="mr-2 text-primary" /> 
              <span>Advanced AI Analysis</span>
            </div>
            <div className="flex items-center">
              <AlertTriangle size={16} className="mr-2 text-primary" /> 
              <span>Identify Unfair Terms</span>
            </div>
          </div>
        </div>
        
        <div className="relative max-w-4xl mx-auto animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-2xl rounded-2xl transform -rotate-2 scale-105"></div>
          <div className="relative glass-card rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">Terms Analysis</div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50/50 border border-red-100 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="mr-3 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-800">Section 12.3 - Rights Waiver</h4>
                      <p className="text-sm text-red-700">This clause waives your right to join class-action lawsuits. Consider the implications before accepting.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="mr-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Section 8.1 - Data Usage</h4>
                      <p className="text-sm text-yellow-700">This service collects more personal data than typical. Review their privacy policy for details.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50/50 border border-green-100 rounded-lg">
                  <div className="flex items-start">
                    <Shield size={20} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-800">Section 5.2 - Cancellation Policy</h4>
                      <p className="text-sm text-green-700">Fair cancellation terms with 30-day money-back guarantee if service is unsatisfactory.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;