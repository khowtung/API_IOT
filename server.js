const express = require('express')
const cors = require('cors')
const database = require('./database');

const app = express()
const port = 4000

app.use(cors())
app.use(express.json())

//เรียกใช้database


app.get('/users', async (req, res) => {
    const [rows] = await database.query('SELECT * FROM Users');
    res.json(rows);
});

//getขอข้อมูลจากdata
app.get('/', (req, res) => {
    res.send('welcome first API')
})


app.get('/users/:id', async (req, res) => {
    const id = req.params.id
    const [rows] = await database.query(
        'SELECT * FROM Users WHERE id = ?'
        [id]
    )

    if (rows.length === 0) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    res.json(rows[0])    
})

app.get('/license/:licenseplate', async (req, res) => {
    const plate = req.params.licenseplate
    const [rows] = await database.query(
        'SELECT * FROM Vehicles WHERE plate = ?',
        [plate]
    )

    if (rows.length === 0) {
        return res.status(404).json({
            message: 'Vehicle not found'
        })
    }
    res.json(rows[0])
})

///////////////////////////////////////////////////////////////////////////////////////////////

//postส่งข้อมูลเข้าdata จะส่งเข้าจากเวปหรือAIก็ได้
app.post('/api/member', (req, res) => {
    const housenum = req.body.housenum
    const name = req.body.name
    const licenseplate = req.body.licenseplate
    console.log(housenum)
    console.log(name)
    console.log(licenseplate)
    
    res.json({
        status: 'success',
        name: name,
        licenseplate: licenseplate
    })
})

//รับข้อมูลจากaiแล้วส่งกลับ
app.post('/api/car-entry', (req, res) => {

    const licenseplate = req.body.licenseplate
    const province = req.body.province
    const camera = req.body.camera
    const time = req.body.time

    console.log("License Plate :", licenseplate)
    console.log("Province :", province)
    console.log("Camera :", camera)
    console.log("Time :", time)

    res.json({
        message: "Done",
        licenseplate,
        province,
        camera,
        time
    })

})

app.listen(port, () => {
    // console.log(`server is running... ${port}`)
    console.log('server is running...')
})