// src/components/PrivateRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const { isLoggedIn } = useAppContext();
  const location = useLocation();

  return isLoggedIn ? (
    element
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
