const express = require("express");

const router = express.Router();

const logController = require("../controllers/logController");

// https://api-node-iot.onrender.com/...........
// POST /api/logs/carEntry
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

// GET /api/logs/getLogs
// เอาไว้ดูเวลาการเข้าออกของรถแต่ละคันทั้งหมด

router.post(
    "/carEntry",
    logController.carEntry
);


router.get(
    "/getLogs",
    logController.getLogs
);

module.exports = router;