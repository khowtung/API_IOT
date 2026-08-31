const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

// https://api-node-iot.onrender.com/...........

// POST   /api/users/createUser
// {
//   "houseNumber": "67/1",
//   "ownerName": "supanat",
//   "role": "member",
//   "registerDate": "2026-08-11",
//   "memberStartDate": "2026-08-11",
//   "memberExpireDate": "2027-08-11"
// }
// ถ้าได้จะส่งtrueสร้างยูสใหม่พร้อมสร้างไอดี
// ชื่อยูสเซอร์ไม่ซ้ำ บ้านเลขที่ไม่ซ้ำ

// PUT    /api/users/updateUser/1
// เลือกอัพเดตจากไอดีbodyเหมือนpost ตอบ true/false

// DELETE /api/users/deleteUser/1
// เลือกลบจากไอดีได้เลย ตอบ true/false

// GET    /api/users/getUsers
// GET    /api/users/getUserById/1
// GET    /api/users/getUserWithVehicles/1
// อันนี้คือหารถทั้งหมดของบ้านเลขที่นั้นจาก id

router.post(
    "/createUser",
    userController.createUser
);

router.get(
    "/getUsers",
    userController.getUsers
);

router.get(
    "/getUserById/:id",
    userController.getUserById
);

router.get(
    "/getUserWithVehicles/:id",
    userController.getUserWithVehicles
);

router.put(
    "/updateUser/:id",
    userController.updateUser
);

router.delete(
    "/deleteUser/:id",
    userController.deleteUser
);

module.exports = router;