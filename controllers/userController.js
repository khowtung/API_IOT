const database = require("../database");

// =======================
// POST   /api/users/createUser
// เพิ่มลูกบ้าน
// =======================

exports.createUser = async (req, res) => {

    try {
        const {
            houseNumber,
            ownerName,
            username,
            password,
            role,
            registerDate,
            memberStartDate,
            memberExpireDate
        } = req.body;

        // ตรวจ username ซ้ำ
        const [checkusername] = await database.query(
            "SELECT * FROM Users WHERE username=?",
            [username]
        );

        if (checkusername.length > 0) {
            return res.json({
                success: false,
                message: "Username already exists"
            });
        }

        // 2. ตรวจบ้านเลขที่ซ้ำ
        const [checkhouse] = await database.query(
            "SELECT * FROM Users WHERE houseNumber=?",
            [houseNumber]
        );
        if (checkhouse.length > 0) {
            return res.json({
                success: false,
                message: "้houseNumber already exists"
            });
        }

        // ค้นหา ID ที่มีค่ามากที่สุดในตารางตอนนี้
        const [maxIdResult] = await database.query(
            "SELECT MAX(id) AS maxId FROM Users"
        );

        // กำหนด ID ใหม่: ถ้าตารางว่างให้เริ่มที่ 1 แต่ถ้ามีข้อมูลให้เอาค่ามากสุด + 1
        const nextId = maxIdResult[0].maxId === null ? 1 : maxIdResult[0].maxId + 1;

        await database.query(
            `INSERT INTO Users
            (
                id,
                houseNumber,
                ownerName,
                username,
                password,
                role,
                registerDate,
                memberStartDate,
                memberExpireDate
            )

            VALUES(?,?,?,?,?,?,?,?,?)`,

            [
                nextId,
                houseNumber,
                ownerName,
                username,
                password,
                role,
                registerDate,
                memberStartDate,
                memberExpireDate
            ]
        );

        res.json({
            success: true,
            message: "Create User Success",
            newId: nextId
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

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
            username,
            password,
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
            username=?,
            password=?,
            role=?,
            registerDate=?,
            memberStartDate=?,
            memberExpireDate=?

            WHERE id=?`,

            [

                houseNumber,
                ownerName,
                username,
                password,
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
// GET USER WITH VEHICLES
// ===================================================

exports.getUserWithVehicles = async (req, res) => {

    try {

        const id = req.params.id;

        // หา User
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

            [id]

        );

        // ถ้าไม่พบ User
        if (users.length === 0) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        // หารถของ User คนนี้
        const [vehicles] = await database.query(

            `SELECT
                id,
                plate,
                province,
                type,
                registerDate

            FROM Vehicles

            WHERE user_id = ?`,

            [id]

        );

        // รวมข้อมูล User + Vehicles
        const user = {

            id: users[0].id,

            houseNumber: users[0].houseNumber,

            ownerName: users[0].ownerName,

            role: users[0].role,

            registerDate: users[0].registerDate,

            memberStartDate: users[0].memberStartDate,

            memberExpireDate: users[0].memberExpireDate,

            vehicles: vehicles

        };

        res.json({

            success: true,

            message: "Get User With Vehicles Success",

            data: user

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};