const database = require("../database");


// ==================================================
// POST /api/access/barcode
// Barcode Visitor เข้า / ออก
// ==================================================

exports.barcodeAccess = async (req, res) => {

    try {

        const {
            barcode,
            type
        } = req.body;


        // ==========================================
        // ตรวจข้อมูล
        // ==========================================

        if (!barcode) {

            return res.status(400).json({

                success: false,
                allowed: false,
                message: "Barcode is required"

            });

        }


        // ==========================================
        // ตรวจว่า Barcode กำลังอยู่ในหมู่บ้านไหม
        // ==========================================

        const [visitors] = await database.query(

            `SELECT
                id,
                barcode,
                type,
                time_in

             FROM Visitors

             WHERE barcode = ?

             LIMIT 1`,

            [barcode]

        );


        // ==================================================
        // ไม่พบ Barcode
        // = Visitor กำลังเข้า
        // ==================================================

        if (visitors.length === 0) {

            await database.query(

                `INSERT INTO Visitors
                (
                    barcode,
                    type,
                    time_in
                )

                VALUES (?, ?, CURRENT_TIMESTAMP)`,

                [
                    barcode,
                    type || "Visitor"
                ]

            );


            // เก็บประวัติการเข้า

            await database.query(

                `INSERT INTO Visitor_Logs
                (
                    barcode,
                    type,
                    time_in
                )

                VALUES (?, ?, CURRENT_TIMESTAMP)`,

                [
                    barcode,
                    type || "Visitor"
                ]

            );


            return res.json({

                success: true,

                allowed: true,

                action: "IN",

                message: "Visitor Entry Success"

            });

        }


        // ==================================================
        // พบ Barcode
        // = Visitor กำลังออก
        // ==================================================

        const visitor = visitors[0];


        // หา Log ล่าสุดที่ยังไม่มีเวลาออก

        const [logs] = await database.query(

            `SELECT
                id

             FROM Visitor_Logs

             WHERE barcode = ?

             AND time_out IS NULL

             ORDER BY time_in DESC

             LIMIT 1`,

            [barcode]

        );


        if (logs.length > 0) {

            await database.query(

                `UPDATE Visitor_Logs

                 SET time_out = CURRENT_TIMESTAMP

                 WHERE id = ?`,

                [logs[0].id]

            );

        }


        // ==================================================
        // ลบ Barcode ออกจาก Active Visitor
        // ==================================================

        await database.query(

            `DELETE FROM Visitors

             WHERE id = ?`,

            [visitor.id]

        );


        return res.json({

            success: true,

            allowed: true,

            action: "OUT",

            message: "Visitor Exit Success"

        });

    }


    catch (error) {

        console.error(
            "[API Error] barcodeAccess:",
            error
        );


        return res.status(500).json({

            success: false,

            allowed: false,

            message: "Server Error"

        });

    }

};


// ==================================================
// GET /api/access/barcode/logs
// ดูประวัติ Visitor
// ==================================================

exports.getVisitorLogs = async (req, res) => {

    try {

        const [rows] = await database.query(`

            SELECT
                id,
                barcode,
                type,

                DATE_FORMAT(
                    time_in,
                    '%d/%m/%Y %H:%i:%s'
                ) AS time_in,

                DATE_FORMAT(
                    time_out,
                    '%d/%m/%Y %H:%i:%s'
                ) AS time_out

            FROM Visitor_Logs

            ORDER BY time_in DESC

        `);


        res.json({

            success: true,

            data: rows

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};