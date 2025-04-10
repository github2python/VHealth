import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";


type DoctorDetails = {
  picture: string;
  name: string;
  degrees: string;
   description: string;
};

const ScheduleAppointment: React.FC = () => {

  const {user}=useUser();
  const navigate = useNavigate();   
      const role = user?.unsafeMetadata?.role;
      if(role!="patient"){
        navigate("/patient/login")
      }
  const location = useLocation();
  const fullName = user?.firstName;

  const {email} = location.state as { email: string } || { email: "" }; 
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);

  const currentDateTime = new Date();  
  useEffect(() => {
    // Fetch doctor details from the backend
    const fetchDoctorDetails = async () => {
      try {        
        const response = await axios.get(`http://localhost:5000/doctor/${email}`);
        const { profilePic, doctorName, doctorDegrees, description } = response.data;
        setDoctor({
          picture: profilePic,
          name: doctorName,
          degrees: doctorDegrees.join(", "),         
          description:description,
        });
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchDoctorDetails();
  }, []);

  const handleSchedule = async () => {
    try {
      const hours = currentDateTime.getHours(); // Get hours in 24-hour format
    const minutes = currentDateTime.getMinutes(); // Get minutes
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`; // Format time as HH:MM
      const appointmentData = {
        patientEmail: user?.emailAddresses[0]?.emailAddress,
        doctorEmail: email,
        doctorName: doctor?.name,
        appointmentTime: formattedTime, 
        appointmentDate: new Date().toISOString().slice(0, 10), 
        patientName: fullName,
      };  
  
      await axios.post("http://localhost:5000/api/schedule-appointment", appointmentData);
  
      setIsScheduled(true);
      setTimeout(() => setIsScheduled(false), 3000); 
      navigate("/patient/appointment");
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("Failed to schedule the appointment. Please try again.");
    }
  };
  

  if (!doctor) {
    return <div className="min-h-screen bg-gray-50 p-6">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
    <nav className="bg-white shadow-md py-6 px-8 mb- mt-0 flex justify-between items-center">
              <div className="flex items-center">
                <img src="/logo.png" alt="Vhealth Logo" className="h-10 w-10 mr-2" />
                <span className="text-3xl font-bold text-orange-600">VHealth</span>
              </div>
              <div className="flex space-x-12">
                <Link to="/patient/dashboard" className="text-blackgray-600 hover:selection mr-18 ml-18">Home</Link>
                <Link to="/patient/currentAppointment" className="text-black-600 hover:selection">Current Appointments</Link>
                <Link to="/patient/history" className="text-black-600 hover:selection">History</Link>
                <Link to="#" className="text-black-600 hover:selection">Feedback</Link>
               
              </div>
             
            </nav>
    <div className="min-h-screen bg-gray-50 p-6">
       
      {/* Doctor Details Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={`http://localhost:5000${doctor.picture}`}
            alt="Doctor"
            className="w-32 h-32 rounded-full shadow-md mb-4"
          />
          <h2 className="text-xl font-semibold">{doctor.name}</h2>
          <p className="text-sm text-gray-500">{doctor.degrees}</p>
         
          <p className="text-gray-700 text-sm leading-relaxed">
            {doctor.description}
          </p>
        </div>
      </div>

      {/* Appointment Button */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <button
          className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-md hover:bg-indigo-700"
          onClick={handleSchedule}
        >
          Schedule Appointment
        </button>
        {isScheduled && (
          <div className="mt-4 bg-green-100 text-green-700 p-4 rounded-md">
            Appointment scheduled successfully!
          </div>
        )}
      </div>

      {/* Chat Section */}
      {/* <div className="fixed bottom-4 right-4">
        {isChatOpen ? (
          <div className="bg-white shadow-lg rounded-lg w-80 h-96 flex flex-col">
            <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <span>Chat with {doctor.name}</span>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-xl"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="text-sm text-gray-600">
                Start your conversation here...
              </div>
            </div>
            <div className="p-4 border-t">
              <input
                type="text"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type your message..."
              />
            </div>
          </div>
        ) : (
          <button
            className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700"
            onClick={() => setIsChatOpen(true)}
          >
            Chat
          </button>
        )}
      </div> */}
    </div>
    </div>
  );
};

export default ScheduleAppointment;
