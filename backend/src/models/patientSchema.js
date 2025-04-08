const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      default: "abcd", // You can use a default placeholder image URL if needed
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Export the model
module.exports = mongoose.model("Patient", patientSchema);
