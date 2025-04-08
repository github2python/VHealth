import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate, Link } from "react-router-dom";

const PatientHistory: React.FC = () => {
  const navigate = useNavigate(); 
  const [appointments, setAppointments] = useState([]);
  const { user } = useUser();
  
      const role = user?.unsafeMetadata?.role;
      if(role!="patient"){
        navigate("/patient/login")
      }

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      try {
        const email = user.emailAddresses[0].emailAddress;
        const response = await axios.get(
          `http://localhost:5000/patient/history/appointments/${email}`
        );
        // Format appointment date using Day.js
        const formattedAppointments = response.data.map((appointment) => ({
          ...appointment,
          appointmentDate: dayjs(appointment.appointmentDate).format("DD/MM/YYYY"),
        }));
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user]);

  return (
    <div className="bg-gray-100">
      <nav className="bg-white shadow-md py-6 px-8 mb-0 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="Vhealth Logo" className="h-10 w-10 mr-2" />
          <span className="text-3xl font-bold text-orange-600">VHealth</span>
        </div>
        <div className="flex space-x-12">
          <Link to="/patient/dashboard" className="text-gray-600 hover:underline">
            Home
          </Link>
          <Link to="/patient/history" className="text-gray-600 hover:underline">
            History
          </Link>
          <Link to="#" className="text-gray-600 hover:underline">
            Feedback
          </Link>
        </div>
      </nav>
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Appointment History
        </h3>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Doctor
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Time
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Prescription
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {appointment.appointmentDate}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {appointment.doctorName}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {appointment.appointmentTime}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  <a
                    href={`http://localhost:5000/${appointment.prescription}`}
                    className="text-blue-600 hover:underline"
                    download
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientHistory;
