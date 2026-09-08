const express = require("express");
const router = express.Router();

//เรียกใช้จากโฟเดอร์ตามชื่อ
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");


// https://api-node-iot.onrender.com/...........

//POST   /api/auth/register
// {
//     "user_id": 5,
//     "username": "user01",
//     "password": "123456"
// }
// Response
// {
//     "success": true,
//     "message": "Register success"
// }
// ต้องกรอกข้อมูลของการสร้างไอดียูสเซอร์มาก่อนเพื่อที่จะได้ไอดียูสเซอร์อ้างอิงมาก่อนถึงจะregisterได้

//POST  /api/auth/login
// {
//   "username": "supanat01",
//   "password": "123456"
// }
// Response
// {
//     "success": true,
//     "message": "Login success",
//     "token": "JWT_TOKEN",
//     "id": 1
// }

// PUT /api/auth/updateAccount/1
// ฺBody
// {
//     "username": "somchai01",
//     "password": "newpassword123"
// }
// Response
// {
//     "success": true,
//     "message": "Account updated successfully"
// }
// ตรง /1 ต้องเป็น Accounts.id ไม่ใช่ Users.id แต่ปกตแล้วก่อันเดียวกันเพราะ1บ้านมีแค่1users



router.post(
    "/register",
    authController.register
);


router.post(
    "/login",
    authController.login
);

router.put(
    "/updateAccount/:id",
    authController.updateAccount
);

router.get(
    "/me",
    authMiddleware.verifyToken,
    authController.getMe
);

module.exports = router;