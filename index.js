var express = require('express')
var cors = require('cors')
var mongoose = require('mongoose')
var path = require('path')

var app = express()

const port = 3001

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

mongoose.connect('mongodb+srv://pedro61946:ymo4fin06u9j8YBA@cluster0.tfjdgpx.mongodb.net/?retryWrites=true&w=majority',{
    autoIndex: true
})
.then(() => {
    console.log('Database connected')

    const libroRoutes = require('./routes/libroRoutes')
    app.use('/api/libros', libroRoutes)
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.listen(port, () => {
        console.log('Server running in http://localhost:3001')
    })
})
.catch((err) => {
    console.error('Error connecting to the database:', err)
})