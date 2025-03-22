import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon

const SummaryPage = () => {
  const location = useLocation();
  const { summary, url } = location.state || { summary: '', url: '' };
  const navigate = useNavigate();

  if (!summary) {
    return <div className="py-24 text-center">No summary data available.</div>;
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <h2 className="text-3xl font-display font-bold mb-8">Summary</h2>
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Summary Report</h3>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummaryPage;