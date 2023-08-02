import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { DataContext } from "./TheContext";

function PrivateRoute({ element }) {
  const { fakeAuthService } = useContext(DataContext);

  if (!fakeAuthService.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="position-relative" style={{ height: "max-content" }}>
      <Outlet />
    </div>
  );
}

export default PrivateRoute;
