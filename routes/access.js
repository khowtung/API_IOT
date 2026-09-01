const express = require("express");

const router = express.Router();

const accessController =
    require("../controllers/accessController");


// AI + ESP32
// https://api-node-iot.onrender.com/...........
// POST /api/access/vehicle
// body ที่aiจะส่งมาให้เพื่อเช็คว่ามีทะเบียนรถนี่หรือไม่ถ้ามีจะบัทึกLogแล้วส่งค่าคืนไปบอกว่าtrueเพื่อให้arduinoเปิดประตู
// {
//     "licenseplate": "กข1234",
//     "province": "ลำพูน"
// }
// พบรถจะส่งbodyกลับไปแบบนี้
// {
//     "success": true,
//     "allowed": true,
//     "action": "IN",
//     "message": "Vehicle Entry Success"
// }

router.post(
    "/vehicle",
    accessController.vehicleAccess
);


module.exports = router;