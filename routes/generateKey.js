const express = require("express");
const router = express.Router();

const generateKeyController = require("../controllers/generateKeyController");

// POST /api/createGenerateKey
// body
// {
//     "key_gen": "ABC123",
//     "state": "ACTIVE"
// }

// GET /api/generate-key/all
// response
// {
//     "success": true,
//     "data": [
//         {
//             "id": 1,
//             "key_gen": "ABC123",
//             "state": "ACTIVE",
//             "timestamp": "16/09/2026 10:00:00"
//         }
//     ]
// }

// PUT /api/generate-key/:key_gen
// body
// {
//     "state": "NON-ACTIVE",
//     "houseNumber": "124001"
// }



// GET - ดูทั้งหมด
router.get(
    "/generate-key/all",
    generateKeyController.getGenerateKeys
);


// POST - สร้าง Key
router.post(
    "/createGenerateKey",
    generateKeyController.createGenerateKey
);


// PUT - เปลี่ยน State
router.put(
    "/generate-key/:key_gen",
    generateKeyController.deactivateGenerateKey
);


module.exports = router;