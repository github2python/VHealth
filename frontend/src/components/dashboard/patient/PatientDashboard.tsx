import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

const PatientDashboard: React.FC = () => {
  const { signOut } = useAuth();  
  const navigate = useNavigate();
  const { user } = useUser();
  const role = user?.unsafeMetadata?.role;
  if(role!="patient"){
    navigate("/patient/login")
  }
 
  const [filter, setFilter] = useState({
    available: "",
    rating: 0,
    specialization: "",
  });
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    // Fetch doctors from the backend
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(response.data);
        
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const availableMatch =
      filter.available === ""
        ? true
        : filter.available === "true"
        ? doctor.isAvailable
        : !doctor.isAvailable;

    const ratingMatch = filter.rating === 0 || doctor.rating >= filter.rating;

    const specializationMatch =
      filter.specialization === "" ||
      doctor.specialization.toLowerCase().includes(filter.specialization.toLowerCase());

    return availableMatch && ratingMatch && specializationMatch;
  });

  const profile = () => {
    navigate("/patient/profile");
  };

  const logout = async () => {
    try {
      await signOut();
      navigate("/patient/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-white shadow-md py-6 px-8 mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="Vhealth Logo" className="h-10 w-10 mr-2" />
          <span className="text-3xl font-bold text-orange-600">VHealth</span>
        </div>
        <div className="flex space-x-12">
          <Link to="/patient/dashboard" className="text-blackgray-600 hover:selection mr-18 ml-18">Home</Link>
          <Link to="/patient/currentAppointment" className="text-black-600 hover:selection">Current Appointments</Link>
          <Link to="/patient/history" className="text-black-600 hover:selection">History</Link>
          <Link to="#" className="text-black-600 hover:selection">Feedback</Link>
          <button onClick={logout} className="text-black-600 hover:selection cursor-pointer">Log Out</button>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={profile} className="cursor-pointer">
            <FaUserCircle className="text-3xl text-gray-600" />
          </button>
        </div>
      </nav>
  
      <div className="max-w-7xl mx-auto px-4 py-6 mb-8 space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            className="p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={filter.available}
            onChange={(e) => setFilter({ ...filter, available: e.target.value })}
          >
            <option value="">All</option>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
          <select
            className="p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={filter.rating.toString()}
            onChange={(e) =>
              setFilter({ ...filter, rating: parseFloat(e.target.value) })
            }
          >
            <option value="0">All Ratings</option>
            <option value="3">3 & above</option>
            <option value="4">4 & above</option>
            <option value="4.5">4.5 & above</option>
          </select>
          <input
            type="text"
            placeholder="Specialization"
            className="p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={filter.specialization}
            onChange={(e) =>
              setFilter({ ...filter, specialization: e.target.value })
            }
          />
        </div>
      </div>
  
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden p-6 flex flex-col items-center text-center"
          >
            <img
              src={`http://localhost:5000${doctor.profilePic}`}
              alt={doctor.doctorName}
              className="h-24 w-24 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-bold text-gray-700">{doctor.doctorName}</h3>
            <p className="text-sm text-gray-500 mt-2">
              Degrees: {doctor.doctorDegrees.join(", ")}
            </p>
            <p
              className={`text-sm font-medium mt-2 ${
                doctor.isAvailable ? "text-green-500" : "text-red-500"
              }`}
            >
              {doctor.isAvailable ? "Available" : "Not Available"}
            </p>
            <p className="text-sm text-yellow-500 mt-2">
              {`Rating: ${doctor.rating.toFixed(1)} ⭐`}
            </p>
            <div className="flex flex-col space-y-2 mt-4">
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer"
                disabled={!doctor.isAvailable}
                onClick={() =>
                  navigate(`/patient/appointment`, {
                    state: { email: doctor.doctorEmail },
                  })
                }
              >
                Schedule Appointment
              </button>
              <button
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 cursor-pointer"
                onClick={() =>
                  navigate(`/patient/chat`, {
                    state: { doctorEmail: doctor.doctorEmail },
                  })
                }
              >
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
