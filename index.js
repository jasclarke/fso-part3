const { request, response } = require('express')
const express = require('express')
const { json } = require('express/lib/response')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = 3001

morgan.token('post-request', (request) => {
    return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-request'
))

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${contacts.length} people</p><p>${new Date()}</p`
    )
})

app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)

    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (name && number) {
        if (contacts.find(contact => contact.name === name)) {
            return response.status(409).json({
                error: 'The name must be unique'
            })
        }

        const contact = {
            id: (Math.floor(Math.random() * 10) + 1) * (Math.floor(Math.random() * 15) + 1),
            name: name,
            number: number
        }

        contacts.push(contact)
        response.json(contact)
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
