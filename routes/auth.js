const express = require("express");
const router = express.Router();

//เรียกใช้จากโฟเดอร์ตามชื่อ
const authController = require("../controllers/authController");


// https://api-node-iot.onrender.com/...........
//POST   /api/auth/register
// {
//   "houseNumber": "67/1",
//   "ownerName": "supanat",
//   "username": "supanat01",
//   "password": "123456",
//   "role": "member",
//   "registerDate": "2026-08-11",
//   "memberStartDate": "2026-08-11",
//   "memberExpireDate": "2027-08-11"
// }
// ตอบกลับด้วยtrue/false

//POST  /api//auth/login
// {
//   "username": "supanat01",
//   "password": "123456"
// }
// ตอบกลับด้วยtrue/false

router.post("/register",authController.register);   
router.post("/login",authController.login);

module.exports = router;