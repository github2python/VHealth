import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const PatientLogin: React.FC = () => {
  const { signIn } = useSignIn();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error state before attempting login

    try {
      const signInResult = await signIn.create({
        identifier: email,
        password,
      });
      
      if (signInResult.createdSessionId) {
        const userRole = signInResult.session?.user?.unsafeMetadata?.role;
        

       
        // Add console.log to debug
        console.log("User Role:", userRole);
        console.log("Sign In Result:", signInResult);

        // Validate role from publicMetadata or unsafeMetadata
        
          navigate("/patient/dashboard"); // Use navigate instead of window.location
        
      } else {
        throw new Error("Unable to create session.");
      }
    } catch (err: any) {
      console.error("Login Error:", err); // Add error logging
      setError(err.errors?.[0]?.message || err.message || "Something went wrong");
    }
};

  return (
    <div className="flex items-center justify-center h-screen bg-green-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Patient Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          {error && <p className="text-red-500 text-sm">Invalid Credentials</p>}
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <a href="/patient/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default PatientLogin;