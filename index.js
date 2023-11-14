require('dotenv').config()

const express = require('express')

const app = express()
app.use(express.json())
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
// app.use(morgan('tiny'))
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

//se crea el modelo que sigue al esquema, la convencion es hacerlo en singular, ya que mongoose automaticamente nombra la coleccion como el plural del modelo, en este caso "people"
// los modelos tambien se llaman funciones constructor que crean objetos js basandose en los parametros dados.
const Person = require('./models/person')


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


app.get('/api/persons', (req, res) => {  
  Person
    .find()
    .then(person => {
      res.json(person)
    })
})

app.get('/info', (req, res) => {
  const peopleAmount = persons.length;
  const time = Date().toString();
  res.send(`<p>Phonebook has info for ${peopleAmount} people </p>${time}<br/>
  `)
})

app.get("/api/persons/:id", (req, res) => { 
  
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
    
})

app.delete("/api/persons/:id", (req, res) => {
  const idParsed = Number(req.params.id);    
  persons = persons.filter(person => person.id !== idParsed)  
  res.status(204).end()
})

app.post("/api/persons/", (req, res) => {

  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
  })
  
  newPerson
    .save()
    .then(result => {
      console.log('new person saved')  
      res.json(newPerson);
    })
    .catch(error => {
      console.log('error, could not save new person', error)
    })
  // if(req.body.name !== '' && req.body.number !== '') {
  //   if(persons.map(person => person.name).includes(req.body.name)) {
  //     res.status(400).json({error: "Name must be unique"})
  //     return;
  //   } 
  //   res.status(201).json(newPerson);
  //   persons = persons.concat(newPerson);         
  // } else  {
  //   res.status(400).json({error: "no name or number present"});
  // }
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
