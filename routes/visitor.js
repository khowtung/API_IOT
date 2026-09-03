const express = require("express");

const router = express.Router();

const visitorController = require("../controllers/visitorController");


// ========================================
// Visitor เข้า / ออก
// ========================================

router.post(
    "/visitor",
    visitorController.visitorAccess
);


// ========================================
// ดูประวัติ Visitor
// ========================================

router.get(
    "/visitor/logs",
    visitorController.getVisitorLogs
);


module.exports = router;