const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

app.use(morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
}))

let people = [
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

app.get('/api/people', (request, response) => {
    console.log('Sending notes')
    response.json(people)
})

app.get('/api/people/:id', (request, response) => {
    id = Number(request.params.id);
    const person = people.find(n => n.id === id)
    if (person){
        console.log(`Sending person with id ${id}`)
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${notes.length} people</p>
                    <p>${Date()}</p>`)
})

app.delete('/api/people/:id', (request, response) => {
    id = Number(request.params.id)
    people = people.filter(p => p.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const id =  Math.floor(Math.random() * 10000)
    return id
}

app.post('/api/people', (request, response) => {
    const person = request.body
    if (!person || !person.name || !person.number){
        return response.status(400).json({
            error: 'Invalid person'
        })
    }
    if (people.filter(p => p.name === person.name)){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }
    const newPerson = {
        name: person.name,
        number: person.number,
        id: generateId(),
    }
    console.log(`Adding person: ${newPerson}`)
    people = people.concat(newPerson)
    response.json(people)
})

// Catches unkown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'Unknown Endpoint'})
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)