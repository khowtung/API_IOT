const database = require("../database");

// =======================
// POST /api/users
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
        const [check] = await database.query(

            "SELECT * FROM Users WHERE username=?",

            [username]

        );

        if (check.length > 0) {

            return res.json({

                success: false,
                message: "Username already exists"

            });

        }

        await database.query(

            `INSERT INTO Users
            (
                houseNumber,
                ownerName,
                username,
                password,
                role,
                registerDate,
                memberStartDate,
                memberExpireDate
            )

            VALUES(?,?,?,?,?,?,?,?)`,

            [

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
            message: "Create User Success"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

}

// =======================
// GET /api/users
// =======================

exports.getUsers = async (req, res) => {

    try {

        const [rows] = await database.query(

            "SELECT * FROM Users"

        );

        res.json(rows);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false

        });

    }

}

// =======================
// GET /api/users/:id
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
// PUT /api/users/:id
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
// DELETE /api/users/:id
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