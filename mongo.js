const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://phonebook_app:${password}@cluster0.qaz6i.mongodb.net/phonebookdb?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 5) {
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })

    contact.save().then(document => {
        console.log(`Added ${document.name} number ${document.number} to the phonebook.`)
        mongoose.connection.close()
    })
} else {
    Contact.find({}).then(collection => {
        console.log(collection)
        mongoose.connection.close()
    })
}

