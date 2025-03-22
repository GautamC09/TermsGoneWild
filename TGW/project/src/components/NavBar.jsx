import { useState, useEffect } from 'react';
import { cn } from "../lib/utils";
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
      isScrolled ? "bg-white/70 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
           TermsGoneWild
          </span>
        </Link>
          
        <nav className="hidden md:flex items-center space-x-8">
          {['Features', 'How it Works', 'Testimonials'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              {item}
            </Link>
          ))}
          <button className="bg-primary/10 hover:bg-primary/15 text-primary font-medium px-4 py-2 rounded-full transition-all">
            Sign Up
          </button>
        </nav>
          
          <button 
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-slide-down">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            {['Features', 'How it Works', 'Testimonials'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <button className="bg-primary/10 hover:bg-primary/15 text-primary font-medium px-4 py-2 rounded-full transition-all w-full text-center">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;