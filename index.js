var express = require('express')
var cors = require('cors')
var mongoose = require('mongoose')
var path = require('path')

var app = express()

const port = 3001

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

mongoose.connect('mongodb+srv://pedro61946:z3xQAGG2afHANTp9@cluster0.yjpunlc.mongodb.net/?retryWrites=true&w=majority',{
    autoIndex: true
})
.then(() => {
    console.log('Database connected')

    const pacienteRoutes = require('./routes/pacienteRoutes')
    app.use('/api/pacientes', pacienteRoutes)
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.listen(port, () => {
        console.log('Server running in http://localhost:3001')
    })
})
.catch((err) => {
    console.error('Error connecting to the database:', err)
})