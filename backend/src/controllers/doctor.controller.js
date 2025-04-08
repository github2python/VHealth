const Doctor = require("../models/Doctor");

const registerDoctor = async (req, res) => {
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
};

const getDoctorDetails = async (req, res) => {
  const { email } = req.params;

  try {
    const doctor = await Doctor.findOne({ doctorEmail: email }).select(
      "doctorEmail doctorName description profilePic rating isAvailable doctorDegrees"
    );

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfilePic = async (req, res) => {
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
};

const updateDescription = async (req, res) => {
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
};

const addDegree = async (req, res) => {
  const { email } = req.params;
  const { degree } = req.body;

  if (!degree || typeof degree !== "string" || degree.trim() === "") {
    return res.status(400).json({ error: "Invalid degree provided" });
  }

  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doctorEmail: email },
      { $addToSet: { doctorDegrees: degree.trim() } },
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
};

const removeDegree = async (req, res) => {
  const { email } = req.params;
  const { degree } = req.body;

  if (!degree || typeof degree !== "string" || degree.trim() === "") {
    return res.status(400).json({ error: "Invalid degree provided" });
  }

  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doctorEmail: email },
      { $pull: { doctorDegrees: degree.trim() } },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json({
      message: "Degree removed successfully",
      degrees: updatedDoctor.doctorDegrees,
    });
  } catch (err) {
    console.error("Error removing degree:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAvailability = async (req, res) => {
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
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch doctors." });
  }
};
