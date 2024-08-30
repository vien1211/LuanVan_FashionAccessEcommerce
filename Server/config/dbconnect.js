const { default: mongoose} = require('mongoose')

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MongoDB_URI)
        if(conn.connection.readyState === 1) console.log('Connected to MongoDB successfully!')
        else console.log('DB connecting')
    } catch (error) {
        console.log('Error connecting to MongoDB')
        throw new Error(error)
    }
}

module.exports = dbConnect