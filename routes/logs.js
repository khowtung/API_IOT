const express = require("express");

const router = express.Router();

const logController = require("../controllers/logController");

// https://api-node-iot.onrender.com/...........
// POST /api/logs/carEntry *ตัวนี้ไม่ได้ใช้แล้วเปลี่ยนไปเป็นaccess*
// ครั้งแรกการส่งเป็นการเข้า
// {
//     "licenseplate": "กข1234",
//     "province": "ลำพูน",
//     "camera": "Gate1",
//     "time": "2026-08-25 15:30:00"
// }
// ถ้าส่งจากaiมาอีกรอบของป้ายทะเบียนเดิมจะนับเป็นการออก
// {
//     "licenseplate": "กข1234",
//     "province": "ลำพูน",
//     "camera": "Gate1",
//     "time": "2026-08-25 15:30:00"
// }

// GET /api/logs/getLogsById/:id
// เอาไว้ดูเวลาการเข้าออกของรถแต่ละคันจากไอดีของรถได้ตามข้างล่างเดะ
// {
//     "success": true,
//     "data": [
//         {
//             "vehicle_id": 1,
//             "plate": "กข1234",
//             "type": "Car",
//             "camera_in": "Gate1",
//             "time_in": "2026-08-25T08:30:00.000Z",
//             "camera_out": "Gate2",
//             "time_out": "2026-08-25T12:00:00.000Z"
//         }
//     ]
// }
// GET /api/logs/getLogs
// เอาไว้ดูเวลาการเข้าออกของรถทุกคันในประเทศศุภณัฐ

// router.post(
//     "/carEntry",
//     logController.carEntry
// );


router.get(
    "/getLogsById/:id",
    logController.getLogsById
);

router.get(
    "/getLogs",
    logController.getLogs
);

module.exports = router;