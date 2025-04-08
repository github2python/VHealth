const PatientHistory = require("../models/PatientHistory");
const DoctorHistory = require("../models/DoctorHistory");

// Get patient history
exports.getPatientHistory = async (req, res) => {
  const { email } = req.params;

  try {
    const history = await PatientHistory.find({ patientEmail: email });

    if (!history || history.length === 0) {
      return res.status(404).json({ message: "No history found" });
    }

    res.status(200).json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDoctorHistory = async (req, res) => {
  const { email } = req.params;

  try {
    const doctorHistory = await DoctorHistory.find({ doctorEmail: email }).sort(
      { createdAt: -1 }
    );

    if (!doctorHistory || doctorHistory.length === 0) {
      return res.status(404).json({ error: "No history found" });
    }

    res.status(200).json(doctorHistory);
  } catch (err) {
    console.error("Error fetching doctor history:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.uploadPrescription = async (req, res) => {
  const { appointmentId } = req.params;
  const prescriptionFilePath = req.file
    ? `uploads/prescriptions/${req.file.filename}`
    : null;

  if (!prescriptionFilePath) {
    return res.status(400).json({ message: "No prescription file uploaded." });
  }

  try {
    const appointment = await DoctorHistory.findOne({
      appointmentId,
    });
    const patientAppointment = await PatientHistory.findOne({
      appointmentId,
    });

    if (!appointment || !patientAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.prescription = prescriptionFilePath;
    patientAppointment.prescription = prescriptionFilePath;

    await appointment.save();
    await patientAppointment.save();

    res.status(200).json({
      message: "Prescription uploaded successfully.",
      prescriptionUrl: prescriptionFilePath,
    });
  } catch (error) {
    console.error("Error uploading prescription:", error);
    res
      .status(500)
      .json({ message: "Error uploading prescription. Please try again." });
  }
};
