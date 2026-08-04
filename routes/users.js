const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

// https://api-node-iot.onrender.com/...........
// POST   /api/users/createUser
// GET    /api/users/getUsers
// GET    /api/users/getUserById/1
// PUT    /api/users/updateUser/1
// DELETE /api/users/deleteUser/1
router.post("/createUser", userController.createUser);
router.get("/getUsers", userController.getUsers);
router.get("/getUserById/:id", userController.getUserById);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);

module.exports = router;