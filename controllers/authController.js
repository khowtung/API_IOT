//เรียกใช้โฟเดอร์จากชื่อเพื่อส่งข้อมูลเข้า
const database = require("../database");

//register
exports.register = async(req,res)=>{
    try{
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

        // ตรวจสอบ username ซ้ำ
        const [checkUser] = await database.query(
            "SELECT * FROM Users WHERE username=?",
            [username]
        );

        if(checkUser.length>0){
            return res.json({
                success:false,
                message:"Username already exists"
            });
        }

        // เพิ่มข้อมูล
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
            success:true,
            message:"Register Success"
        });

    } catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}

//login
exports.login = async(req,res)=>{
    try{
        const {
            username,
            password
        } 
        = req.body;

        const [rows] = await database.query(
            "SELECT * FROM Users WHERE username=?",
            [username]
        );

        if(rows.length==0){
            return res.json({
                success:false
            });
        }

        if(rows[0].password!==password){
            return res.json({
                success:false
            });

        }
        res.json({
            success:true
        });

    } catch(error){
        console.log(error);
        res.status(500).json({
            success:false
        });

    }

}