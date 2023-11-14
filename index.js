require('dotenv').config()

const express = require('express')

const app = express()
app.use(express.json())
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
// app.use(morgan('tiny'))

//se crea el modelo que sigue al esquema, la convencion es hacerlo en singular, ya que mongoose automaticamente nombra la coleccion como el plural del modelo, en este caso "people"
// los modelos tambien se llaman funciones constructor que crean objetos js basandose en los parametros dados.
const Person = require('./models/person')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(function (tokens, req, res) {
 
  return [          
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res), 
    'ms',
    tokens['body'](req, res)
  ].join(' ')
}))


app.get('/api/persons', (req, res, next) => {  
  Person
    .find()
    .then(person => {
      res.json(person)
    })
    .catch(error => {next(error)})
})

app.get('/info', (req, res) => {
  
  Person
    .count()
    .then(result => {
      res.send(`<p>Phonebook has info for ${result} people </p>${Date().toString()}<br/>`)
    })   
})

app.get("/api/persons/:id", (req, res, next) => { 
  
  Person
    .findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
    
})

app.delete("/api/persons/:id", (req, res, next) => {  
  Person.findByIdAndDelete(req.params.id)
    .then(person => {    
      if(!person) {        
        res.status(404).json({
          error: "ID not found"
        })        
      } else {        
        res.status(204)
      }            
    })
    .catch(error => {
      next(error)
    })  
})

app.post("/api/persons/", (req, res, next) => {

  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
  })  
  
  if(req.body.name !== '' && req.body.number !== '') {
    Person
      .find()
      .then(result => {
        if(result.map(person => person.name).includes(req.body.name)) {
          console.log("ya existe")
          res.status(400).json({
            error: "Name must be unique"
          })
          return
        }
        newPerson
          .save()
          .then(result => {
            console.log('new person saved')  
            res.status(201).json(newPerson);
          })
          .catch(error => {
            next(error)
          }) 
      })        
           
  } else  {
    res.status(400).json({
      error: "No name or number present"
    });
  }
})

app.put("/api/persons/:id", (req, res, next) => {

  const person = {
    name: req.body.name,
    number: req.body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true})
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => { next(error) })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'}) 
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
