const Patient = require("../models/Patient");

// Register patient
exports.registerPatient = async (req, res) => {
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
};

// Get patient details
exports.getPatientDetails = async (req, res) => {
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
};

// Update patient profile picture
exports.updateProfilePicture = async (req, res) => {
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
};

// Get patient profile picture
exports.getPatientPicture = async (req, res) => {
  const { email } = req.params;

  try {
    const patient = await Patient.findOne({ email }).select("profilePic");

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json({ profilePic: patient.profilePic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
