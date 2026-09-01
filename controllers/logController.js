const database = require("../database");


// ===================================================
// CAR ENTRY
// รับข้อมูลจาก AI
// ===================================================

// exports.carEntry = async (req, res) => {

//     try {

//         const {

//             licenseplate,
//             province,
//             camera,
//             time

//         } = req.body;


//         // ===================================================
//         // ตรวจสอบข้อมูล
//         // ===================================================

//         if (
//             !licenseplate ||
//             !province ||
//             !camera ||
//             !time
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message: "Please provide licenseplate, province, camera and time"

//             });

//         }


//         // ===================================================
//         // ค้นหารถจากทะเบียน
//         // ===================================================

//         const [vehicles] = await database.query(

//             `SELECT
//                 id,
//                 user_id,
//                 plate,
//                 province,
//                 type

//             FROM Vehicles

//             WHERE plate = ?
//             AND province = ?`,

//             [

//                 licenseplate,
//                 province

//             ]

//         );


//         // ===================================================
//         // ไม่พบรถ
//         // ===================================================

//         if (vehicles.length === 0) {

//             return res.status(404).json({

//                 success: false,

//                 message: "Vehicle not found"

//             });

//         }


//         const vehicle = vehicles[0];


//         // ===================================================
//         // ตรวจว่ารถคันนี้มีรายการเข้า
//         // แต่ยังไม่มีเวลาออกหรือไม่
//         // ===================================================

//         const [openLogs] = await database.query(

//             `SELECT
//                 id,
//                 vehicle_id,
//                 camera_in,
//                 time_in

//             FROM Vehicle_Logs

//             WHERE vehicle_id = ?

//             AND time_out IS NULL

//             ORDER BY time_in DESC

//             LIMIT 1`,

//             [

//                 vehicle.id

//             ]

//         );


//         // ===================================================
//         // CASE 1
//         // ยังไม่มีรายการเข้า -> ถือว่าเป็น IN
//         // ===================================================

//         if (openLogs.length === 0) {

//             const [result] = await database.query(

//                 `INSERT INTO Vehicle_Logs
//                 (
//                     vehicle_id,
//                     camera_in,
//                     time_in
//                 )

//                 VALUES (?, ?, ?)`,

//                 [

//                     vehicle.id,
//                     camera,
//                     time

//                 ]

//             );


//             return res.json({

//                 success: true,

//                 message: "Car Entry Success",

//                 data: {

//                     logId: result.insertId,

//                     vehicleId: vehicle.id,

//                     licenseplate: vehicle.plate,

//                     province: vehicle.province,

//                     cameraIn: camera,

//                     timeIn: time

//                 }

//             });

//         }


//         // ===================================================
//         // CASE 2
//         // มีรายการเข้าแล้ว -> ถือว่าเป็น OUT
//         // ===================================================

//         const log = openLogs[0];


//         await database.query(

//             `UPDATE Vehicle_Logs

//             SET
//                 camera_out = ?,
//                 time_out = ?

//             WHERE id = ?`,

//             [

//                 camera,
//                 time,
//                 log.id

//             ]

//         );


//         return res.json({

//             success: true,

//             message: "Car Exit Success",

//             data: {

//                 logId: log.id,

//                 vehicleId: vehicle.id,

//                 licenseplate: vehicle.plate,

//                 province: vehicle.province,

//                 cameraIn: log.camera_in,

//                 timeIn: log.time_in,

//                 cameraOut: camera,

//                 timeOut: time

//             }

//         });

//     }


//     catch (error) {

//         console.log(error);


//         res.status(500).json({

//             success: false,

//             message: "Server Error"

//         });

//     }

// };


// ===================================================
// GET ById VEHICLE LOGS
// ===================================================

exports.getLogsById = async (req, res) => {
    try {
        const id = req.params.id;

        const [rows] = await database.query(`
            SELECT
                v.user_id,
                vl.vehicle_id,
                v.plate,
                v.province,
                v.type,
                vl.time_in,
                vl.time_out
            FROM Vehicle_Logs vl
            JOIN Vehicles v
                ON vl.vehicle_id = v.id
            JOIN Users u
                ON v.user_id = u.id
            WHERE vl.vehicle_id = ?
            ORDER BY vl.time_in DESC
        `, [id]);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


// ===================================================
// GET ALL VEHICLE LOGS
// ===================================================

exports.getLogs = async (req, res) => {

    try {

        const [rows] = await database.query(`

            SELECT
                v.user_id,
                vl.vehicle_id,
                v.plate,
                v.province,
                v.type,
                vl.time_in,
                vl.time_out
            FROM Vehicle_Logs vl

            JOIN Vehicles v
                ON vl.vehicle_id = v.id

            JOIN Users u
                ON v.user_id = u.id

            ORDER BY vl.time_in DESC

        `);


        res.json({

            success: true,

            data: rows

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};