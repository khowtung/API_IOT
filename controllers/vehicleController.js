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