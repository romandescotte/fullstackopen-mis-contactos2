const mongoose = require('mongoose');

if(process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}



const password = process.argv[2]

//el nombre de la db figura aca
const uri = `mongodb+srv://rouman:${password}@cluster0.w7ocrxy.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(uri)

//se crea el esquema
const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
})
//se crea el modelo que sigue al esquema, la convencion es hacerlo en singular, ya que mongoose automaticamente nombra la coleccion como el plural del modelo, en este caso "people"
// los modelos tambien se llaman funciones constructor que crean objetos js basandose en los parametros dados.
const Person = mongoose.model('Person', personSchema)

const newName = process.argv[3]
const newNumber = process.argv[4]

const person = new Person({ 
  name: newName,
  number: newNumber
})

if(process.argv.length > 3) {
  person.save().then(result => {
    console.log(`added ${newName} ${newNumber} to phonebook`)
    mongoose.connection.close()
  })
}


if(process.argv.length === 3) {
 Person.find()
  .then(person => {
    console.log('Phonebook: ')
    person.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    // console.log(person),
    mongoose.connection.close()
  })
}