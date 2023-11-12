const mongoose = require('mongoose');

mongoose.set('strictQuery', false)

//el nombre de la db figura aca
const uri = process.env.MONGODB_URI

console.log('Connecting to', uri)

mongoose.connect(uri)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error conecting to MongoDB', error.message)
  })

//se crea el esquema
const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
})


// se tranforma el id a string, se saca el _id de la respuesta json
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports= mongoose.model('Person', personSchema);
