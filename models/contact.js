const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log(`Unable to connect to MongoDB: ${error.message}`))

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'The name must be at least three (3) characters long.'],
        required: [true, 'The name is missing.']
    },
    number: {
        type: String,
        minlength: 8,
        required: true,
        validate: {
            validator: (number) => {
                return /^\d{2,3}-\d/.test(number)
            },
            message: 'The number must match the following format xx(x)-xxxxxxx'
        }
    }
})

contactSchema.set('toJSON', {
    transform: (document, contact) => {
        contact.id = contact._id.toString()
        delete contact._id
        delete contact.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)
