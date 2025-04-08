import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

type DoctorHistory = {
  patientName: string;
  date: string;
  time: string;
  prescription: string;
  appointmentId: string;
};

const DoctorHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const role = user?.unsafeMetadata?.role;
  if (role !== 'doctor') {
    navigate('/doctor/login');
  }

  const [doctorHistory, setDoctorHistory] = useState<DoctorHistory[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Fetch doctor history when the component loads
  useEffect(() => {
    const fetchDoctorHistory = async () => {
      try {
        const email = user?.emailAddresses[0]?.emailAddress;
        const response = await axios.get(`http://localhost:5000/doctor/history/appointments/${email}`);
        if (response.status === 200) {
          setDoctorHistory(response.data);
        }
      } catch (err) {
        console.error('Error fetching doctor history:', err);
      }
    };

    fetchDoctorHistory();
  }, [user]);

  const handlePrescriptionChange = (event: React.ChangeEvent<HTMLInputElement>, appointmentId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedAppointmentId(appointmentId); // Track the appointment ID
    }
  };

  const handleUploadPrescription = async () => {
    if (!selectedFile) {
      alert('Please select a prescription file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('prescription', selectedFile);
    formData.append('appointmentId', selectedAppointmentId!);

    setUploading(true);

    try {
      const response = await axios.put(`http://localhost:5000/uploads/prescriptions/${selectedAppointmentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)
      if (response.status === 200) {
        setDoctorHistory((prevHistory) =>
          prevHistory.map((history) =>
            history.appointmentId === selectedAppointmentId
              ? { ...history, prescription: response.data.prescriptionUrl }
              : history
          )    
        );
        alert('Prescription uploaded successfully');
        // Clear the file and appointment ID after a successful upload
        setSelectedFile(null);
        setSelectedAppointmentId(null);
      }
    } catch (err) {
      console.error('Error uploading prescription:', err);
      alert('Error uploading prescription. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-100">
      <nav className="bg-white shadow-md py-6 px-8 mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="Vhealth Logo" className="h-10 w-10 mr-2" />
          <span className="text-3xl font-bold text-orange-600">VHealth</span>
        </div>
        <div className="flex space-x-12">
          <Link to="/doctor/dashboard" className="text-blackgray-600 hover:text-orange-600">
            Home
          </Link>
          <Link to="/doctor/history" className="text-black-600 hover:text-orange-600">
            History
          </Link>
          <Link to="#" className="text-black-600 hover:text-orange-600">
            Feedback
          </Link>
        </div>
      </nav>

      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-semibold mb-4">Doctor's Appointments History</h1>

        {doctorHistory.length === 0 ? (
          <p className="text-gray-500">No previous appointments found.</p>
        ) : (
          <div className="space-y-6">
            {doctorHistory.map((history) => (
              <div
                key={history.appointmentId}
                className="bg-white p-4 border rounded-md shadow-md flex justify-between items-start"
              >
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium text-gray-800">{history.patientName}</h3>
                  <p className="text-sm text-gray-600">{history.date}</p>
                  <p className="text-sm text-gray-600">{history.time}</p>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {history.prescription ? (
                    <a
                      href={`http://localhost:5000/${history.prescription}`}
                      download
                      className="bg-indigo-600 text-white text-sm px-3 py-1 rounded-md shadow-md hover:bg-indigo-700"
                    >
                      Download Prescription {history.prescription.split('.').pop()}
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm">No prescription uploaded</span>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handlePrescriptionChange(e, history.appointmentId)}
                      disabled={uploading}
                      className="text-sm"
                    />
                    <button
                      onClick={handleUploadPrescription}
                      disabled={uploading || !selectedFile}
                      className={`text-sm px-4 py-1 rounded-md shadow-md ${
                        uploading ? 'bg-gray-400' : 'bg-blue-600'
                      } text-white hover:bg-blue-700`}
                    >
                      {uploading ? 'Uploading...' : 'Upload Prescription'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorHistoryPage;