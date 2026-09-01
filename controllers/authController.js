const database = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ==========================================
// REGISTER
// POST /api/auth/register
// ==========================================

exports.register = async (req, res) => {

    try {

        const {
            user_id,
            username,
            password
        } = req.body;


        if (!user_id || !username || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "user_id, username and password are required"

            });

        }


        // ตรวจว่า User มีอยู่จริงไหม

        const [users] = await database.query(

            `SELECT id
             FROM Users
             WHERE id = ?`,

            [user_id]

        );


        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        // ตรวจ username ซ้ำ

        const [accounts] = await database.query(

            `SELECT id
             FROM Accounts
             WHERE username = ?`,

            [username]

        );


        if (accounts.length > 0) {

            return res.status(409).json({

                success: false,

                message: "Username already exists"

            });

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // สร้าง Account

        const [result] = await database.query(

            `INSERT INTO Accounts
            (
                user_id,
                username,
                password
            )
            VALUES (?, ?, ?)`,

            [
                user_id,
                username,
                hashedPassword
            ]

        );


        return res.status(201).json({

            success: true,

            message: "Account created successfully",

            data: {

                id: result.insertId,

                user_id: user_id,

                username: username

            }

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal server error"

        });

    }

};


// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================

exports.login = async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        // ตรวจข้อมูล

        if (!username || !password) {

            return res.status(400).json({

                success: false,
                message: "Username and password are required"

            });

        }


        // ค้นหา Account

        const [rows] = await database.query(

            `SELECT
                id,
                user_id,
                username,
                password

             FROM Accounts

             WHERE username = ?`,

            [username]

        );


        if (rows.length === 0) {

            return res.status(401).json({

                success: false

            });

        }


        const account = rows[0];


        // ตรวจ Password

        const isPasswordValid =
            await bcrypt.compare(
                password,
                account.password
            );


        if (!isPasswordValid) {

            return res.status(401).json({

                success: false

            });

        }


        // สร้าง JWT

        const token = jwt.sign(

            {
                userId: account.user_id,
                username: account.username
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1h"
            }

        );


        console.log(
            `[API] Login success: ${account.username}`
        );


        return res.json({

            success: true,

            token: token,

            id: account.user_id

        });

    }

    catch (error) {

        console.error(
            "[API Error] login:",
            error
        );

        return res.status(500).json({

            success: false

        });

    }

};

// ==========================================
// PUT /api/auth/updateAccount/:id
// แก้ Username / Password
// ==========================================

exports.updateAccount = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            username,
            password
        } = req.body;


        // ==========================================
        // ตรวจว่ามี Account หรือไม่
        // ==========================================

        const [account] = await database.query(

            `SELECT id
             FROM Accounts
             WHERE id = ?`,

            [id]

        );


        if (account.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Account not found"

            });

        }


        // ==========================================
        // ตรวจ Username ซ้ำ
        // ==========================================

        const [duplicate] = await database.query(

            `SELECT id
             FROM Accounts
             WHERE username = ?
             AND id <> ?`,

            [
                username,
                id
            ]

        );


        if (duplicate.length > 0) {

            return res.status(409).json({

                success: false,

                message: "Username already exists"

            });

        }


        // ==========================================
        // Hash Password
        // ==========================================

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // ==========================================
        // Update Account
        // ==========================================

        await database.query(

            `UPDATE Accounts

             SET
                username = ?,
                password = ?

             WHERE id = ?`,

            [
                username,
                hashedPassword,
                id
            ]

        );


        return res.json({

            success: true,

            message: "Update Account Success"

        });

    }


    catch (error) {

        console.error(
            "[API Error] updateAccount:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

// ==================================================
// GET /api/auth/me
// ตรวจสอบ Token และดึงข้อมูล User ปัจจุบัน
// ==================================================

exports.getMe = async (req, res) => {

    try {

        // userId มาจาก JWT
        const userId = req.user.userId;


        // ==================================================
        // ดึงข้อมูล User + Account
        // ==================================================

        const [rows] = await database.query(

            `SELECT
                u.id,
                u.houseNumber,
                u.ownerName,
                u.role,
                u.registerDate,
                u.memberStartDate,
                u.memberExpireDate,
                a.username

             FROM Users u

             JOIN Accounts a
                ON u.id = a.user_id

             WHERE u.id = ?`,

            [userId]

        );


        // ==================================================
        // ไม่พบ User
        // ==================================================

        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        // ==================================================
        // ส่งข้อมูลกลับ
        // ==================================================

        return res.json({

            success: true,

            user: rows[0]

        });

    }


    catch (error) {

        console.error(
            "[API Error] getMe:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};