const database = require("../database");


// ==================================================
// POST /api/visitor-barcode/create
// ลูกบ้านสร้าง Barcode สำหรับแขก
// ==================================================
exports.createVisitorBarcode = async (req, res) => {

    try {

        const {
            user_id,
            barcode
        } = req.body;


        // ==========================================
        // ตรวจข้อมูล
        // ==========================================
        if (!user_id || !barcode) {

            return res.status(400).json({
                success: false,
                message: "user_id and barcode are required"
            });
        }


        // ==========================================
        // ตรวจ User + ดึง houseNumber
        // ==========================================
        const [users] = await database.query(
            `SELECT
                id,
                houseNumber
             FROM Users
             WHERE id = ?
             LIMIT 1`,
            [user_id]
        );


        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        const user = users[0];


        // ==========================================
        // ตรวจ Barcode ซ้ำ
        // ==========================================
        const [existingBarcode] = await database.query(
            `SELECT
                id,
                user_id,
                barcode,
                status
             FROM Visitor_Barcodes
             WHERE barcode = ?
             LIMIT 1`,
            [barcode]
        );


        if (existingBarcode.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Barcode already exists"
            });
        }


        // ==========================================
        // สร้าง Barcode
        //
        // expireDate =
        // Server Time + 24 ชั่วโมง
        // ==========================================
        const [result] = await database.query(
            `INSERT INTO Visitor_Barcodes
            (
                user_id,
                houseNumber,
                barcode,
                expireDate,
                status
            )
            VALUES
            (
                ?,
                ?,
                ?,
                DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 HOUR),
                'ACTIVE'
            )`,
            [
                user_id,
                user.houseNumber,
                barcode
            ]
        );


        // ==========================================
        // ดึงข้อมูลที่สร้างจริงจาก Server
        // ==========================================
        const [createdBarcode] = await database.query(
            `SELECT
                id,
                user_id,
                houseNumber,
                barcode,
                expireDate,
                status,
                created_at
             FROM Visitor_Barcodes
             WHERE id = ?
             LIMIT 1`,
            [result.insertId]
        );


        return res.json({

            success: true,

            message: "Visitor barcode created successfully",

            data: createdBarcode[0]

        });


    } catch (error) {

        console.error("CREATE VISITOR BARCODE ERROR");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



// ==================================================
// GET /api/visitor-barcode/latest/:user_id
// ดึง Barcode ล่าสุดที่ยังไม่หมดอายุ
// ==================================================
exports.getLatestVisitorBarcode = async (req, res) => {

    try {

        const { user_id } = req.params;


        // ==========================================
        // เปลี่ยน Barcode ที่หมดอายุ
        // ==========================================
        await database.query(
            `UPDATE Visitor_Barcodes
             SET status = 'EXPIRED'
             WHERE user_id = ?
             AND status = 'ACTIVE'
             AND expireDate <= CURRENT_TIMESTAMP`,
            [user_id]
        );


        // ==========================================
        // หา Barcode ล่าสุดที่ยัง Active
        // ==========================================
        const [rows] = await database.query(
            `SELECT
                id,
                user_id,
                houseNumber,
                barcode,
                expireDate,
                status,
                created_at
             FROM Visitor_Barcodes
             WHERE user_id = ?
             AND status = 'ACTIVE'
             AND expireDate > CURRENT_TIMESTAMP
             ORDER BY created_at DESC, id DESC
             LIMIT 1`,
            [user_id]
        );


        // ==========================================
        // ไม่มี Barcode
        // ==========================================
        if (rows.length === 0) {

            return res.json({

                success: true,

                exists: false,

                message: "No active visitor barcode"

            });
        }


        // ==========================================
        // พบ Barcode
        // ==========================================
        return res.json({

            success: true,

            exists: true,

            data: rows[0]

        });


    } catch (error) {

        console.error("GET VISITOR BARCODE ERROR");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



// ==================================================
// DELETE /api/visitor-barcode/:barcode
// ยกเลิก Barcode
// ==================================================
exports.cancelVisitorBarcode = async (req, res) => {

    try {

        const { barcode } = req.params;


        // ==========================================
        // ตรวจ Barcode
        // ==========================================
        const [rows] = await database.query(
            `SELECT
                id,
                status
             FROM Visitor_Barcodes
             WHERE barcode = ?
             AND status = 'ACTIVE'
             LIMIT 1`,
            [barcode]
        );


        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Active visitor barcode not found"
            });
        }


        // ==========================================
        // เปลี่ยนเป็น EXPIRED
        // ==========================================
        await database.query(
            `UPDATE Visitor_Barcodes
             SET status = 'EXPIRED'
             WHERE barcode = ?`,
            [barcode]
        );


        return res.json({

            success: true,

            message: "Visitor barcode cancelled successfully"

        });


    } catch (error) {

        console.error("CANCEL VISITOR BARCODE ERROR");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};