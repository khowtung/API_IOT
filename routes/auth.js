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
// ตอบกลับด้วยtrue/false

//POST  /api/auth/login
// {
//   "username": "supanat01",
//   "password": "123456"
// }
// ตอบกลับด้วยtrue/false

// PUT /api/auth/updateAccount/1
// ตรง /1 ต้องเป็น Accounts.id ไม่ใช่ Users.id แต่ปกตแล้วก่อันเดียวกันเพราะ1บ้านมีแค่1users
// บอดี้เดียวกับlogin


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