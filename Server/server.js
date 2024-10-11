const express = require("express")
require('dotenv').config()
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'PUT', 'GET', 'DELETE'],
    credentials: true
}))

app.use(cookieParser())

const port = process.env.PORT || 8888

app.use(express.json())
app.use(express.urlencoded({extended : true}))

dbConnect()
initRoutes(app)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.use('/', (req, res) => {res.send('Server on')})

app.listen(port, () => {
    console.log('Server is running on port:', port)
})