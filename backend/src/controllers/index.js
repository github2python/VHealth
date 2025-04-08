const appointmentController = require("./appointmentController");
const patientController = require("./patientController");
const doctorController = require("./doctorController");
const historyController = require("./historyController");

// Export them all for easy access in your routes
module.exports = {
  appointmentController,
  patientController,
  doctorController,
  historyController,
};
