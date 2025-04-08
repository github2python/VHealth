import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import JitsiMeetComponent from "../../../VideoCall";

type Appointment = {
  appointmentId: string;
  patientEmail: string;
  doctorName: string;
  appointmentTime: string;
  appointmentDate: string;
};

const CurrentAppointments: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const role = user?.unsafeMetadata?.role;

  if (role !== "patient") {
    navigate("/patient/login");
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("");
  let id = "";
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!isLoaded || !user) {
        console.log("User data not loaded yet.");
        return;
      }

      const email = user?.emailAddresses[0]?.emailAddress;
      try {
        console.log("User email:", email);
        const response = await axios.get(
          `http://localhost:5000/show/patient/appointments/${email}`
        );
        setAppointments(response.data);
        // console.log("Fetched appointments:", response.data);
        id=response.data[0].appointmentId;
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user, isLoaded]);

  const handleCancel = async (appointmentId: string) => {
    if (!isLoaded || !user) {
      console.log("User data not loaded yet.");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:5000/cancel/appointment/${appointmentId}`
      );
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.appointmentId !== appointmentId)
      );
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const handleJoin = (appointmentId: string) => {
    setCurrentRoom(appointmentId);
    setIsMeetingOpen(true);
  };

  const profile = () => {
    navigate("/patient/profile");
  };

  const handleDeleteAppointment = async () => {
    setIsMeetingOpen(false);
    setCurrentRoom("");
    try {
      await axios.delete(               
        `http://localhost:5000/cancel/appointment/${id}`
      );
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.appointmentId !== currentRoom)
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
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
          <Link
            to="/patient/dashboard"
            className="text-blackgray-600 hover:selection"
          >
            Home
          </Link>
          <Link
            to="/patient/currentAppointment"
            className="text-black-600 hover:selection"
          >
            Current Appointments
          </Link>
          <Link to="/patient/history" className="text-black-600 hover:selection">
            History
          </Link>
          <Link to="#" className="text-black-600 hover:selection">
            Feedback
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={profile} className="cursor-pointer">
            <FaUserCircle className="text-3xl text-gray-600" />
          </button>
        </div>
      </nav>
      <div className="min-h-screen bg-gray-100 p-6">
        {isMeetingOpen ? (
          <JitsiMeetComponent
            roomName={currentRoom}
            userName={user?.fullName || "Patient"}
            userEmail={user?.emailAddresses[0]?.emailAddress || ""}
            onClose={handleDeleteAppointment}
          />
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-500">No current appointments.</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.appointmentId}
                    className="p-4 border rounded-md bg-white shadow-md flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {appointment.doctorName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.appointmentTime}
                      </p>
                    </div>
                    <div className="space-x-4">
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700"
                        onClick={() => handleCancel(appointment.appointmentId)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700"
                        onClick={() => handleJoin(appointment.appointmentId)}
                      >
                        Join Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentAppointments;
