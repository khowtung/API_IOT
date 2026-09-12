const express = require("express");

const router = express.Router();

const accessController =
    require("../controllers/accessController");

// *มอส*

// AI + ESP32
// https://api-node-iot.onrender.com/...........
// POST /api/access/vehicle
// body ที่aiจะส่งมาให้เพื่อเช็คว่ามีทะเบียนรถนี่หรือไม่ถ้ามีจะบัทึกLogแล้วส่งค่าคืนไปบอกว่าtrueเพื่อให้arduinoเปิดประตู
// {
//     "licenseplate": "กข1234",
//     "province": "ลำพูน"
// }
// กณีที่1รถลูกบ้านเข้าพบทะเบียนอยู่ในฐานข้อมูล
// Response
// {
//     "success": true, 
//     "allowed": true, => ตัวนี้คือตัวtrueที่ส่งไปให้เพื่อเปิดประตู Espจะเห็นตรงนี้เองเพื่อเปิดประตู
//     "action": "IN", => ตัวนี้คือบอกว่าเป็นการเข้า
//     "message": "Vehicle Entry Success"
// }
// กณีที่2รถลูกบ้านออกพบทะเบียนอยู่ในฐานข้อมูล
// Response
// {
//     "success": true,
//     "allowed": true,
//     "action": "OUT",
//     "message": "Vehicle Exit Success"
// }
// กรณีที่3คนนอกเข้ามาเจอทะเบียนไม่อยู่ในฐานข้อมูล
// {
//     "success": true,
//     "allowed": false, => ตัวนี้คือตัวfalseที่ส่งไปให้เพื่อไม่ให้เปิดประตู Espจะเห็นตรงนี้เองเพื่อไม่ให้เปิดประตู
//     "needBarcode": true, => ตัวนี้คือบอกว่าให้ไปสแกนบาร์โค้ดเพื่อยืนยันตัวตน
//     "action": "WAITING_IN", => ตัวนี้คือบอกว่ากำลังรอการสแกนบาร์โค้ดจะส่งค่าทั้งหมดเข้าไปเก็บในvisitorรอไว้ัทั้งหมดของbodyAI
//     "message": "Visitor detected. Please scan barcode"
// }
// กรณีที่4คนนอกออกจะเจอทะเบียนในvisitorสถานะอยู่ข้างในอยู่
// Response
// {
//     "success": true,
//     "allowed": false, => ตัวนี้คือตัวfalseที่ส่งไปให้เพื่อไม่ให้เปิดประตู Espจะเห็นตรงนี้เองเพื่อไม่ให้เปิดประตู
//     "needBarcode": true, => ตัวนี้คือบอกว่าให้ไปสแกนบาร์โค้ดเพื่อยืนยันตัวตน
//     "action": "WAITING_OUT", => ตัวนี้คือบอกว่ากำลังรอการสแกนบาร์โค้ดเพื่อออก
//     "message": "Visitor detected. Please scan barcode to exit"
// }

router.post(
    "/vehicle",
    accessController.vehicleAccess
);


module.exports = router;