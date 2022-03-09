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

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'Malformatted ID'})
    }

    if (error.name === 'Not Found') {
        console.log('test');
        return response.status(404)
            .send({error: 'The contact requested for this action does not exist'})
    }

    next(error)
}

morgan.token('post-request', (request) => {
    return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-request'
))

app.get('/info', (request, response, next) => {
    Contact.find({})
        .then(contacts => {
            response.send(
                `<p>Phonebook has info for ${contacts.length} people</p><p>${new Date()}</p`
            )
        })
        .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Contact.find({})
        .then(contacts => response.json(contacts))
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id)
        .then(contact => contact ? response.json(contact) : next({name: 'Not Found'}))
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const contact = {number: request.body.number}

    Contact.findByIdAndUpdate(request.params.id, contact, {new: true})
        .then(contact => contact ? response.json(contact) : next({name: 'Not Found'}))
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (name && number) {
        const contact = new Contact({
            name: name,
            number: number
        })

        contact.save().then(contact => response.json(contact))
    } else {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }
})

app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndRemove(request.params.id)
        .then(result => response.status(204).end())
        .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
