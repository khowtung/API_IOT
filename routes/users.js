const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

// https://api-node-iot.onrender.com/...........

// POST   /api/users/createUser
// {
//     "houseNumber": "101",
//     "ownerName": "สมชาย ใจดี",
//     "registerDate": "03/09/2026",
//     "memberStartDate": "03/09/2026",
//     "memberExpireDate": "03/09/2027",
//     "role": "resident"
// }
// Response
// {
//     "success": true,
//     "message": "User created successfully",
//     "id": 1
// }
// ถ้าได้จะส่งtrueสร้างยูสใหม่พร้อมสร้างไอดีใหม่
// ชื่อยูสเซอร์ไม่ซ้ำ บ้านเลขที่ไม่ซ้ำ


// PUT    /api/users/updateUser/1
// body
// {
//     "houseNumber": "102", สมมมุติอัพเดตบ้านเลขที่
//     "ownerName": "สมชาย ใจดี",
//     "registerDate": "03/09/2026",
//     "memberStartDate": "03/09/2026",
//     "memberExpireDate": "03/09/2028",
//     "role": "resident"
// }
// Response
// {
//     "success": true,
//     "message": "User updated successfully"
// }

// DELETE /api/users/deleteUser/1
// เลือกลบจากไอดีได้เลย ตอบ true/false

// GET    /api/users/getUsers
// Response
// {
//     "success": true,
//     "data": [
//         {
//             "id": 1,
//             "houseNumber": "101",
//             "ownerName": "สมชาย ใจดี",
//             "registerDate": "03/09/2026",
//             "memberStartDate": "03/09/2026",
//             "memberExpireDate": "03/09/2027",
//             "role": "resident"
//         }
//     ]
// }
// GET    /api/users/getUserById/1
// เหมือนfetปกติเลยแต่แค่เพิ่มidเข้าไปเพื่ค้นหาได้
// ==========================================================================
// ไม่ได้ใช้
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