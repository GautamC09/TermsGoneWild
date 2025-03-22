import { useLocation } from 'react-router-dom';

const SummaryPage = () => {
  const location = useLocation();
  const summary = location.state?.summary;

  if (!summary) {
    return <div className="py-24 text-center">No summary data available.</div>;
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-display font-bold mb-8">Summary</h2>
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Concerns Breakdown</h3>
            {Object.entries(summary.summary.concerns).map(([concern, data], index) => (
              <div key={index} className="mt-4">
                <h4 className="text-md font-semibold text-gray-700">{concern}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">Count:</span> {data.count}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">Risk Levels:</span> Low: {data.risk_levels.Low}, Medium: {data.risk_levels.Medium}, High: {data.risk_levels.High}
                </p>
              </div>
            ))}
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Total Clauses</h3>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-medium">Total:</span> {summary.summary.total_clauses}
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Notable Patterns</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {summary.summary.notable_patterns}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummaryPage;