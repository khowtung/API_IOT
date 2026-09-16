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

// ==================================================
// PUT /api/auth/updateAccount/:id
// :id = user_id
//
// สามารถแก้ username หรือ password
// อย่างใดอย่างหนึ่ง หรือแก้ทั้งคู่ก็ได้
// ==================================================
exports.updateAccount = async (req, res) => {

    try {

        const userId = req.params.id;

        const {
            username,
            password
        } = req.body;


        // ==========================================
        // ต้องส่งอย่างน้อย 1 ตัว
        // ==========================================
        if (!username && !password) {

            return res.status(400).json({
                success: false,
                message: "username or password is required"
            });
        }


        // ==========================================
        // ตรวจว่า User มี Account หรือไม่
        // ==========================================
        const [accounts] = await database.query(
            `SELECT
                id,
                user_id,
                username
             FROM Accounts
             WHERE user_id = ?
             LIMIT 1`,
            [userId]
        );


        if (accounts.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }


        const account = accounts[0];


        // ==========================================
        // CASE 1:
        // แก้ทั้ง username + password
        // ==========================================
        if (username && password) {

            // ตรวจ username ซ้ำ
            const [existingUsername] = await database.query(
                `SELECT id
                 FROM Accounts
                 WHERE username = ?
                 AND id != ?
                 LIMIT 1`,
                [
                    username,
                    account.id
                ]
            );


            if (existingUsername.length > 0) {

                return res.status(400).json({
                    success: false,
                    message: "Username already exists"
                });
            }


            // Hash password
            const hashedPassword =
                await bcrypt.hash(password, 10);


            await database.query(
                `UPDATE Accounts
                 SET username = ?,
                     password = ?
                 WHERE user_id = ?`,
                [
                    username,
                    hashedPassword,
                    userId
                ]
            );
        }


        // ==========================================
        // CASE 2:
        // แก้ username อย่างเดียว
        // ==========================================
        else if (username) {

            // ตรวจ username ซ้ำ
            const [existingUsername] = await database.query(
                `SELECT id
                 FROM Accounts
                 WHERE username = ?
                 AND id != ?
                 LIMIT 1`,
                [
                    username,
                    account.id
                ]
            );


            if (existingUsername.length > 0) {

                return res.status(400).json({
                    success: false,
                    message: "Username already exists"
                });
            }


            await database.query(
                `UPDATE Accounts
                 SET username = ?
                 WHERE user_id = ?`,
                [
                    username,
                    userId
                ]
            );
        }


        // ==========================================
        // CASE 3:
        // แก้ password อย่างเดียว
        // ==========================================
        else if (password) {

            // Hash password
            const hashedPassword =
                await bcrypt.hash(password, 10);


            await database.query(
                `UPDATE Accounts
                 SET password = ?
                 WHERE user_id = ?`,
                [
                    hashedPassword,
                    userId
                ]
            );
        }


        // ==========================================
        // สำเร็จ
        // ==========================================
        return res.json({

            success: true,

            message: "Account updated successfully"

        });


    } catch (error) {

        console.error("UPDATE ACCOUNT ERROR");
        console.error(error);

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