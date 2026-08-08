const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

// https://api-node-iot.onrender.com/...........
// POST   /api/users/createUser
// //--{
//     "id": 1,
//     "houseNumber": "1",
//     "ownerName": "สมหมาย",
//     "username": "adaaaqqqqq",
//     "password": "1234",
//     "role": "resident",
//     "registerDate": "15/10/2026",
//     "memberStartDate": "15/10/2026",
//     "memberExpireDate": "15/11/2026"
// }
// --//
// GET    /api/users/getUsers
// GET    /api/users/getUserById/1
// GET    /api/users/getUserWithVehicles/1
// PUT    /api/users/updateUser/1
// DELETE /api/users/deleteUser/1
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