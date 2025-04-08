require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Patient = require("./src/models/patientSchema");
const Doctor = require("./src/models/doctorSchema");
const DoctorAppointment = require("./src/models/doctorAppointment");
const PatientAppointment = require("./src/models/patientAppointment");
const { v4: uuidv4 } = require("uuid");
const DoctorHistory = require("./src/models/doctorPastSchema");
const PatientHistory = require("./src/models/patientPastSchema");
const socketIo = require("socket.io");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5000;

const http = require("http");
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Serve static files for /uploads/prescriptions
app.use(
  "/uploads/prescriptions",
  express.static(path.join(__dirname, "uploads/prescriptions"))
);
// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Multer configuration for prescription uploads
const prescriptionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/prescriptions/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadPrescriptions = multer({ storage: prescriptionStorage });

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});
// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for messages from clients
  socket.on("send_message", (data) => {
    console.log("Message received on server:", data);
    // Broadcast message to all connected clients
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the VHealth Backend!");
});

// Signup route for patients
app.post("/patient/signup", async (req, res) => {
  const { email, name } = req.body;

  try {
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const newPatient = new Patient({
      email,
      name,
      profilePic: "",
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get patient details
app.get("/patient/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const patient = await Patient.findOne({ email }).select(
      "email name profilePic"
    );

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update patient profile picture
app.put(
  "/patient/updateProfilePic/:email",
  upload.single("profilePic"),
  async (req, res) => {
    const { email } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const profilePicPath = `/uploads/${req.file.filename}`;

    try {
      const updatedPatient = await Patient.findOneAndUpdate(
        { email },
        { profilePic: profilePicPath },
        { new: true }
      );

      if (!updatedPatient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePic: profilePicPath,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Signup route for doctors
app.post("/doctor/signup", async (req, res) => {
  const { email, name } = req.body;

  try {
    const existingDoctor = await Doctor.findOne({ doctorEmail: email });
    if (existingDoctor) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const newDoctor = new Doctor({
      doctorEmail: email,
      doctorName: name,
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get doctor details
app.get("/doctor/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const doctor = await Doctor.findOne({ doctorEmail: email }).select(
      "doctorEmail doctorName description profilePic rating isAvailable doctorDegrees"
    );

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    // console.log(doctor);
    res.status(200).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update doctor profile picture
app.put(
  "/doctor/updateProfilePic/:email",
  upload.single("profilePic"),
  async (req, res) => {
    const { email } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const profilePicPath = `/uploads/${req.file.filename}`;

    try {
      const updatedDoctor = await Doctor.findOneAndUpdate(
        { doctorEmail: email },
        { profilePic: profilePicPath },
        { new: true }
      );

      if (!updatedDoctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePic: profilePicPath,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Update doctor description
app.put("/doctor/updateDescription/:email", async (req, res) => {
  const { email } = req.params;
  const { description } = req.body;

  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doctorEmail: email },
      { description },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json({
      message: "Description updated successfully",
      description: updatedDoctor.description,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add degree to doctor
app.put("/doctor/addDegree/:email", async (req, res) => {
  const { email } = req.params;
  const { degree } = req.body;

  if (!degree || typeof degree !== "string" || degree.trim() === "") {
    return res.status(400).json({ error: "Invalid degree provided" });
  }

  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doctorEmail: email },
      { $addToSet: { doctorDegrees: degree.trim() } }, // Use $addToSet to avoid duplicates
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json({
      message: "Degree added successfully",
      degrees: updatedDoctor.doctorDegrees,
    });
  } catch (err) {
    console.error("Error adding degree:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove degree from doctor
app.put("/doctor/removeDegree/:email", async (req, res) => {
  const { email } = req.params;
  const { degree } = req.body;

  if (!degree || typeof degree !== "string" || degree.trim() === "") {
    return res.status(400).json({ error: "Invalid degree provided" });
  }

  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doctorEmail: email },
      { $pull: { doctorDegrees: degree.trim() } }, // $pull removes matching degree
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await res.status(200).json({
      message: "Degree removed successfully",
      degrees: updatedDoctor.Doctordegrees,
    });
  } catch (err) {
    console.error("Error removing degree:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update doctor availability status
app.put("/doctor/updateAvailability/:email", async (req, res) => {
  const { email } = req.params;
  const { isAvailable } = req.body;

  if (typeof isAvailable !== "boolean") {
    return res.status(400).json({ error: "Invalid availability status" });
  }

  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doctorEmail: email },
      { isAvailable },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor availability updated successfully",
      isAvailable: updatedDoctor.isAvailable,
    });
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch doctor's history (previous appointments)
app.get("/doctor/history/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const doctorHistory = await DoctorHistory.find({ doctorEmail: email }).sort(
      { createdAt: -1 }
    ); // Sort by creation date (latest first)
    if (!doctorHistory || doctorHistory.length === 0) {
      return res.status(404).json({ error: "No history found" });
    }
    res.status(200).json(doctorHistory);
  } catch (err) {
    console.error("Error fetching doctor history:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all doctors
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch doctors." });
  }
});

app.post("/api/schedule-appointment", async (req, res) => {
  const appointmentId = uuidv4();
  const {
    doctorEmail,
    patientEmail,
    date,
    time,
    doctorName,
    appointmentTime,
    appointmentDate,
    patientName,
  } = req.body;

  try {
    const newAppointment = new DoctorAppointment({
      doctorEmail,
      patientEmail,
      appointmentTime,
      appointmentDate,
      patientName,
      appointmentId,
    });

    await newAppointment.save();

    const newPatientAppointment = new PatientAppointment({
      doctorEmail,
      patientEmail,
      doctorName,
      appointmentTime,
      appointmentDate,
      appointmentId,
    });
    await newPatientAppointment.save();

    const newDoctorHistory = new DoctorHistory({
      doctorEmail,
      patientEmail,
      patientName,
      appointmentTime,
      appointmentDate,
      appointmentId,
      prescription: "/prescriptions/abc123.pdf",
    });
    await newDoctorHistory.save();

    const newPatientHistory = new PatientHistory({
      doctorEmail,
      patientEmail,
      doctorName,
      appointmentTime,
      appointmentDate,
      appointmentId,
      prescription: "/prescriptions/abc123.pdf",
    });
    await newPatientHistory.save();

    res.status(201).json({ message: "Appointment scheduled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/show/patient/appointments/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const appointments = await PatientAppointment.find({
      patientEmail: email,
    }).select(
      "appointmentId patientEmail doctorName appointmentTime appointmentDate"
    );
    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
});

app.get("/show/doctor/appointments/:email", async (req, res) => {
  try {
    const { email } = req.params;

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
});

app.delete("/cancel/appointment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await PatientAppointment.findOneAndDelete({
      appointmentId: id,
    });
    const docAppointment = await DoctorAppointment.findOneAndDelete({
      appointmentId: id,
    });
    if (!appointment || !docAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/show/patient/picture/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const patient = await Patient.findOne({ email });
    if (patient) {
      res.status(200).json({ profilePic: patient.profilePic });
    } else {
      res.status(404).json({ message: "Patient not found." });
    }
  } catch (err) {
    console.error("Error fetching patient picture:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the picture." });
  }
});

// Route to fetch appointment history for a patient
app.get("/patient/history/appointments/:email", async (req, res) => {
  const { email } = req.params;

  try {
    // Find all appointments for the given patient email
    const appointments = await PatientHistory.find({ patientEmail: email });

    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointment history found." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointment history:", error);
    res.status(500).json({ message: "Error fetching appointment history." });
  }
});

app.get("/doctor/appointments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointments = await DoctorAppointment.find({ _id: id });

    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointment history found." });
    }
    // console.log(appointments);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointment history:", error);
    res.status(500).json({ message: "Error fetching appointment history." });
  }
});

app.get("/patients/pic/:email", async (req, res) => {
  const { patientEmail } = req.params;
  try {
    const patient = await Patient.find({
      patientEmail: patientEmail,
    }).select("profilePic");
    res.status(200).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch all appointments for a specific doctor
app.get("/doctor/history/appointments/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const doctorAppointments = await DoctorHistory.find({
      doctorEmail: email,
    });

    if (!doctorAppointments || doctorAppointments.length === 0) {
      return res.status(404).json({ message: "No appointment history found." });
    }

    const formattedAppointments = doctorAppointments.map((appointment) => ({
      patientName: appointment.patientName,
      date: appointment.appointmentDate.toLocaleDateString("en-GB"),
      time: appointment.appointmentTime,
      prescription: appointment.prescription,
      appointmentId: appointment.appointmentId,
    }));

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching doctor appointment history:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// POST route to handle prescription upload
app.put(
  "/uploads/prescriptions/:appointmentId",
  uploadPrescriptions.single("prescription"),
  async (req, res) => {
    const { appointmentId } = req.params; // Get appointmentId from the request body
    console.log(req.file);
    const prescriptionFilePath = req.file
      ? `uploads/prescriptions/${req.file.filename}`
      : null;

    if (!prescriptionFilePath) {
      return res
        .status(400)
        .json({ message: "No prescription file uploaded." });
    }

    try {
      // Find the appointment using the appointmentId
      const appointment = await DoctorHistory.findOne({
        appointmentId: appointmentId,
      });
      const patientAppointment = await PatientHistory.findOne({
        appointmentId: appointmentId,
      });
      if (!appointment || !patientAppointment) {
        return res.status(404).json({ message: "Appointment not found." });
      }

      // Update the appointment with the prescription URL
      appointment.prescription = prescriptionFilePath;
      patientAppointment.prescription = prescriptionFilePath;

      // Save the updated appointment
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
  }
);

// // Start the server
// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Set up Socket.IO
// const io = socketIo(server);

// // Example of a simple connection event
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Handle events from the client
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
