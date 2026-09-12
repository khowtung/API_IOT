const express = require("express");
const router = express.Router();

const visitorBarcodeController =
    require("../controllers/visitorBarcodeController");
    

// *พี่เกล* 

// | Method | URL                                    | หน้าที่         |
// | ------ | -------------------------------------- | --------------- |
// | POST   | `/api/visitor-barcode/create`          | ลูกบ้านสร้าง QR |
// Body
// {
//     "user_id": 1,
//     "barcode": "HOME001"
// }
// Response
// {
//     "success": true,
//     "message": "Visitor barcode created successfully",
//     "data": {
//         "id": 1,
//         "user_id": 1,
//         "houseNumber": "101",
//         "barcode": "HOME001",
//         "expireDate": "2026-09-13 15:00:00",
//         "status": "ACTIVE",
//         "created_at": "2026-09-12 15:00:00"
//     }
// }


// | GET    | `/api/visitor-barcode/latest/:user_id` | เช็ก QR ล่าสุด  |
// response
// {
//     "success": true,
//     "exists": true,
//     "data": {
//         "id": 1,
//         "user_id": 1,
//         "houseNumber": "101",
//         "barcode": "HOME001",
//         "expireDate": "2026-09-13 15:00:00",
//         "status": "ACTIVE",
//         "created_at": "2026-09-12 15:00:00"
//     }
// }


// | DELETE | `/api/visitor-barcode/:barcode`        | ยกเลิก QR       |
// response
// {
//     "success": true,
//     "message": "Visitor barcode cancelled successfully"
// }


// ==========================================
// สร้าง Barcode
// ==========================================
router.post(
    "/visitor-barcode/create",
    visitorBarcodeController.createVisitorBarcode
);


// ==========================================
// ดึง Barcode ล่าสุด
// ==========================================
router.get(
    "/visitor-barcode/latest/:user_id",
    visitorBarcodeController.getLatestVisitorBarcode
);


// ==========================================
// ยกเลิก Barcode
// ==========================================
router.delete(
    "/visitor-barcode/:barcode",
    visitorBarcodeController.cancelVisitorBarcode
);


module.exports = router;