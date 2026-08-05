const express = require("express");

const router = express.Router();

const vehicleController = require("../controllers/vehicleController");

// =============================
// CREATE
// =============================
router.post(
    "/createVehicle",
    vehicleController.createVehicle
);

// =============================
// READ ALL
// =============================
router.get(
    "/getVehicles",
    vehicleController.getVehicles
);

// =============================
// READ BY ID
// =============================
router.get(
    "/getVehicleById/:id",
    vehicleController.getVehicleById
);

// =============================
// UPDATE
// =============================
router.put(
    "/updateVehicle/:id",
    vehicleController.updateVehicle
);

// =============================
// DELETE
// =============================
router.delete(
    "/deleteVehicle/:id",
    vehicleController.deleteVehicle
);

module.exports = router;