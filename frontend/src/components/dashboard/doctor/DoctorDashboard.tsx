import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import dayjs from 'dayjs';

type Appointment = {
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  profilePic?: string | null;
  appointmentId: string;
};

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const role = user?.unsafeMetadata?.role;
  if (role !== 'doctor') {
    navigate('/doctor/login');
  }

  const { signOut } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!isLoaded || !user) {
        console.log('User data not loaded yet.');
        return;
      }
      try {
        const email = user?.emailAddresses[0]?.emailAddress;

        const response = await axios.get(
          `http://localhost:5000/show/doctor/appointments/${email}`
        );

        if (response.status === 200) {
          const appointmentsData = response.data;

          const updatedAppointments = await Promise.all(
            appointmentsData.map(async (appointment: Appointment) => {
              try {
                const picResponse = await axios.get(
                  `http://localhost:5000/show/patient/picture/${appointment.patientEmail}`
                );
                return {
                  ...appointment,
                  profilePic: picResponse.data.profilePic,
                };
              } catch (error) {
                console.error(
                  `Error fetching profile picture for ${appointment.patientEmail}:`,
                  error
                );
                return { ...appointment, profilePic: null };
              }
            })
          );

          setAppointments(updatedAppointments);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    fetchAppointments();
  }, [user, isLoaded]);

  const toggleAvailability = async () => {
    try {
      const email = user?.emailAddresses[0]?.emailAddress;
      const updatedAvailability = !isAvailable;
      const response = await axios.put(
        `http://localhost:5000/doctor/updateAvailability/${email}`,
        { isAvailable: updatedAvailability }
      );
      if (response.status === 200) {
        setIsAvailable(updatedAvailability);
      }
    } catch (err) {
      console.error('Error updating availability:', err);
    }
  };

  const profile = () => {
    navigate('/doctor/profile');
  };

  const logout = async () => {
    try {
      await signOut();
      navigate('/doctor/login');
    } catch (err) {
      console.error('Logout failed:', err);
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
          <Link to="/doctor/dashboard" className="text-black-gray-600 hover:selection mr-18 ml-18">
            Home
          </Link>
          <Link to="/doctor/history" className="text-black-600 hover:selection">
            History
          </Link>
          <Link to="#" className="text-black-600 hover:selection">
            Feedback
          </Link>
          <button onClick={logout} className="text-black-600 hover:selection cursor-pointer">
            Log Out
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <Link onClick={profile} className="cursor-pointer" to="/doctor/profile">
            <FaUserCircle className="text-3xl text-gray-600" />
          </Link>
        </div>
      </nav>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>
            <button
              className={`px-4 py-2 rounded-md shadow-md font-medium transition-all ${
                isAvailable
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              onClick={toggleAvailability}
            >
              {isAvailable ? 'Set Not Available' : 'Set Available'}
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No current appointments.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.patientEmail}
                  className="p-4 border rounded-md bg-white shadow-md flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    {appointment.profilePic ? (
                      <img
                        src={`http://localhost:5000${appointment.profilePic}`}
                        alt={`${appointment.patientName}'s profile`}
                        className="h-12 w-12 rounded-full"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">No Pic</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {dayjs(appointment.appointmentDate).format('DD/MM/YYYY')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.appointmentTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700"
                      onClick={() =>
                        navigate('/doctor/appointment', {
                          state: { appointment },
                        })
                      }
                    >
                      Attend Appointment
                    </button>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                      onClick={() =>
                        navigate('/doctor/chat', {
                          state: { patientEmail: appointment.patientEmail },
                        })
                      }
                    >
                      Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;