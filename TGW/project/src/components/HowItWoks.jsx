const HowItWorksPage = () => {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Paste the Link</h3>
                <p className="text-muted-foreground">
                  Simply paste the link to the terms and conditions or privacy policy you want to analyze. Our system will process the document in seconds.
                </p>
              </div>
            </div>
  
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our advanced AI scans the document to identify potentially harmful or unfair clauses. It highlights key sections and explains them in plain language.
                </p>
              </div>
            </div>
  
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Review the Results</h3>
                <p className="text-muted-foreground">
                  Review the analysis results to understand what you're agreeing to. Our system categorizes clauses by concern (e.g., legal, financial, privacy) and risk level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default HowItWorksPage;