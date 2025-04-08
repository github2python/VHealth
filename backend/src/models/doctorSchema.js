const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    doctorEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          // Basic email validation regex
          return /^\S+@\S+\.\S+$/.test(email);
        },
        message: "Invalid email format",
      },
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      default: "", // URL or path to the profile picture
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500, // Limit description to 500 characters
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0, // Default rating
      validate: {
        validator: function (value) {
          return (
            Number.isInteger(value) ||
            Number(value).toFixed(1) === value.toString()
          );
        },
        message: "Rating must be a number between 0 and 5 (decimal or integer)",
      },
    },
    isAvailable: {
      type: Boolean,
      default: false, // Default availability status
    },
    doctorDegrees: {
      type: [String], // Array of strings to store multiple degrees
      default: [], // Default empty array
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create and export the model
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
