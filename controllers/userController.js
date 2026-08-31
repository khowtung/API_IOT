const database = require("../database");
const bcrypt = require("bcrypt");

// =======================
// POST /api/users/createUser
// เพิ่มลูกบ้าน
// =======================

exports.createUser = async (req, res) => {

    try {

        const {
            houseNumber,
            ownerName,
            role,
            registerDate,
            memberStartDate,
            memberExpireDate
        } = req.body;


        // ==========================================
        // ตรวจบ้านเลขที่ซ้ำ
        // ==========================================

        const [checkhouse] = await database.query(

            "SELECT * FROM Users WHERE houseNumber = ?",

            [houseNumber]

        );


        if (checkhouse.length > 0) {

            return res.status(409).json({

                success: false,

                message: "houseNumber already exists"

            });

        }


        // ==========================================
        // เพิ่ม User
        // id ไม่ต้องใส่
        // เพราะ Database AUTO_INCREMENT ให้เอง
        // ==========================================

        const [result] = await database.query(

            `INSERT INTO Users
            (
                houseNumber,
                ownerName,
                role,
                registerDate,
                memberStartDate,
                memberExpireDate
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            
            [
                houseNumber,
                ownerName,
                role,
                registerDate,
                memberStartDate,
                memberExpireDate
            ]

        );


        // Database สร้าง ID ให้เอง

        const newId = result.insertId;


        // ==========================================
        // Response
        // ==========================================

        return res.status(201).json({

            success: true,

            message: "Create User Success",

            newId: newId

        });

    }


    catch (error) {

        console.error("=================================");

        console.error("CREATE USER ERROR");

        console.error(error);

        console.error("=================================");


        return res.status(500).json({

            success: false,

            message: "Server Error",

            error: error.message

        });

    }

};

// =======================
// GET    /api/users/getUsers
// =======================

exports.getUsers = async (req, res) => {

    try {
        const [rows] = await database.query(
            "SELECT * FROM Users"
        );
        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// =======================
// GET    /api/users/getUserById/1
// =======================

exports.getUserById = async (req, res) => {

    try {
        const id = req.params.id;
        const [rows] = await database.query(
            "SELECT * FROM Users WHERE id=?",
            [id]
        );
        if (rows.length == 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.json(rows[0]);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false

        });

    }

}

// =======================
// PUT    /api/users/updateUser/1
// =======================

exports.updateUser = async (req, res) => {

    try {

        const id = req.params.id;

        const {

            houseNumber,
            ownerName,
            role,
            registerDate,
            memberStartDate,
            memberExpireDate

        } = req.body;

        await database.query(

            `UPDATE Users

            SET

            houseNumber=?,
            ownerName=?,
            role=?,
            registerDate=?,
            memberStartDate=?,
            memberExpireDate=?

            WHERE id=?`,

            [

                houseNumber,
                ownerName,
                role,
                registerDate,
                memberStartDate,
                memberExpireDate,
                id

            ]

        );

        res.json({

            success: true,
            message: "Update Success"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false

        });

    }

}

// =======================
// DELETE /api/users/deleteUser/1
// =======================

exports.deleteUser = async (req, res) => {

    try {

        const id = req.params.id;

        await database.query(

            "DELETE FROM Users WHERE id=?",

            [id]

        );

        res.json({

            success: true,
            message: "Delete Success"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false

        });

    }

}


// ===================================================
// GET USER + VEHICLES + TIME IN/OUT
// ===================================================

exports.getUserWithVehicles = async (req, res) => {

    try {

        const userId = req.params.id;


        // ============================================
        // 1. ค้นหา User
        // ============================================

        const [users] = await database.query(

            `SELECT
                id,
                houseNumber,
                ownerName,
                role,
                registerDate,
                memberStartDate,
                memberExpireDate

             FROM Users

             WHERE id = ?`,

            [userId]

        );


        // ไม่พบ User

        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        const user = users[0];


        // ============================================
        // 2. ค้นหา Vehicles ของ User
        // ============================================

        const [vehicles] = await database.query(

            `SELECT
                id,
                plate,
                province,
                type,
                registerDate

             FROM Vehicles

             WHERE user_id = ?`,

            [userId]

        );


        // ============================================
        // 3. หาประวัติ IN / OUT ของรถแต่ละคัน
        // ============================================

        for (const vehicle of vehicles) {

            const [logs] = await database.query(

                `SELECT
                    id,
                    camera_in,
                    time_in,
                    camera_out,
                    time_out

                 FROM Vehicle_Logs

                 WHERE vehicle_id = ?

                 ORDER BY time_in DESC`,

                [vehicle.id]

            );


            // แปลงชื่อข้อมูลให้ตรงกับที่หน้าเว็บต้องการ

            vehicle.timeInOut = logs.map(log => ({

                in: log.time_in,

                out: log.time_out

            }));


            // ไม่จำเป็นต้องส่ง id ของ log
            // และ camera สามารถเอาออกได้ถ้าหน้าเว็บไม่ใช้

        }


        // ============================================
        // 4. รวมข้อมูล
        // ============================================

        const data = {

            id: user.id,

            houseNumber: user.houseNumber,

            ownerName: user.ownerName,

            role: user.role,

            registerDate: user.registerDate,

            memberStartDate: user.memberStartDate,

            memberExpireDate: user.memberExpireDate,

            vehicles: vehicles

        };


        // ============================================
        // 5. ส่ง Response
        // ============================================

        res.json({

            success: true,

            data: data

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