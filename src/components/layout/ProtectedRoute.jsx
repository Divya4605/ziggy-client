/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { GlobalStateContext } from "../../context/GlobalStateContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(GlobalStateContext);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
