import { Route, Navigate } from "react-router-dom";
import {useAuthUser} from 'react-auth-kit'

function PrivateRoute({ element, ...rest }) {
  const { isAuthenticated } = useAuthUser();

  return isAuthenticated() ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default PrivateRoute;