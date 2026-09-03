require("dotenv").config();
const express = require("express");
const cors = require("cors");

//เรียกใช้จากโฟเดอร์
const database = require("./database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const vehicleRoutes = require("./routes/vehicles");
const logRoutes = require("./routes/logs");
const accessRoutes = require("./routes/access");
const visitorRoutes = require("./routes/visitor");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

//นี่คือตัวดึงลงไปที่โฟเดอร์ชื่อroutesและไฟล์visitorใช้สำหรับvisitor /
app.use("/api/access",visitorRoutes);
//นี่คือตัวดึงลงไปที่โฟเดอร์ชื่อroutesและไฟล์accessใช้สำหรับai /
app.use("/api/access", accessRoutes);
//นี่คือตัวดึงลงไปที่โฟเดอร์ชื่อroutesและไฟล์logsใช้สำหรับ /
app.use("/api/logs",logRoutes);
//นี่คือตัวดึงลงไปที่โฟเดอร์ชื่อroutesและไฟล์vehiclesใช้สำหรับ /
app.use("/api/vehicles", vehicleRoutes);
//นี่คือตัวดึงลงไปที่โฟเดอร์ชื่อroutesและไฟล์userใช้สำหรับ /
app.use("/api/users", userRoutes);
//นี่คือตัวดึงลงไปที่โฟเดอร์ชื่อroutesและไฟล์authใช้สำหรับ /loin หรือ register
app.use("/api/auth", authRoutes);

//getขอข้อมูลจากdataเริ่มต้นนะ
app.get("/", (req, res) => {
  res.send("welcome first API");
});

app.listen(port, () => {
  // console.log(`server is running... ${port}`)
  console.log("server is running...");
});

//เรียกใช้database

//--------------------------------GET---------------------------------------------------//

// app.get("/users", async (req, res) => {
//   const [rows] = await database.query("SELECT * FROM Users");
//   res.json(rows);
// });



// //เรียกหาuser id
// app.get('/users/:id', async (req, res) => {
//     const id = req.params.id
//     const [rows] = await database.query(
//         'SELECT * FROM Users WHERE id = ?',
//         [id]
//     )

//     if (rows.length === 0) {
//         return res.status(404).json({
//             message: 'User not found'
//         })
//     }
//     res.json(rows[0])
// })

// //เรียกหาป้ายทะเบียย
// app.get('/license/:licenseplate', async (req, res) => {
//     const plate = req.params.licenseplate
//     const [rows] = await database.query(
//         'SELECT * FROM Vehicles WHERE plate = ?',
//         [plate]
//     )

//     if (rows.length === 0) {
//         return res.status(404).json({
//             message: 'Vehicle not found'
//         })
//     }
//     res.json(rows[0])
// })

// //--------------------------------POST---------------------------------------------------//

// //postส่งข้อมูลเข้าdata จะส่งเข้าจากเวปหรือAIก็ได้
// app.post('/api/member', (req, res) => {
//     const housenum = req.body.housenum
//     const name = req.body.name
//     const licenseplate = req.body.licenseplate
//     console.log(housenum)
//     console.log(name)
//     console.log(licenseplate)

//     res.json({
//         status: 'success',
//         name: name,
//         licenseplate: licenseplate
//     })
// })

// //รับข้อมูลจากaiแล้วส่งกลับ
// app.post('/api/car-entry', (req, res) => {

//     const licenseplate = req.body.licenseplate
//     const province = req.body.province
//     const camera = req.body.camera
//     const time = req.body.time

//     console.log("License Plate :", licenseplate)
//     console.log("Province :", province)
//     console.log("Camera :", camera)
//     console.log("Time :", time)

//     res.json({
//         message: "Done",
//         licenseplate,
//         province,
//         camera,
//         time
//     })

// })

//--------------------------------PUT---------------------------------------------------//

//--------------------------------DELETE---------------------------------------------------//
