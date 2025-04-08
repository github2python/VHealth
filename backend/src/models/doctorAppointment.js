const mongoose = require("mongoose");

const doctorAppointmentSchema = new mongoose.Schema(
  {
    doctorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          return /^\S+@\S+\.\S+$/.test(email); // Basic email validation
        },
        message: "Invalid email format",
      },
    },
    patientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          return /^\S+@\S+\.\S+$/.test(email); // Basic email validation
        },
        message: "Invalid email format",
      },
    },
    patientName: {
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
const DoctorAppointment = mongoose.model(
  "DoctorAppointment",
  doctorAppointmentSchema
);
module.exports = DoctorAppointment;
