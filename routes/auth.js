const express = require("express");
const router = express.Router();

//เรียกใช้จากโฟเดอร์ตามชื่อ
const authController = require("../controllers/authController");


// https://api-node-iot.onrender.com/...........
//POST   /api/auth/register
//POST  /api//auth/login

router.post("/register",authController.register);   
router.post("/login",authController.login);

module.exports = router;