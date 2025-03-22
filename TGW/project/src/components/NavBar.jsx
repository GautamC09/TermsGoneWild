import { useState, useEffect } from 'react';
import { cn } from "../lib/utils";
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase auth
import { signOut, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth methods

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Track user authentication state
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // User is logged in
      } else {
        setUser(null); // User is logged out
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate('/'); // Redirect to the home page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
            {['Features', 'How it Works' ].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                {item}
              </Link>
            ))}
            {user ? (
              // Show Logout button if user is logged in
              <button
                onClick={handleLogout}
                className="bg-primary/10 hover:bg-primary/15 text-primary font-medium px-4 py-2 rounded-full transition-all"
              >
                Logout
              </button>
            ) : (
              // Show Login button if user is logged out
              <Link
                to="/auth"
                className="bg-primary/10 hover:bg-primary/15 text-primary font-medium px-4 py-2 rounded-full transition-all"
              >
                Login
              </Link>
            )}
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
            {['Features', 'How it Works'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            {user ? (
              // Show Logout button if user is logged in
              <button
                onClick={handleLogout}
                className="bg-primary/10 hover:bg-primary/15 text-primary font-medium px-4 py-2 rounded-full transition-all w-full text-center"
              >
                Logout
              </button>
            ) : (
              // Show Login button if user is logged out
              <Link
                to="/auth"
                className="bg-primary/10 hover:bg-primary/15 text-primary font-medium px-4 py-2 rounded-full transition-all w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;