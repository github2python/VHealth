const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientEmail: {
      type: String,
      required: true,
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
    doctorEmail: {
      type: String,
      required: true,
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
    appointmentTime: {
      type: String,
      required: true,
      validate: {
        validator: function (time) {
          // Basic time validation in HH:MM format (24-hour clock)
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
        },
        message: "Invalid time format (expected HH:MM in 24-hour format)",
      },
    },
    appointmentDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (date) {
          return date instanceof Date && !isNaN(date);
        },
        message: "Invalid date format",
      },
    },
    appointmentId: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create and export the model
const PatientAppointment = mongoose.model(
  "PatientAppointment",
  appointmentSchema
);
module.exports = PatientAppointment;
