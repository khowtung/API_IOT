const express = require("express");

const router = express.Router();

const vehicleController = require("../controllers/vehicleController");

// https://api-node-iot.onrender.com/...........

// POST   /api/vehicles/createVehicle
//  {
//     "user_id":17, ใส่ไอดีประจำตัวของลูกบ้านที่มันสร้างเองอะ
//     "plate":"กข1277",
//     "province":"ลำพูน",
//     "type":"Car",
//     "registerDate":"05/08/2026"
//  }
// 

// GET    /api/vehicles/getVehicles
// Response
// {
//     "success": true,
//     "message": "Get Vehicles Success",
//     "data": [
//         {
//             "id": 1,
//             "user_id": 1,
//             "ownerName": "สมหมาย ดีใจจังเลยที่มุดเลย",
//             "plate": "กข1234",
//             "province": "ลำพูน",
//             "type": "Car",
//             "registerDate": "05/08/2026"
//         }
// }
// อันนี้คือเอารถทั้งหมดทุกคันของลูกบ้านทุกคนในหมู่บ้านออกมาได้เลย

// GET    /api/vehicles/getVehicleById/1
// Response
// {
//     "success": true,
//     "message": "Get Vehicle Success",
//     "data": {
//         "id": 2,
//         "user_id": 1,
//         "ownerName": "สมหมาย ดีใจจังเลยที่มุดเลย",
//         "plate": "กข12",
//         "province": "ลำพูน",
//         "type": "Car",
//         "registerDate": "05/08/2026"
//     }
// }
// เอาแค่รถคันเดียวหาจากไอดีของรถได้เลย


// PUT    /api/vehicles/updateVehicle/1
// Body
// {
//     "plate": "กข99",
//     "province": "เชียงใหม่",
//     "type": "รถยนต์",
//     "user_id": 1 ,
//     "registerDate":"05/08/2026"
// }
// Response
// {
//     "success": true,
//     "message": "Vehicle updated successfully"
// }

// DELETE /api/vehicles/deleteVehicle/1
// Response
// {
//     "success": true,
//     "message": "Vehicle deleted successfully"
// }
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