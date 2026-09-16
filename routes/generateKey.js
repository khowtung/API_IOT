const express = require("express");
const router = express.Router();

const generateKeyController =
    require("../controllers/generateKeyController");

// POST /api/generate-key
// body
// {
//     "key_gen": "ABC123",
//     "state": "ACTIVE"
// }

// GET /api/generate-key
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
//     "state": "NON-ACTIVE"
// }



// GET - ดูทั้งหมด
router.get(
    "/generate-key",
    generateKeyController.getGenerateKeys
);


// POST - สร้าง Key
router.post(
    "/generate-key",
    generateKeyController.createGenerateKey
);


// PUT - เปลี่ยน State
router.put(
    "/generate-key/:key_gen",
    generateKeyController.updateGenerateKeyState
);


module.exports = router;