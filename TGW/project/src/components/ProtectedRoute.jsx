import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import { auth } from '../firebase'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth methods

const ProtectedRoute = () => {
  const [user, setUser] = useState(null); // Track user authentication state
  const [loading, setLoading] = useState(true); // Track loading state
  const location = useLocation(); // Get the current location

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set the user state
      setLoading(false); // Set loading to false
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message
  }

  // Redirect to the login page if the user is not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />; // Pass the intended page
  }

  // Render the protected route if the user is authenticated
  return <Outlet />;
};

export default ProtectedRoute;