const express = require("express");

const router = express.Router();

const logController = require("../controllers/logController");

// https://api-node-iot.onrender.com/...........

// GET /api/logs/getLogsById/:id
// เอาไว้ดูเวลาการเข้าออกของรถแต่ละคันจากไอดีของรถได้ตามข้างล่างเดะ
// Reponse
// {
//     "success": true,
//     "data": {
//         "id": 1,
//         "vehicle_id": 1,
//         "plate": "กข12",
//         "province": "ลำพูน",
//         "time_in": "03/09/2026 15:20:10",
//         "time_out": "03/09/2026 17:30:22"
//     }
// }
// GET /api/logs/getLogs
// เอาไว้ดูเวลาการเข้าออกของรถทุกคันในประเทศศุภณัฐ
// Reponse
// {
//     "success": true,
//     "data": [
//         {
//             "id": 1,
//             "vehicle_id": 1,
//             "plate": "กข12",
//             "province": "ลำพูน",
//             "time_in": "03/09/2026 15:20:10",
//             "time_out": "03/09/2026 17:30:22"
//         }
//     ]
// }




router.get(
    "/getLogsById/:id",
    logController.getLogsById
);

router.get(
    "/getLogs",
    logController.getLogs
);

module.exports = router;