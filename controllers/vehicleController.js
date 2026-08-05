const database = require("../database");


// ===================================================
// CREATE VEHICLE
// ===================================================

exports.createVehicle = async (req, res) => {

    try {

        const {

            user_id,
            plate,
            province,
            type,
            registerDate

        } = req.body;

        // -----------------------------
        // ตรวจสอบข้อมูลว่าส่งมาครบไหม
        // -----------------------------

        if (
            !user_id ||
            !plate ||
            !province ||
            !type
        ) {

            return res.json({

                success: false,

                message: "Please fill all required fields"

            });

        }

        // -----------------------------
        // ตรวจสอบว่ามี User จริงไหม
        // -----------------------------

        const [user] = await database.query(

            "SELECT id FROM Users WHERE id=?",

            [user_id]

        );

        if (user.length == 0) {

            return res.json({

                success: false,

                message: "User not found"

            });

        }

        // -----------------------------
        // ตรวจสอบทะเบียนซ้ำ
        // -----------------------------

        const [vehicle] = await database.query(

            `SELECT *
             FROM Vehicles
             WHERE plate=?
             AND province=?`,

            [

                plate,
                province

            ]

        );

        if (vehicle.length > 0) {

            return res.json({

                success: false,

                message: "Vehicle already exists"

            });

        }

        // -----------------------------
        // INSERT
        // -----------------------------

        const [result] = await database.query(

            `INSERT INTO Vehicles
            (
                user_id,
                plate,
                province,
                type,
                registerDate
            )

            VALUES(?,?,?,?,?)`,

            [

                user_id,
                plate,
                province,
                type,
                registerDate

            ]

        );

        res.json({

            success: true,

            message: "Create Vehicle Success",

            data: {

                id: result.insertId,

                user_id,

                plate,

                province,

                type,

                registerDate

            }

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

// ===================================================
// GET ALL VEHICLES
// ===================================================

exports.getVehicles = async (req, res) => {

    try {

        const [rows] = await database.query(

            `SELECT
                Vehicles.id,
                Vehicles.user_id,
                Users.ownerName,
                Vehicles.plate,
                Vehicles.province,
                Vehicles.type,
                Vehicles.registerDate

            FROM Vehicles

            INNER JOIN Users

            ON Vehicles.user_id = Users.id`

        );

        res.json({

            success: true,

            message: "Get Vehicles Success",

            data: rows

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

// ===================================================
// GET VEHICLE BY ID
// ===================================================

exports.getVehicleById = async (req, res) => {

    try {

        const id = req.params.id;

        const [rows] = await database.query(

            `SELECT
                Vehicles.id,
                Vehicles.user_id,
                Users.ownerName,
                Vehicles.plate,
                Vehicles.province,
                Vehicles.type,
                Vehicles.registerDate

            FROM Vehicles

            INNER JOIN Users
            ON Vehicles.user_id = Users.id

            WHERE Vehicles.id = ?`,

            [id]

        );

        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Vehicle not found"

            });

        }

        res.json({

            success: true,

            message: "Get Vehicle Success",

            data: rows[0]

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

// ===================================================
// UPDATE VEHICLE
// ===================================================

exports.updateVehicle = async (req, res) => {

    try {

        const id = req.params.id;

        const {

            user_id,
            plate,
            province,
            type,
            registerDate

        } = req.body;

        // ตรวจว่ามีรถคันนี้หรือไม่
        const [vehicle] = await database.query(

            "SELECT * FROM Vehicles WHERE id=?",

            [id]

        );

        if (vehicle.length === 0) {

            return res.json({

                success: false,

                message: "Vehicle not found"

            });

        }

        // ตรวจว่า user_id มีอยู่จริงหรือไม่
        const [user] = await database.query(

            "SELECT id FROM Users WHERE id=?",

            [user_id]

        );

        if (user.length === 0) {

            return res.json({

                success: false,

                message: "User not found"

            });

        }

        // ตรวจทะเบียนซ้ำ (ยกเว้นรถคันปัจจุบัน)
        const [duplicate] = await database.query(

            `SELECT *
             FROM Vehicles
             WHERE plate = ?
             AND province = ?
             AND id <> ?`,

            [

                plate,
                province,
                id

            ]

        );

        if (duplicate.length > 0) {

            return res.json({

                success: false,

                message: "Vehicle already exists"

            });

        }

        await database.query(

            `UPDATE Vehicles

            SET

            user_id=?,
            plate=?,
            province=?,
            type=?,
            registerDate=?

            WHERE id=?`,

            [

                user_id,
                plate,
                province,
                type,
                registerDate,
                id

            ]

        );

        res.json({

            success: true,

            message: "Update Vehicle Success"

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

// ===================================================
// DELETE VEHICLE
// ===================================================

exports.deleteVehicle = async (req, res) => {

    try {

        const id = req.params.id;

        const [vehicle] = await database.query(

            "SELECT * FROM Vehicles WHERE id=?",

            [id]

        );

        if (vehicle.length === 0) {

            return res.json({

                success: false,

                message: "Vehicle not found"

            });

        }

        await database.query(

            "DELETE FROM Vehicles WHERE id=?",

            [id]

        );

        res.json({

            success: true,

            message: "Delete Vehicle Success"

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