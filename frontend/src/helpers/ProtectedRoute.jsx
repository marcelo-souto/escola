import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function ProtectedRoute({ children }) {
  
	const { loggedIn } = React.useContext(UserContext);

	return loggedIn ? children : <Navigate to='/login' />;
}

export default ProtectedRoute;
