import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import JitsiMeetComponent from '../../VideoCall';

const DoctorAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useUser();
      const role = user?.unsafeMetadata?.role;
      if(role!="doctor"){
        navigate("/doctor/login")
      }
  const location = useLocation();
  const appointment = location.state.appointment;

  const patientEmail = appointment.patientEmail;

  const [patientDetails, setPatientDetails] = useState<{
    patientName: string;
    appointmentDate: string;
    appointmentTime: string;
  } | null>(null);

  const [patientPic, setPatientPic] = useState<{
    profilePic: string;
  } | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
 
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);

  useEffect(() => {
    const fetchPatientAppointment = async () => {
      try {
        setRoomName(appointment.appointmentId);
        const doctorEmail = user?.emailAddresses[0]?.emailAddress;
        if (!doctorEmail) return;

        const response = await axios.get(
          `http://localhost:5000/doctor/appointments/${appointment._id}`
        );

        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
          const appointmentData = response.data[0];

          const parsedDate = new Date(appointmentData.appointmentDate);
          const formattedDate = parsedDate.toLocaleDateString('en-GB');

          setPatientDetails({
            patientName: appointmentData.patientName,
            appointmentDate: formattedDate,
            appointmentTime: appointmentData.appointmentTime,
          });
        } else {
          console.warn("No appointment details found.");
        }
      } catch (error) {
        console.error('Error fetching patient appointment:', error);
      }
    };

    fetchPatientAppointment();

    const fetchPatientProfilePic = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/patients/pic/${patientEmail}`
        );

        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
          const profilePic = response.data[0].profilePic;
          setPatientPic({ profilePic });
        } else {
          console.warn("Profile pic not found in response data.");
        }
      } catch (error) {
        console.error("Error fetching patient profile pic:", error);
      }
    };

    fetchPatientProfilePic();
  }, [user, appointment._id, patientEmail]);
 
  const handleJoinCall = () => {
    
    if (roomName) {
      setIsMeetingOpen(true);
    } else {
      alert('Room name is not available.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
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
      <div className="min-h-screen bg-gray-100 p-6">
      {isMeetingOpen ? (
          <JitsiMeetComponent
            roomName={appointment.appointmentId}
            userName={user?.fullName || 'Doctor'}
            userEmail={user?.emailAddresses[0]?.emailAddress || ''}
            config={{
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              prejoinPageEnabled: true,
              configOverwrite: {
                moderator: true,  // This is the key part, ensuring doctor is the moderator
              }
            }}
            onClose={() => setIsMeetingOpen(false)}
          />
        ) : (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-6">Appointment Details</h1>

          {/* Patient Details Section */}
          {patientDetails ? (
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                {patientPic ? (
                  <img
                    src={`http://localhost:5000${appointment.profilePic}` || "/default-profile.png"}
                    alt="Patient"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-gray-500">Loading profile pic details...</p>
                )}
              </div>
              <div>
                <h2 className="text-lg font-medium">{patientDetails.patientName}</h2>
                <p className="text-gray-600">{patientDetails.appointmentDate}</p>
                <p className="text-gray-600">{patientDetails.appointmentTime}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading appointment details...</p>
          )}

          {/* Chat Icon */}
          {/* <div className="relative mb-6">
            <button
              className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-md hover:bg-blue-700"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              {isChatOpen ? 'Close Chat' : 'Chat'}
            </button>

            {isChatOpen && (
              <div className="absolute bottom-20 right-6 w-72 h-96 bg-white shadow-md rounded-lg border border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Chat</h3>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setIsChatOpen(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto text-gray-700">
                  <p className="mb-2">
                    Patient: Hello Doctor, I have a few questions about the
                    appointment.
                  </p>
                  <p>Doctor: Sure, feel free to ask.</p>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div> */}

          {/* Join Appointment Button */}
          <button onClick={handleJoinCall} className="w-full bg-green-600 text-white py-3 rounded-md text-lg shadow-md hover:bg-green-700">
            Join Appointment
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
