import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const DoctorProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn } = useAuth();
  
  const  {user} = useUser();
  
  // Check if the user is signed in and has a role of "doctor"
  if (!isSignedIn || user?.unsafeMetadata?.role !== "doctor") {
    // Redirect to the doctor login page if not signed in or role is not "doctor"
    return <Navigate to="/doctor/login" replace />;
  }

  // Render the protected content if conditions are met
  return <>{children}</>;
};

export default DoctorProtectedRoute;
