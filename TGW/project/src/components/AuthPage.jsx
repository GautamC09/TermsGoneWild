import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Import Firebase auth

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email and password
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Signup
        await createUserWithEmailAndPassword(auth, email, password);
      }

      // Redirect to the intended page or home page
      const from = location.state?.from || '/'; // Get the intended page or default to home
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden pattern-bg">
      {/* Abstract shape decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-md mx-auto text-center mb-12 animate-fade-in">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium text-primary bg-primary/10 rounded-full">
            {isLogin ? 'Login' : 'Sign Up'}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {isLogin ? 'Sign in to continue.' : 'Get started with TermsGoneWild.'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-field rounded-full py-4 pl-12 pr-4 text-foreground"
                required
              />
              <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-field rounded-full py-4 pl-12 pr-4 text-foreground"
                required
              />
              <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-primary/90 transition-all"
            >
              {isLogin ? 'Login' : 'Sign Up'} <ArrowRight size={16} className="ml-1 inline" />
            </button>
          </form>
          
          <div className="mt-6 text-sm text-muted-foreground">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)} className="text-primary hover:underline">
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="text-primary hover:underline">
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;