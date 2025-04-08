import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorLogin from "./components/auth/doctor/DoctorLogin";
import PatientLogin from "./components/auth/patient/PatientLogin";
import DoctorSignup from "./components/auth/doctor/DoctorSignup";
import PatientSignup from "./components/auth/patient/PatientSignup";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import PatientDashboard from "./components/dashboard/patient/PatientDashboard.tsx";
import PatientProfile from "./components/profile/PatientProfile.tsx";
import ScheduleAppointment from "./components/appointment/patient/schedule/ScheduleAppointment.tsx";
import CurrentAppointments from "./components/appointment/patient/current/CurrentAppointment.tsx";
import DoctorDashboard from "./components/dashboard/doctor/DoctorDashboard.tsx";
import DoctorProfile from "./components/profile/DoctorProfile.tsx";
import DoctorAppointments from "./components/appointment/doctor/DoctorAppointments.tsx";
import PatientHistory from "./components/history/PatientHistory.tsx";
import DoctorHistoryPage from "./components/history/DoctorHistory.tsx";
import PatientChat from "./components/chat/PatientChat.tsx";
import DoctorChat from "./components/chat/DoctorChat.tsx";
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:5000');


const clerkApiKey = import.meta.env.VITE_CLERK_FRONTEND_API;

const App: React.FC = () => {
  
  return (
    
    <ClerkProvider publishableKey={clerkApiKey}>
      
      <Router>
        <Routes>
          
          <Route
            path="/doctor/login"
            element={
              <SignedOut>
                <DoctorLogin />
                </SignedOut>
            }
          />
          <Route
            path="/doctor/signup"
            element={
              <SignedOut>
                <DoctorSignup />
                </SignedOut>
            }
          />
          <Route
            path="/patient/login"
            element={
              <SignedOut>
                <PatientLogin />
                </SignedOut>
            }
          />
          <Route
            path="/patient/signup"
            element={
              <SignedOut>
                <PatientSignup />
                </SignedOut>
            }
          />

          <Route
            path="/patient/dashboard"
            element={
              
              <SignedIn>  
                
                <PatientDashboard />
              
                </SignedIn>
           
           
            }
          />
          <Route
            path="/doctor/dashboard"
            element={
              <SignedIn>  
                <DoctorDashboard />
                </SignedIn>  
            }
          />
          <Route
            path="/patient/profile"
            element={
           
              <SignedIn>  
                <PatientProfile />
                </SignedIn>  
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <SignedIn>  
                <DoctorProfile />
                </SignedIn>  
            }
          />
          <Route
            path="/patient/appointment"
            element={
              <SignedIn>  
                <ScheduleAppointment />
                </SignedIn>  
           
            
            }
          />
          <Route
            path="/patient/currentAppointment"
            element={
              <SignedIn>  
                <CurrentAppointments />
                </SignedIn>  
            }
          />
          <Route
            path="/doctor/appointment"
            element={
              <SignedIn>  
                <DoctorAppointments />
                </SignedIn>  
            }
          />
           <Route
            path="/patient/history"
            element={
              <SignedIn>  
                <PatientHistory />
                </SignedIn>  
            }
          />
          <Route
            path="/doctor/history"
            element={
              <SignedIn>  
                <DoctorHistoryPage />
                </SignedIn>  
            }
          />
          <Route
            path="/doctor/chat"
            element={
              <SignedIn>  
                <DoctorChat />
                </SignedIn>  
            }
          />
          <Route
            path="/patient/chat"
            element={
              <SignedIn>  
                <PatientChat />
                </SignedIn>  
            }
          />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};

export default App;
