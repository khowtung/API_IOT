const express = require("express");

const router = express.Router();

const visitorController =
    require("../controllers/visitorController");


// ==================================================
// Barcode Visitor
// ==================================================

router.post(
    "/barcode",
    visitorController.barcodeAccess
);

router.get(
    "/barcode/logs",
    visitorController.getVisitorLogs
);


module.exports = router;