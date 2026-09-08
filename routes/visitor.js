const express = require("express");

const router = express.Router();

const visitorController = require("../controllers/visitorController");


// POST /api/access/visitor
// กรณีเข้าของคนนอก
// Body
// {
//     "barcode": "VIS001"
// }
// ระบบจะส่งต่อมาจากกรณีที่3แล้วให้บังคับสแกนBarcodeเพื่อที่จะเข้าไปแล้วเก็บข้อมูลบาร์โค้ดนี่ไว้แล้วtimestamp
// Response
// {
//     "success": true,
//     "allowed": true, => ตัวนี้คือตัวtrueที่ส่งไปให้เพื่อเปิดประตู Espจะเห็นตรงนี้เองเพื่อเปิดประตู
//     "action": "IN", => ตัวนี้คือบอกว่าเป็นการเข้า
//     "message": "Visitor Entry Success"
// }
// กรณีออกของคนนอกAIจะตรวจทะเบียนก่อนตลอดเพื่อเช็คมาจากกรณีที่4ของAIแล้วบังคับให้สแกนบาร์โค้ดแล้วสุดท้ายจะลบทั้งหมดแต่จะสำรองไปในlogเพื่อเอาข้อมูลไปแสดง
// Body
// {
//     "barcode": "VIS001"
// }
// Response
// {
//     "success": true,
//     "allowed": true,
//     "action": "OUT",
//     "message": "Visitor Exit Success"
// }

// GET /api/access/visitor/logs
// Response
// {
//     "success": true,
//     "data": [
//         {
//             "id": 1,
//             "barcode": "VIS001",
//             "licenseplate": "กข12",
//             "province": "ลำพูน",
//             "time_in": "03/09/2026 15:20:10",
//             "time_out": "03/09/2026 17:30:22"
//         }
//     ]
// }





// ========================================
// Visitor เข้า / ออก
// ========================================

router.post(
    "/visitor",
    visitorController.visitorAccess
);


// ========================================
// ดูประวัติ Visitor
// ========================================

router.get(
    "/visitor/logs",
    visitorController.getVisitorLogs
);


module.exports = router;