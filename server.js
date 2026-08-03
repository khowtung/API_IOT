const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())


const users = [
    { id: 1, housenum: '67/1', name: 'supanat', licenseplate:'ค6767', province: 'ลำพูน',Convoy: 'car'},
    { id: 2, housenum: '67/1', name: 'supanat', licenseplate:'ห6969', province: 'ลำพูน',Convoy: 'motocycle'},
    { id: 3, housenum: '67/1', name: 'supanat', licenseplate:'หคต888', province: 'ลำพูน',Convoy: 'motocycle'},
]
//getขอข้อมูลจากdata
app.get('/', (req, res) => {
    res.send('welcome first API')
})

app.get('/users', (req, res) => {
    res.json(users)
})

app.get('/users/:id', (req, res) => {
    const userid = parseInt(req.params.id)
    const user = users.find(u => u.id === userid)
    if (!user) {
        res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
})

app.get('/license/:licenseplate', (req, res) => {
    const userlicense = String(req.params.licenseplate)
    const user = users.find(u => u.licenseplate ===userlicense)
    if (!user) {
        res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
})

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