import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, X } from 'lucide-react';

const ResultsPage = () => {
  const [clauses, setClauses] = useState([]);
  const [filters, setFilters] = useState({
    concern: '',
    riskLevel: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const url = location.state?.url;
  const navigate = useNavigate();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (url && !hasFetched.current) {
      hasFetched.current = true;
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }

          const data = await response.json();
          setClauses(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [url]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSummaryClick = async () => {
    try {
      // First, get the analysis results
      const analysisResponse = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
  
      if (!analysisResponse.ok) {
        throw new Error('Failed to fetch analysis results');
      }
  
      const analysisResults = await analysisResponse.json();
  
      // Then, generate the summary
      const summaryResponse = await fetch('http://localhost:5000/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysis_results: analysisResults }),
      });
  
      if (!summaryResponse.ok) {
        throw new Error('Failed to generate summary');
      }
  
      const summaryData = await summaryResponse.json();
  
      // Navigate to the summary page with the summary data
      navigate('/summary', { state: { summary: summaryData } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredClauses = clauses.filter(clause => {
    return (
      (filters.concern === '' || clause.Concern === filters.concern) &&
      (filters.riskLevel === '' || clause['Risk Level'] === filters.riskLevel)
    );
  });

  if (loading) {
    return <div className="py-24 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="py-24 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold">Analysis Results</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <select
                name="concern"
                value={filters.concern}
                onChange={handleFilterChange}
                className="appearance-none bg-white border border-gray-200 rounded-full py-2 pl-4 pr-8 text-sm text-muted-foreground focus:outline-none focus:border-blue-500"
              >
                <option value="">All Concerns</option>
                <option value="legal">Legal</option>
                <option value="financial">Financial</option>
                <option value="privacy">Privacy</option>
              </select>
              <Filter className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select
                name="riskLevel"
                value={filters.riskLevel}
                onChange={handleFilterChange}
                className="appearance-none bg-white border border-gray-200 rounded-full py-2 pl-4 pr-8 text-sm text-muted-foreground focus:outline-none focus:border-blue-500"
              >
                <option value="">All Risk Levels</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <Filter className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <button
              onClick={handleSummaryClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
            >
              View Summary
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {filteredClauses.map((clause, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  clause['Risk Level'] === 'Low' ? 'bg-green-400' :
                  clause['Risk Level'] === 'Medium' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`}></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{clause.Clause}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">Concern:</span> {clause.Concern} |{' '}
                    <span className="font-medium">Risk Level:</span> {clause['Risk Level']}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">{clause.Explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsPage;