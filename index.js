const express = require('express')

const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

const morgan = require('morgan')
// app.use(morgan('tiny'))
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

let persons = 
  [
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
];


app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const peopleAmount = persons.length;
  const time = Date().toString();
  res.send(`<p>Phonebook has info for ${peopleAmount} people </p>${time}<br/>
  `)
})

app.get("/api/persons/:id", (req, res) => { 
  const idParsed = Number(req.params.id);    
  const person = persons.find(person => person.id === idParsed)
  if(!person) {
    res.status(404).end();
  } else {
    res.json(person)
  }  
})

app.delete("/api/persons/:id", (req, res) => {
  const idParsed = Number(req.params.id);    
  persons = persons.filter(person => person.id !== idParsed)  
  res.status(204).end()
})

app.post("/api/persons/", (req, res) => {

  const newPerson = {
    'id': Math.floor(Math.random()*1000),
    'name': req.body.name,
    'number': req.body.number
  }
  
  if(req.body.name !== '' && req.body.number !== '') {
    if(persons.map(person => person.name).includes(req.body.name)) {
      res.status(400).json({error: "Name must be unique"})
      return;
    } 
    res.status(201).json(newPerson);
    persons = persons.concat(newPerson);         
  } else  {
    res.status(400).json({error: "no name or number present"});
  }
})

//For both Fly.io and Render, we need to change the definition of the port our application uses at the bottom of the index.js file in the backend like so:
//Now we are using the port defined in the environment variable PORT or port 3001 if the environment variable PORT is undefined. Fly.io and Render configure the application port based on that environment variable.

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
