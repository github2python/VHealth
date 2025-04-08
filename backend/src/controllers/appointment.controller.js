const PatientAppointment = require("../models/PatientAppointment");
const DoctorAppointment = require("../models/DoctorAppointment");

// Schedule appointment
exports.scheduleAppointment = async (req, res) => {
  const appointmentId = uuidv4();
  const { doctorEmail, patientEmail, date, time, doctorName, patientName } =
    req.body;

  try {
    const newPatientAppointment = new PatientAppointment({
      doctorEmail,
      patientEmail,
      doctorName,
      appointmentTime: time,
      appointmentDate: date,
      appointmentId,
    });

    await newPatientAppointment.save();

    const newDoctorAppointment = new DoctorAppointment({
      doctorEmail,
      patientEmail,
      patientName,
      appointmentTime: time,
      appointmentDate: date,
      appointmentId,
    });

    await newDoctorAppointment.save();

    res.status(201).json({ message: "Appointment scheduled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get patient appointments
exports.getPatientAppointments = async (req, res) => {
  const { email } = req.params;

  try {
    const appointments = await PatientAppointment.find({ patientEmail: email });
    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const patientAppointment = await PatientAppointment.findOneAndDelete({
      appointmentId: id,
    });

    const doctorAppointment = await DoctorAppointment.findOneAndDelete({
      appointmentId: id,
    });

    if (!patientAppointment || !doctorAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  const { email } = req.params;

  try {
    const appointments = await DoctorAppointment.find({
      doctorEmail: email,
    }).select(
      "patientName patientEmail appointmentTime appointmentDate appointmentId"
    );

    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
};
