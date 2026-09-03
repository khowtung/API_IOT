const database = require("../database");

// ==================================================
// POST /api/access/vehicle
// AI + ESP32 ส่งทะเบียนเข้ามา
// ==================================================
exports.vehicleAccess = async (req, res) => {

    try {

        const {
            licenseplate,
            province
        } = req.body;

        // ==========================================
        // ตรวจข้อมูล
        // ==========================================
        if (!licenseplate || !province) {

            return res.status(400).json({
                success: false,
                allowed: false,
                message: "licenseplate and province are required"
            });
        }

        console.log("License Plate :", licenseplate);
        console.log("Province :", province);

        // ==========================================
        // 1. ตรวจสอบว่ามีรถในระบบหรือไม่
        // ==========================================
        const [vehicles] = await database.query(
            `SELECT
                id,
                user_id,
                plate,
                province,
                type
             FROM Vehicles
             WHERE plate = ?
             AND province = ?`,
            [
                licenseplate,
                province
            ]
        );

        // ==========================================
        // ไม่พบรถในระบบ
        // = Visitor
        // ==========================================
        if (vehicles.length === 0) {

            // ==========================================
            // ตรวจว่ามี Visitor ที่อยู่ข้างในหรือไม่
            // ==========================================
            const [insideVisitors] = await database.query(
                `SELECT
                    id,
                    barcode,
                    licenseplate,
                    province,
                    status
                 FROM Visitors
                 WHERE licenseplate = ?
                 AND province = ?
                 AND status = 'INSIDE'
                 LIMIT 1`,
                [
                    licenseplate,
                    province
                ]
            );

            // ==========================================
            // พบ Visitor ที่อยู่ข้างใน
            // = กำลังออก
            // ==========================================
            if (insideVisitors.length > 0) {

                const visitor = insideVisitors[0];

                await database.query(
                    `UPDATE Visitors
                     SET status = 'WAITING_EXIT_BARCODE'
                     WHERE id = ?`,
                    [
                        visitor.id
                    ]
                );

                return res.json({
                    success: true,
                    allowed: false,
                    needBarcode: true,
                    action: "WAITING_OUT",
                    message: "Visitor detected. Please scan barcode to exit"
                });
            }

            // ==========================================
            // ไม่พบ Visitor ที่อยู่ข้างใน
            // = Visitor กำลังเข้า
            // ==========================================
            const [existingVisitor] = await database.query(
                `SELECT id
                 FROM Visitors
                 WHERE licenseplate = ?
                 AND province = ?
                 LIMIT 1`,
                [
                    licenseplate,
                    province
                ]
            );

            // ==========================================
            // ถ้ายังไม่มี Visitor ให้สร้าง
            // ==========================================
            if (existingVisitor.length === 0) {

                await database.query(
                    `INSERT INTO Visitors
                     (
                         barcode,
                         licenseplate,
                         province,
                         time_in,
                         status
                     )
                     VALUES
                     (
                         NULL,
                         ?,
                         ?,
                         NULL,
                         'WAITING_BARCODE'
                     )`,
                    [
                        licenseplate,
                        province
                    ]
                );
            }

            return res.json({
                success: true,
                allowed: false,
                needBarcode: true,
                action: "WAITING_IN",
                message: "Visitor detected. Please scan barcode"
            });
        }

        // ==========================================
        // พบรถในระบบ
        // = ลูกบ้าน
        // ==========================================
        const vehicle = vehicles[0];

        // ==========================================
        // 2. ตรวจว่ารถกำลังอยู่ในหมู่บ้านไหม
        // ==========================================
        const [openLogs] = await database.query(
            `SELECT
                id,
                time_in
             FROM Vehicle_Logs
             WHERE vehicle_id = ?
             AND time_out IS NULL
             ORDER BY time_in DESC
             LIMIT 1`,
            [
                vehicle.id
            ]
        );

        // ==========================================
        // 3. ไม่มี Log เปิดอยู่
        // = รถกำลังเข้า
        // ==========================================
        if (openLogs.length === 0) {

            await database.query(
                `INSERT INTO Vehicle_Logs
                 (
                     vehicle_id,
                     time_in
                 )
                 VALUES (?, CURRENT_TIMESTAMP)`,
                [
                    vehicle.id
                ]
            );

            return res.json({
                success: true,
                allowed: true,
                action: "IN",
                message: "Vehicle Entry Success"
            });
        }

        // ==========================================
        // 4. มี Log เปิดอยู่
        // = รถกำลังออก
        // ==========================================
        const log = openLogs[0];

        await database.query(
            `UPDATE Vehicle_Logs
             SET time_out = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                log.id
            ]
        );

        return res.json({
            success: true,
            allowed: true,
            action: "OUT",
            message: "Vehicle Exit Success"
        });

    } catch (error) {

        console.error("VEHICLE ACCESS ERROR");
        console.error(error);

        return res.status(500).json({
            success: false,
            allowed: false,
            message: "Server Error"
        });
    }
};