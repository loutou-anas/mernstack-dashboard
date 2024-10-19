import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);

  if (!user || user.role !== 'admin') {
    // If the user is not logged in or not an admin, redirect to home page
    return <Navigate to="/" />;
  }

  // If the user is an admin, allow access to the protected route
  return children;
};

// PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
