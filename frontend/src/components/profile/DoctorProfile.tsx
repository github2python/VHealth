import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
 import { FaUserCircle } from "react-icons/fa";

const DoctorProfile: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();  
  const role = user?.unsafeMetadata?.role;
  if(role!="doctor"){
    navigate("/doctor/login")
  }
  
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [degrees, setDegrees] = useState<string[]>([]); // Ensure it's initialized as an array
  const [newDegree, setNewDegree] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
 
  const doctorEmail = user?.emailAddresses[0]?.emailAddress;


  
  useEffect(() => {
    if (doctorEmail) {
      axios
        .get(`http://localhost:5000/doctor/${doctorEmail}`)
        .then((response) => {
          const { profilePic, description, doctorDegrees, rating } = response.data;

          // Ensure response data is valid and set default values if not
          setProfilePic(profilePic || null);
          setDescription(description || "");
          setDegrees(doctorDegrees && Array.isArray(doctorDegrees) ? doctorDegrees : []); // Validate degrees as an array
          setRating(rating || null);
        })
        .catch((error) => console.error("Error fetching doctor data:", error));
    }
  }, [doctorEmail]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("profilePic", e.target.files[0]);

      axios
        .put(`http://localhost:5000/doctor/updateProfilePic/${doctorEmail}`, formData)
        .then((response) => {
          setProfilePic(response.data.profilePic);
        })
        .catch((error) => console.error("Error uploading profile picture:", error));
    }
  };

  const handleAddDegree = () => {
    if (newDegree.trim()) {
      axios
        .put(`http://localhost:5000/doctor/addDegree/${doctorEmail}`, { degree: newDegree.trim() })
        .then((response) => {
          const updatedDegrees = response.data.degrees;
          console.log("Add degree response:", response.data); // Debugging log
          setDegrees(updatedDegrees && Array.isArray(updatedDegrees) ? updatedDegrees : degrees); // Validate response
          setNewDegree("");
        })
        .catch((error) => console.error("Error adding degree:", error));
    }
    
  };

  const handleDeleteDegree = (degree: string) => {
    axios
      .put(`http://localhost:5000/doctor/removeDegree/${doctorEmail}`, { degree })
      .then((response) => {
        const updatedDegrees = response.data.degrees;
        setDegrees(updatedDegrees && Array.isArray(updatedDegrees) ? updatedDegrees : degrees); // Validate response
        console.log(updatedDegrees);
      })
      .catch((error) => console.error("Error deleting degree:", error));
  };

  const handleSaveDescription = () => {
    axios
      .put(`http://localhost:5000/doctor/updateDescription/${doctorEmail}`, { description })
      .then(() => setIsEditingDescription(false))
      .catch((error) => console.error("Error updating description:", error));
  };
  
  return (
    <div className="bg-gray-100">
       <nav className="bg-white shadow-md py-6 px-8 mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Vhealth Logo"
            className="h-10 w-10 mr-2"
          />
          <span className="text-3xl font-bold text-orange-600">VHealth</span>
        </div>
        <div className="flex space-x-12">
          <Link
           to="/doctor/dashboard"
            className="text-black-gray-600 hover:selection mr-18 ml-18"
          >
            Home
          </Link>
          <Link to="/doctor/history" className="text-black-600 hover:selection">
            History
          </Link>
          <Link to="#" className="text-black-600 hover:selection">
            Feedback
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/doctor/profile" className="cursor-pointer" >
            <FaUserCircle className="text-3xl text-gray-600" />
          </Link>
        </div>
      </nav>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-6">Doctor Profile</h1>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              <img
                src={`http://localhost:5000${profilePic}` || "/default-profile.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <label
                htmlFor="upload-profile-pic"
                className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md cursor-pointer hover:bg-blue-700"
              >
                Upload Picture
              </label>
              <input
                type="file"
                id="upload-profile-pic"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium mb-2">Short Description</h2>
            {isEditingDescription ? (
              <div className="flex items-center space-x-4">
                <textarea
                  className="border border-gray-300 rounded-md p-2 w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700"
                  onClick={handleSaveDescription}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-gray-700">{description}</p>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                  onClick={() => setIsEditingDescription(true)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium mb-2">Degrees & Qualifications</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {degrees.length > 0 ? (
                degrees.map((degree, index) => (
                  <li key={index} className="flex items-center justify-between">
                    {degree}
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteDegree(degree)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No degrees added yet.</p>
              )}
            </ul>

            <div className="flex items-center space-x-4 mt-4">
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 flex-1"
                placeholder="Add new degree"
                value={newDegree}
                onChange={(e) => setNewDegree(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700"
                onClick={handleAddDegree}
              >
                Add
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium mb-2">Rating</h2>
            <p className="text-gray-700 text-lg font-semibold">
              {rating !== null ? `${rating} / 5` : "No rating given yet by any patient"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
