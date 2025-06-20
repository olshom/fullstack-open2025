require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
morgan.token('reqObj', (req) => JSON.stringify(req.body))
app.use(morgan(':reqObj'))

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }).catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people<br />
        ${Date()}</p>`)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id).then(person => {
    if (!person) {
      res.status(404).end()
    }
    person.name = name
    person.number = number

    return person.save().then(updatedPerson => {
      res.json(updatedPerson)
    })
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})