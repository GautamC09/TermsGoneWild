import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <h2 className="text-3xl font-display font-bold mb-8">Summary</h2>
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown (optional)
              components={{
                // Customize the rendering of specific elements
                p: ({ node, ...props }) => (
                  <p className="text-sm text-muted-foreground mt-1" {...props} />
                ),
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold mt-4 mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-6 mt-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="mt-1" {...props} />
                ),
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummaryPage;