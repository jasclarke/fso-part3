require('dotenv').config()

const { request, response } = require('express')
const express = require('express')
const { json } = require('express/lib/response')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Contact = require('./models/contact')
const app = express()
const PORT = process.env.PORT

morgan.token('post-request', (request) => {
    return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-request'
))

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${contacts.length} people</p><p>${new Date()}</p`
    )
})

app.get('/api/persons', (request, response) => {
    Contact.find({})
        .then(contacts => response.json(contacts))
})

app.get('/api/persons/:id', (request, response) => {
    Contact.findById(request.params.id)
        .then(contact => response.json(contact))
        //response.status(404).end()
})

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (name && number) {
        /*if (contacts.find(contact => contact.name === name)) {
            return response.status(409).json({
                error: 'The name must be unique'
            })
        }*/

        const contact = new Contact({
            name: name,
            number: number
        })

        contact.save()
            .then(contact => response.json(contact))
    } else {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
