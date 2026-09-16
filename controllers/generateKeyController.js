const database = require("../database");


// ==================================================
// POST /api/generate-key
// รับ Key จากเพื่อน
// ==================================================
exports.createGenerateKey = async (req, res) => {

    try {

        const {
            key_gen,
            state
        } = req.body;


        // ==========================================
        // ตรวจข้อมูล
        // ==========================================
        if (!key_gen || !state) {

            return res.status(400).json({
                success: false,
                message: "key_gen and state are required"
            });
        }


        // ==========================================
        // ตรวจ State
        // ==========================================
        if (
            state !== "ACTIVE" &&
            state !== "NON-ACTIVE"
        ) {

            return res.status(400).json({
                success: false,
                message: "state must be ACTIVE or NON-ACTIVE"
            });
        }


        // ==========================================
        // ตรวจ Key ซ้ำ
        // ==========================================
        const [existingKey] = await database.query(
            `SELECT id
             FROM Generate_Keys
             WHERE key_gen = ?
             LIMIT 1`,
            [key_gen]
        );


        if (existingKey.length > 0) {

            return res.status(400).json({
                success: false,
                message: "key_gen already exists"
            });
        }


        // ==========================================
        // สร้าง Key
        //
        // timestamp = Server Time
        // ==========================================
        const [result] = await database.query(
            `INSERT INTO Generate_Keys
            (
                key_gen,
                state
            )
            VALUES (?, ?)`,
            [
                key_gen,
                state
            ]
        );


        // ==========================================
        // ดึงข้อมูลกลับ
        // ==========================================
        const [rows] = await database.query(
            `SELECT
                id,
                key_gen,
                state,
                DATE_FORMAT(
                    timestamp,
                    '%d/%m/%Y %H:%i:%s'
                ) AS timestamp
             FROM Generate_Keys
             WHERE id = ?
             LIMIT 1`,
            [result.insertId]
        );


        return res.json({

            success: true,

            message: "Generate key created successfully",

            data: rows[0]

        });


    } catch (error) {

        console.error("CREATE GENERATE KEY ERROR");
        console.error(error);

        // ==========================================
        // กรณี Key ซ้ำจาก Database UNIQUE
        // ==========================================
        if (error.code === "ER_DUP_ENTRY") {

            return res.status(400).json({
                success: false,
                message: "key_gen already exists"
            });
        }


        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



// ==================================================
// GET /api/generate-key
// ดึงข้อมูลทั้งหมด
// ==================================================
exports.getGenerateKeys = async (req, res) => {

    try {

        // ==========================================
        // ตรวจ Key ที่ ACTIVE
        // เกิน 10 นาที
        // ==========================================
        await database.query(
            `UPDATE Generate_Keys
             SET state = 'NON-ACTIVE'
             WHERE state = 'ACTIVE'
             AND timestamp <= CURRENT_TIMESTAMP - INTERVAL 10 MINUTE`
        );


        // ==========================================
        // ดึงข้อมูลทั้งหมด
        // ==========================================
        const [rows] = await database.query(
            `SELECT
                id,
                key_gen,
                state,
                DATE_FORMAT(
                    timestamp,
                    '%d/%m/%Y %H:%i:%s'
                ) AS timestamp
             FROM Generate_Keys
             ORDER BY id DESC`
        );


        return res.json({

            success: true,

            data: rows

        });


    } catch (error) {

        console.error("GET GENERATE KEYS ERROR");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



// ==================================================
// PUT /api/generate-key/:key_gen
// เปลี่ยน State
// ==================================================
exports.updateGenerateKeyState = async (req, res) => {

    try {

        const { key_gen } = req.params;

        const { state } = req.body;


        // ==========================================
        // ตรวจ State
        // ==========================================
        if (!state) {

            return res.status(400).json({
                success: false,
                message: "state is required"
            });
        }


        if (
            state !== "ACTIVE" &&
            state !== "NON-ACTIVE"
        ) {

            return res.status(400).json({
                success: false,
                message: "state must be ACTIVE or NON-ACTIVE"
            });
        }


        // ==========================================
        // ตรวจ Key
        // ==========================================
        const [existingKey] = await database.query(
            `SELECT id
             FROM Generate_Keys
             WHERE key_gen = ?
             LIMIT 1`,
            [key_gen]
        );


        if (existingKey.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Generate key not found"
            });
        }


        // ==========================================
        // เปลี่ยน State
        // ==========================================
        await database.query(
            `UPDATE Generate_Keys
             SET state = ?
             WHERE key_gen = ?`,
            [
                state,
                key_gen
            ]
        );


        // ==========================================
        // ดึงข้อมูลล่าสุด
        // ==========================================
        const [rows] = await database.query(
            `SELECT
                id,
                key_gen,
                state,
                DATE_FORMAT(
                    timestamp,
                    '%d/%m/%Y %H:%i:%s'
                ) AS timestamp
             FROM Generate_Keys
             WHERE key_gen = ?
             LIMIT 1`,
            [key_gen]
        );


        return res.json({

            success: true,

            message: "Generate key state updated successfully",

            data: rows[0]

        });


    } catch (error) {

        console.error("UPDATE GENERATE KEY ERROR");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};