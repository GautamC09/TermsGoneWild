import { Shield, Search, FileText, Check } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Protective Analysis",
      description: "Our AI identifies potentially harmful clauses that could compromise your rights or privacy."
    },
    {
      icon: <Search className="h-8 w-8 text-blue-500" />,
      title: "Deep Term Scanning",
      description: "We scan thousands of lines of legal text in seconds to find the clauses other readers might miss."
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      title: "Plain Language Translation",
      description: "Complex legal jargon is translated into simple language anyone can understand."
    }
  ];

  const benefitsList = [
    "Protects you from unfair arbitration clauses",
    "Identifies hidden automatic renewals",
    "Flags concerning data collection practices",
    "Highlights liability waivers and limitations",
    "Detects unilateral terms changes",
    "Reveals rights you may be giving away"
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-white">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-white"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium text-primary bg-primary/10 rounded-full">
            Why Choose TermsGoneWild
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Don't Let Fine Print Cost You
          </h2>
          <p className="text-lg text-muted-foreground">
            Our advanced AI tools analyze terms and conditions, user agreements, and privacy policies 
            to reveal what companies might be hiding in plain sight.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="rounded-full bg-blue-50 p-3 w-fit mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="smooth-gradient border border-gray-100 rounded-2xl p-8 shadow-sm">
              <div className="space-y-5">
                {benefitsList.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-3 mt-1 bg-blue-50 rounded-full p-1">
                      <Check className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div>
              <h3 className="text-2xl font-display font-bold mb-4">
                Knowledge is Your Best Protection
              </h3>
              <p className="text-muted-foreground mb-6">
                Most people agree to terms without reading them, exposing themselves to unfair clauses 
                and potential risks. TermsGoneWild changes that by making complex agreements 
                accessible and understandable.
              </p>
              <p className="text-muted-foreground">
                Our technology has analyzed thousands of terms and conditions documents, 
                building an extensive knowledge base of patterns that indicate potentially 
                problematic terms.
              </p>
            </div>
            
            <div className="flex items-center pt-4">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                73%
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">
                  of users discover concerning terms they would have otherwise agreed to
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;