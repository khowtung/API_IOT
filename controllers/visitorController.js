const database = require("../database");

// *ไอริน* + *เกล*

// ==================================================
// POST /api/access/visitor
// Barcode ส่งเข้ามา
// รองรับ Grab + แขกลูกบ้าน
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


        // ==================================================
        // 1. ตรวจ Visitor ที่กำลังจะออกก่อน
        //
        // สำคัญ:
        // Barcode ของแขกสามารถหมดอายุระหว่างอยู่ข้างในได้
        // แต่ยังต้องอนุญาตให้ออก
        // ==================================================
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


        // ==================================================
        // พบ Visitor ที่กำลังออก
        // ==================================================
        if (exitVisitors.length > 0) {

            const visitor = exitVisitors[0];


            // ==========================================
            // หา Visitor Log ที่ยังไม่ได้ออก
            // ==========================================
            const [logs] = await database.query(
                `SELECT
                    id
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
                [logs[0].id]
            );


            // ==========================================
            // ถ้าเป็น Barcode ของลูกบ้าน
            // เปลี่ยนเป็น USED
            //
            // ถ้าเป็น Grab จะไม่มีข้อมูลใน
            // Visitor_Barcodes
            // ==========================================
            await database.query(
                `UPDATE Visitor_Barcodes
                 SET status = 'USED'
                 WHERE barcode = ?`,
                [barcode]
            );


            // ==========================================
            // ลบ Visitor runtime
            // ==========================================
            await database.query(
                `DELETE FROM Visitors
                 WHERE id = ?`,
                [visitor.id]
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


        // ==================================================
        // 2. ตรวจ Barcode ที่ลูกบ้านสร้างไว้
        // ==================================================
        const [savedBarcodes] = await database.query(
            `SELECT
                id,
                user_id,
                houseNumber,
                barcode,
                expireDate,
                status
             FROM Visitor_Barcodes
             WHERE barcode = ?
             LIMIT 1`,
            [barcode]
        );


        // ==================================================
        // ถ้า Barcode เคยถูกสร้างโดยลูกบ้าน
        // ==================================================
        if (savedBarcodes.length > 0) {

            const savedBarcode = savedBarcodes[0];


            // ==========================================
            // Barcode ถูกใช้หรือถูกยกเลิกแล้ว
            // ==========================================
            if (savedBarcode.status !== "ACTIVE") {

                return res.status(400).json({

                    success: false,

                    allowed: false,

                    message: "Visitor barcode is expired or already used"

                });
            }


            // ==========================================
            // ตรวจวันหมดอายุ
            // ==========================================
            const [expired] = await database.query(
                `SELECT id
                 FROM Visitor_Barcodes
                 WHERE id = ?
                 AND expireDate <= CURRENT_TIMESTAMP
                 LIMIT 1`,
                [savedBarcode.id]
            );


            if (expired.length > 0) {

                await database.query(
                    `UPDATE Visitor_Barcodes
                     SET status = 'EXPIRED'
                     WHERE id = ?`,
                    [savedBarcode.id]
                );


                return res.status(400).json({

                    success: false,

                    allowed: false,

                    message: "Visitor barcode has expired"

                });
            }
        }


        // ==================================================
        // 3. หา Visitor ที่กำลังรอ Barcode ตอนเข้า
        // ==================================================
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


        // ==================================================
        // ไม่พบ Visitor ที่รอ Barcode
        // ==================================================
        if (visitors.length === 0) {

            return res.status(400).json({

                success: false,

                allowed: false,

                message: "Barcode does not match visitor"

            });
        }


        const visitor = visitors[0];


        // ==================================================
        // 4. บันทึก Barcode + เวลาเข้า
        // ==================================================
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


        // ==================================================
        // 5. บันทึก Visitor Log
        // ==================================================
        await database.query(
            `INSERT INTO Visitor_Logs
            (
                barcode,
                licenseplate,
                province,
                time_in
            )
            VALUES
            (
                ?,
                ?,
                ?,
                CURRENT_TIMESTAMP
            )`,
            [
                barcode,
                visitor.licenseplate,
                visitor.province
            ]
        );


        // ==================================================
        // 6. อนุญาตให้เข้า
        //
        // Barcode ลูกบ้านยังคง ACTIVE
        // เพื่อใช้ตอนออก
        // ==================================================
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
                vl.id,
                vl.barcode,
                vb.houseNumber,
                vl.licenseplate,
                vl.province,

                DATE_FORMAT(
                    vl.time_in,
                    '%d/%m/%Y %H:%i:%s'
                ) AS time_in,

                DATE_FORMAT(
                    vl.time_out,
                    '%d/%m/%Y %H:%i:%s'
                ) AS time_out

             FROM Visitor_Logs vl

             LEFT JOIN Visitor_Barcodes vb
                ON vl.barcode = vb.barcode

             ORDER BY vl.id DESC`

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


// ==========================================
// ดึงข้อมูล Visitor ทั้งหมด
// ==========================================

exports.getVisitors = async (req, res) => {
    try {

        const [rows] = await database.query(
            `SELECT
                id,
                barcode,
                licenseplate,
                province,
                time_in,
                status
             FROM Visitors
             ORDER BY id DESC`
        );

        return res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error("[API Error] getVisitors:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};