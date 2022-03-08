const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
    .then(result => console.log('Connected to MongoDB'))
    .catch(error => console.log(`Unable to connect to MongoDB: ${error.message}`))

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

contactSchema.set('toJSON', {
    transform: (document, contact) => {
        contact.id = contact._id.toString()
        delete contact._id
        delete contact.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)
