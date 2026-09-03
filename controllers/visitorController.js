const database = require("../database");

// ==================================================
// POST /api/access/visitor
// Barcode ส่งเข้ามา
// ==================================================
exports.visitorAccess = async (req, res) => {

    try {

        const { barcode } = req.body;

        // ==========================================
        // ตรวจข้อมูล
        // ==========================================
        if (!barcode) {
            return res.status(400).json({
                success: false,
                allowed: false,
                message: "barcode is required"
            });
        }

        console.log("Barcode :", barcode);

        // ==========================================
        // 1. ตรวจว่า Barcode นี้มีคนใช้อยู่แล้วหรือไม่
        // ==========================================
        const [usedBarcode] = await database.query(
            `SELECT id
             FROM Visitors
             WHERE barcode = ?
             LIMIT 1`,
            [barcode]
        );

        // ==========================================
        // ถ้า Barcode นี้กำลังใช้งานอยู่
        // ==========================================
        if (usedBarcode.length > 0) {

            // ไม่ return ทันที
            // เพราะอาจเป็น Visitor ที่กำลังออก
            // เราจะตรวจ status ต่อด้านล่าง
        }

        // ==========================================
        // 2. ตรวจ Visitor ที่กำลังจะออก
        // ==========================================
        const [exitVisitors] = await database.query(
            `SELECT
                id,
                barcode,
                licenseplate,
                province
             FROM Visitors
             WHERE status = 'WAITING_EXIT_BARCODE'
             AND barcode = ?
             LIMIT 1`,
            [barcode]
        );

        // ==========================================
        // พบ Visitor ที่กำลังออก
        // ==========================================
        if (exitVisitors.length > 0) {

            const visitor = exitVisitors[0];

            // ==========================================
            // หา Visitor Log ที่ยังไม่ได้ออก
            // ==========================================
            const [logs] = await database.query(
                `SELECT id
                 FROM Visitor_Logs
                 WHERE barcode = ?
                 AND licenseplate = ?
                 AND province = ?
                 AND time_out IS NULL
                 ORDER BY time_in DESC
                 LIMIT 1`,
                [
                    visitor.barcode,
                    visitor.licenseplate,
                    visitor.province
                ]
            );

            // ==========================================
            // ไม่พบ Log
            // ==========================================
            if (logs.length === 0) {

                return res.status(400).json({
                    success: false,
                    allowed: false,
                    message: "Visitor log not found"
                });
            }

            // ==========================================
            // บันทึกเวลาออก
            // ==========================================
            await database.query(
                `UPDATE Visitor_Logs
                 SET time_out = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [
                    logs[0].id
                ]
            );

            // ==========================================
            // ลบ Visitor หลังออกสำเร็จ
            // ==========================================
            await database.query(
                `DELETE FROM Visitors
                 WHERE id = ?`,
                [
                    visitor.id
                ]
            );

            // ==========================================
            // อนุญาตให้ออก
            // ==========================================
            return res.json({
                success: true,
                allowed: true,
                action: "OUT",
                message: "Visitor Exit Success"
            });
        }

        // ==========================================
        // 3. หา Visitor ที่กำลังรอ Barcode ตอนเข้า
        // ==========================================
        const [visitors] = await database.query(
            `SELECT
                id,
                licenseplate,
                province
             FROM Visitors
             WHERE status = 'WAITING_BARCODE'
             AND barcode IS NULL
             ORDER BY id DESC
             LIMIT 1`
        );

        // ==========================================
        // ไม่พบ Visitor ที่รอ Barcode
        // ==========================================
        if (visitors.length === 0) {

            return res.status(400).json({
                success: false,
                allowed: false,
                message: "Barcode does not match visitor"
            });
        }

        const visitor = visitors[0];

        // ==========================================
        // 4. บันทึกเวลาเข้า + Barcode
        // ==========================================
        await database.query(
            `UPDATE Visitors
             SET barcode = ?,
                 time_in = CURRENT_TIMESTAMP,
                 status = 'INSIDE'
             WHERE id = ?`,
            [
                barcode,
                visitor.id
            ]
        );

        // ==========================================
        // 5. เก็บประวัติลง Visitor_Logs
        // ==========================================
        await database.query(
            `INSERT INTO Visitor_Logs
             (
                 barcode,
                 licenseplate,
                 province,
                 time_in
             )
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
            [
                barcode,
                visitor.licenseplate,
                visitor.province
            ]
        );

        // ==========================================
        // 6. อนุญาตให้เข้า
        // ==========================================
        return res.json({
            success: true,
            allowed: true,
            action: "IN",
            message: "Visitor Entry Success"
        });

    } catch (error) {

        console.error("VISITOR ACCESS ERROR");
        console.error(error);

        return res.status(500).json({
            success: false,
            allowed: false,
            message: "Server Error"
        });
    }
};


// ========================================
// ดูประวัติ Visitor
// GET /api/access/visitor/logs
// ========================================
exports.getVisitorLogs = async (req, res) => {

    try {

        const [rows] = await database.query(
            `SELECT
                id,
                barcode,
                licenseplate,
                province,
                DATE_FORMAT(time_in, '%d/%m/%Y %H:%i:%s') AS time_in,
                DATE_FORMAT(time_out, '%d/%m/%Y %H:%i:%s') AS time_out
             FROM Visitor_Logs
             ORDER BY id DESC`
        );

        return res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};