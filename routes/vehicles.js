const express = require("express");

const router = express.Router();

const vehicleController = require("../controllers/vehicleController");

// https://api-node-iot.onrender.com/...........
// POST   /api/vehicles/createVehicle
//--{
//     "user_id":17, ใส่ไอดีประจำตัวของลูกบ้านที่มันสร้างเองอะ
//     "plate":"กข1277",
//     "province":"ลำพูน",
//     "type":"Car",
//     "registerDate":"05/08/2026"
// }
// --//

// GET    /api/vehicles/getVehicles
// GET    /api/vehicles/getVehicleById/1

// PUT    /api/vehicles/updateVehicle/1
// เลือกอัพเดตจากไอดีbodyเหมือนpost ตอบ true/false

// DELETE /api/vehicles/deleteVehicle/1
// เลือกลบจากไอดีได้เลย ตอบ true/false

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