import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const PatientProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn } = useAuth();
  const {user} = useUser();

  if (!isSignedIn || user?.unsafeMetadata?.role !== "patient") {
    // Redirect to the login page if not signed in
    return <Navigate to="/patient/login" replace />;
  }

  // Render the protected content if signed in
  return <>{children}</>;
};

export default PatientProtectedRoute;
