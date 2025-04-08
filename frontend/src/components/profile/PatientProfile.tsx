import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";



const PatientProfile: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
 
     
         const role = user?.unsafeMetadata?.role;
         if(role!="patient"){
           navigate("/patient/login")
         }
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });  
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user email from Clerk
        const email = user?.emailAddresses[0]?.emailAddress;
        
        if (!email) {
          console.error("No email found for the user.");
          return;
        }

        const response = await axios.get(`http://localhost:5000/patient/${email}`);
        setUserData(response.data); 
        setTimeout(() => {
          // setPatientEmail(response.data.email);
          // setPatientName(response.data.name);           
        }
        , 1000);

        // setPatientName(response.data.name); 
        // setPatientEmail(response.data.email);
             
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData(); 
    }
  }, [user]); 

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("profilePic", e.target.files[0]);

      try {
        const response = await axios.put(
          `http://localhost:5000/patient/updateProfilePic/${userData.email}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          setUserData((prev) => ({ ...prev, profilePic: response.data.profilePic }));
          alert("Profile picture updated successfully!");
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
        alert("Failed to update profile picture. Please try again.");
      }
    }
  };

  
  return (
    <div className="bg-gray-100">
      <nav className="bg-white shadow-md py-6 px-8 mb-0 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="Vhealth Logo" className="h-10 w-10 mr-2" />
          <span className="text-3xl font-bold text-orange-600">VHealth</span>
        </div>
        <div className="flex space-x-12">
          <Link to="/patient/dashboard" className="text-gray-600 hover:underline">Home</Link>
          <Link to="/patient/history" className="text-gray-600 hover:underline">History</Link>
          <Link to="#" className="text-gray-600 hover:underline">Feedback</Link>
        </div>
      </nav>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
          {/* Profile Picture and Info */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={`http://localhost:5000${userData.profilePic}` || "/default-profile.png"}
                alt="User Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
              />
              <label
                htmlFor="profilePic"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
                title="Upload Picture"
              >
                🔄
              </label>
              <input
                type="file"
                id="profilePic"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePicUpload}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mt-4">{userData.name}</h2>
            <p className="text-gray-500 text-sm">{userData.email}</p>
          </div>

          {/* Options Section */}
          <div className="mt-8">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 mb-4">
              Change Password
            </button>
          </div>

          
         
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
