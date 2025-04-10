import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formFields } from "./formFields.ts";
import { FormInput } from "./FormInput";

const PatientSignup: React.FC = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [error, setError] = useState<string>("");
  const [ setLoading] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    if (!isLoaded) return; // Ensure Clerk is loaded before proceeding
    setLoading(true); // Show loading state

    try {
      console.log(formData);

      // Create user with Clerk and add role metadata
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        unsafeMetadata: {
          role: "patient", // Add the role metadata
        },
        firstName: formData.name,
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Set 'verifying' true to display the second form
      setVerifying(true);
    } catch (err: any) {
      setError(err.response?.data?.error || err.errors?.[0]?.message || "Something went wrong");
      setLoading(false); // Hide loading state on error
    }
  };

  // Handle the submission of the verification form
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      // Verify the code entered by the user
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification is successful, set the session to active and redirect
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        // Make Axios request to create user in the database
      await axios.post("http://localhost:5000/patient/signup", {
        email: formData.email,
        name: formData.name,
      });
        navigate("/patient/dashboard"); // Redirect to the patient's dashboard
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      setError("Verification failed. Please try again.");
    }
  };

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
            Verify Your Email
          </h2>
          <form onSubmit={handleVerify} className="space-y-4">
            <label htmlFor="code" className="text-sm font-semibold">
              Enter the verification code sent to your email
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-green-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Patient Signup
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) => (
            <FormInput
              key={field.id}
              {...field}
              value={formData[field.id]}
              onChange={handleChange}
            />
          ))}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/patient/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default PatientSignup;
